import type {
  ChangeEmail,
  changePassword,
  contactUs,
  DDList,
  GetUsers,
  SetupAcctProfile,
  TokenUser,
  UserDetails,
  VerifyHash,
} from '../types/request/user';
import {
  CitiesRepository,
  CodesRepository,
  CountriesRepository,
  StatesRepository,
  UserRepository,
} from '../db/repositories';
import { ServiceReturnVal, AuthParams } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IUser } from '../db/models/mongoose/user';
import { ICountries } from '../db/models/mongoose/countries';
import { IStates } from '../db/models/mongoose/states';
import { ICities } from '../db/models/mongoose/cities';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import utility from '../lib/utility';
import Base from './base';
import constants from '../common/constants';
import appFunctions from '../lib/app_functions';
import moment from 'moment';
import Emailer from '../common/emailer';
import stripe from '../lib/stripe_helper';

export default class UserService extends Base {
  private userRepo = new UserRepository();
  private emailer = new Emailer(process.env.SEND_GRID_API_KEY, {
    name: constants.SENDGRID.SENDER_NAME,
    email: constants.SENDGRID.SENDER_EMAIL,
  });

  /**
   * Function for registration of users
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async register(params: UserDetails): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const codesRepo = new CodesRepository();
      const isUser = await this.userRepo.userByEmail(params.email);
      if (utility.isEmpty(isUser)) {
        const customerId = await stripe.createCustomer({ email: params.email });

        let firstName = '',
          lastName = '',
          fullName = '';

        if (params.firstName) {
          firstName = params.firstName;
          if (!params.lastName) {
            const named = params.firstName.split(' ');
            if (named.length > 1) {
              firstName = named[0];
              lastName = named[1];
            }

            fullName = params.firstName;
          } else {
            fullName = `${params.firstName} ${params.lastName}`;
          }
        }
        if (params.lastName) lastName = params.lastName;

        const usr = {
          firstName: firstName,
          lastName: lastName,
          fullName: fullName,
          email: params.email,
          title: params.title,
          password: params.password,
          subscription: {},
          customerId: customerId,
        };
        const user = await this.userRepo.create(usr as unknown as IUser);

        // send mail to verify account
        await codesRepo.deactiveOldCodes(params.email, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT);
        const hash = utility.hash(12);
        await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT, undefined, params.email);
        const varsToReplace = {
          hash: hash,
          url: `${process.env.BASE_URL}accountvrfi/`,
        };
        const verifyEmailHtml = this.emailer.renderEmailTemplate('verify_email', varsToReplace, 'email-templates');
        await this.emailer.sendEmail(params.email, 'Verify Your OpenStoke Account', verifyEmailHtml);

        returnVal.data = user['_id'];
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_409, constants.ERROR_MESSAGES.USER_ALREAD_EXISTS);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function for login with email and password
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async login(params: UserDetails): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    try {
      const user = await this.userRepo.findOne({ email: params.email, isArchived: false });
      //If user exists
      if (
        !utility.isEmpty(user) &&
        user.type !== constants.ENUMS.LOGIN_TYPE.CUSTOM &&
        user.get('password') === undefined
      ) {
        returnVal.error = new RespError(
          constants.RESP_ERR_CODES.ERR_400,
          constants.ERROR_MESSAGES.FORGOT_PASSWORD_REQUEST
        );
      } else if (!utility.isEmpty(user) && user.get('password') !== undefined) {
        const match = bcrypt.compareSync(params.password, user.password);
        if (match) {
          const usr = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            photo: user.photo,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          };
          user.password = undefined;

          const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });

          user.lastActivity = new Date();
          user.save();
          returnVal.data = { user, token: token };
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.INVALID_PASSWORD);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for changing password
   *
   * @param {changePassword}
   * @returns {ServiceReturnVal}
   */
  public async changePassword(params: changePassword, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const usr = await this.userRepo.findById(user._id);

      //If user exists
      if (!utility.isEmpty(usr)) {
        usr.lastActivity = new Date();
        usr.save();
        const oldPasswordMatch = await bcrypt.compare(params.oldPassword, usr.password);
        const newPasswordMatch = await bcrypt.compare(params.password, usr.password);
        if (!oldPasswordMatch) {
          returnVal.error = new RespError(
            constants.RESP_ERR_CODES.ERR_422,
            constants.ERROR_MESSAGES.PASSWORD_NOT_MATCHED
          );
        } else if (newPasswordMatch) {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_422, constants.ERROR_MESSAGES.SAME_OLD_PASSWORD);
        } else {
          const password = await bcrypt.hash(params.password, 10);
          await this.userRepo.updateById(user._id, { password: password });
          returnVal.data = constants.SUCCESS_MESSAGES.PASSWORD_CHANGED;
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
      return returnVal;
    }
    return returnVal;
  }

  /**
   * Function for update user profile
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async update(params: UserDetails, user: TokenUser): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const usr = await this.userRepo.findOne({ _id: user._id });
      if (!utility.isEmpty(usr)) {
        returnVal.data = await this.userRepo.update(usr._id, params as unknown as IUser);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to verify the email
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async verifyEmail(params: UserDetails): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const user = await this.userRepo.findOne({ email: params.email });
      if (utility.isEmpty(user)) {
        await this.userRepo.create({ email: params.email, subscription: {} } as unknown as IUser);
      }
      if (!utility.isEmpty(user) && user.get('password') !== undefined) {
        returnVal.data = user._id;
      } else {
        await codesRepo.deactiveOldCodes(params.email, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT);
        const hash = utility.hash(12);
        await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT, undefined, params.email);
        const varsToReplace = {
          hash: hash,
          url: `${process.env.BASE_URL}accountvrfi/`,
        };
        const verifyEmailHtml = this.emailer.renderEmailTemplate('verify_email', varsToReplace, 'email-templates');
        await this.emailer.sendEmail(params.email, 'Verify Your OpenStoke Account', verifyEmailHtml);
        returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_SEND;
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to set the password
   *
   * @param {VerifyHash}
   * @returns {ServiceReturnVal}
   */
  public async setPassword(params: VerifyHash): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const codes = await codesRepo.findOne({ code: params.hash, type: params.type });
      if (!utility.isEmpty(codes)) {
        const createdTime = moment.utc(codes.createdAt);
        const currentTime = moment().utc();
        const diffInTime = currentTime.diff(createdTime, 'minutes');
        const expiresIn =
          params.type === constants.ENUMS.HASH_TYPES.INVITE_EMAIL
            ? constants.ENUMS.HASH_EXPIRES_IN.INVITE_EXPIRY
            : constants.ENUMS.HASH_EXPIRES_IN.DEFAULT_EXPIRY;
        if (diffInTime <= expiresIn) {
          const setParams = {
            isEmailVerified: true,
          };
          if (params.password) {
            const password = await bcrypt.hash(params.password, 10);
            setParams['password'] = password;
          }
          if (params.type !== constants.ENUMS.HASH_TYPES.RESET_PASSWORD) {
            const customerId = await stripe.createCustomer({ email: codes.email });
            setParams['customerId'] = customerId;
            const welcomeEmailHtml = this.emailer.renderEmailTemplate('welcome_email', {}, 'email-templates');
            await this.emailer.sendEmail(codes.email, 'Welcome to OpenStroke', welcomeEmailHtml);
          }
          if (params.type === constants.ENUMS.HASH_TYPES.INVITE_EMAIL) {
            setParams['status'] = constants.ENUMS.USER_STATUS.NONE;
          }
          await this.userRepo.updateByEmail(codes.email, setParams as unknown as IUser);
          returnVal.data = constants.SUCCESS_MESSAGES.PASSWORD_SET;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_410, constants.ERROR_MESSAGES.HASH_EXPIRED);
        }
        await codesRepo.deactiveCode(params.hash);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.HASH_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /*Function for social auth (google and facebook)
   *
   * @param {AuthParams}
   * @returns {ServiceReturnVal}
   */
  public async socialLogin(params: AuthParams): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      let user = await this.userRepo.updateByEmail(params.email, {
        photo: params.photo,
        lastActivity: new Date(),
      } as unknown as IUser);
      if (utility.isEmpty(user)) {
        const customerId = await stripe.createCustomer({ email: params.email });
        user = await this.userRepo.create({
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          fullName: params.lastName ? `${params.firstName} ${params.lastName}` : params.firstName,
          photo: params.photo,
          type: params.type,
          subscription: {},
          isEmailVerified: true,
          customerId: customerId,
        } as unknown as IUser);
        const welcomeEmailHtml = this.emailer.renderEmailTemplate('welcome_email', {}, 'email-templates');

        await this.emailer.sendEmail(params.email, 'Welcome to OpenStroke', welcomeEmailHtml);
      }
      const usr = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };

      const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
      returnVal.data = { user, token: token };
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to show customers list
   *
   * @param {GetUsers}
   * @returns {ServiceReturnVal}
   */
  public async usersList(params: GetUsers, user: TokenUser): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      const page = parseInt(params.page);
      const limit = parseInt(params.limit);
      const seacrh = params.search || '';

      if (user.role == constants.ENUMS.ROLE.ADMIN) {
        const users = await this.userRepo.fetchUsers(
          {
            $or: [
              { email: { $regex: seacrh } },
              { firstName: { $regex: seacrh, $options: 'i' } },
              { lastName: { $regex: seacrh, $options: 'i' } },
              { plan: { $regex: seacrh, $options: 'i' } },
            ],
            role: constants.ENUMS.ROLE.USER,
            isArchived: JSON.parse(params.isArchived),
          },
          undefined,
          undefined,
          page,
          limit,
          appFunctions.userSortFields(params.orderBy, params.order)
        );
        const count = await this.userRepo.countDocuments(limit);
        returnVal.data = {
          users,
          currentPage: page,
          totalPages: Math.ceil(count / limit),
        };
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.NOT_AUTHORISED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function setup user profile
   *
   * @param {SetupAcctProfile}
   * @returns {ServiceReturnVal}
   */
  public async setupAcctProfile(params: SetupAcctProfile, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const userDetails = {
        firstName: params.firstName,
        lastName: params.lastName,
        title: params.title,
      };

      if (!utility.isEmpty(params.files) && !utility.isEmpty(params.files['assets'])) {
        const imageInfo = params.files['assets'][0];
        userDetails['photo'] = imageInfo['location'];
      }
      await this.userRepo.updateById(user._id, userDetails as unknown as IUser);
      returnVal.data = constants.SUCCESS_MESSAGES.OK;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to get email from hash
   *
   * @param {VerifyHash}
   * @returns {ServiceReturnVal}
   */
  public async getEmail(params: VerifyHash): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const codes = await codesRepo.findOne({ code: params.hash });
      if (!utility.isEmpty(codes)) {
        const createdTime = moment.utc(codes.createdAt);
        const currentTime = moment().utc();
        const diffInTime = currentTime.diff(createdTime, 'minutes');
        if (diffInTime <= constants.ENUMS.HASH_EXPIRES_IN.DEFAULT_EXPIRY) {
          returnVal.data = codes.email;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_410, constants.ERROR_MESSAGES.HASH_EXPIRED);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.HASH_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to send reset password link
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async forgotPassword(params: UserDetails): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const user = await this.userRepo.findOne({ email: params.email });

      if (
        (!utility.isEmpty(user) && user.get('password') !== undefined) ||
        user.type !== constants.ENUMS.LOGIN_TYPE.CUSTOM
      ) {
        await codesRepo.deactiveOldCodes(params.email, constants.ENUMS.HASH_TYPES.RESET_PASSWORD);
        const hash = utility.hash(12);
        await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.RESET_PASSWORD, undefined, params.email);
        const varsToReplace = {
          hash: hash,
          url: `${process.env.BASE_URL}accountresetpass/`,
        };
        const resetPasswordEmailHtml = this.emailer.renderEmailTemplate(
          'reset_password',
          varsToReplace,
          'email-templates'
        );
        await this.emailer.sendEmail(params.email, 'Reset Password Link', resetPasswordEmailHtml);
        returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_SEND;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to fetch list of countries
   *
   * @param {DDList}
   * @returns {ServiceReturnVal}
   */
  public async countriesList(params: DDList): Promise<ServiceReturnVal<ICountries>> {
    const returnVal: ServiceReturnVal<ICountries> = {};
    try {
      const countriesRepo = new CountriesRepository();
      const page = params.page || 1;
      const limit = params.limit || 0;
      const search = params.search || '';

      const countries = await countriesRepo.fetchCountries(
        { name: { $regex: search, $options: 'i' } },
        undefined,
        { lean: true },
        page,
        limit
      );
      returnVal.data = countries as ICountries;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to fetch list of states
   *
   * @param {DDList}
   * @returns {ServiceReturnVal}
   */
  public async statesList(params: DDList): Promise<ServiceReturnVal<IStates>> {
    const returnVal: ServiceReturnVal<IStates> = {};
    try {
      const statesRepo = new StatesRepository();
      const page = params.page || 1;
      const limit = params.limit || 0;
      const search = params.search || '';

      const states = await statesRepo.fetchStates(
        { countryId: params.id, name: { $regex: search, $options: 'i' } },
        undefined,
        { lean: true },
        page,
        limit
      );
      returnVal.data = states as IStates;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to fetch list of cities
   *
   * @param {DDList}
   * @returns {ServiceReturnVal}
   */
  public async citiesList(params: DDList): Promise<ServiceReturnVal<ICities>> {
    const returnVal: ServiceReturnVal<ICities> = {};
    try {
      const citiesRepo = new CitiesRepository();
      const page = params.page || 1;
      const limit = params.limit || 0;
      const search = params.search || '';

      const cities = await citiesRepo.fetchCities(
        { stateId: params.id, name: { $regex: search, $options: 'i' } },
        undefined,
        { lean: true },
        page,
        limit
      );
      returnVal.data = cities as ICities;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function for get logged-in user
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async loggedUser(user: TokenUser): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const usr = (await this.userRepo.fetchUser({ _id: user._id })) as IUser;
      if (!utility.isEmpty(usr)) {
        const res = usr.toJSON();

        returnVal.data = res as unknown as IUser;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to send update email link
   *
   * @param {changeEmail}
   * @returns {ServiceReturnVal}
   */
  public async updateEmail(params: ChangeEmail, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const usr = await this.userRepo.findOne({ email: user.email });

      if (!utility.isEmpty(user)) {
        await codesRepo.deactiveOldCodes(params.newEmail, constants.ENUMS.HASH_TYPES.UPDATE_EMAIL);
        const hash = utility.hash(12);
        await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.UPDATE_EMAIL, usr._id, params.newEmail);
        const varsToReplace = {
          hash: hash,
          url: `${process.env.BASE_URL}emailverify/`,
        };
        const updateEmailHtml = this.emailer.renderEmailTemplate('update_email', varsToReplace, 'email-templates');
        await this.emailer.sendEmail(params.newEmail, 'Update Email Link', updateEmailHtml);
        returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_SEND;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to set the new email
   *
   * @param {VerifyHash}
   * @returns {ServiceReturnVal}
   */
  public async newEmail(params: VerifyHash): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const codes = await codesRepo.findOne({ code: params.hash, type: params.type });
      if (!utility.isEmpty(codes)) {
        const createdTime = moment.utc(codes.createdAt);
        const currentTime = moment().utc();
        const diffInTime = currentTime.diff(createdTime, 'minutes');
        if (diffInTime <= constants.ENUMS.HASH_EXPIRES_IN.DEFAULT_EXPIRY) {
          await this.userRepo.updateById(codes.userId.toString(), {
            email: codes.email,
          } as unknown as IUser);
          returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_UPDATED;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_410, constants.ERROR_MESSAGES.HASH_EXPIRED);
        }
        await codesRepo.deactiveCode(params.hash);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.HASH_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  /**
   * Function to invite the user by admin
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async invite(params: UserDetails, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      if (user.role == constants.ENUMS.ROLE.ADMIN) {
        const usr = await this.userRepo.findOne({ email: params.email });
        if (utility.isEmpty(usr)) {
          await this.userRepo.create({
            email: params.email,
            status: constants.ENUMS.USER_STATUS.INVITED,
            subscription: {},
          } as unknown as IUser);
        }
        if (!utility.isEmpty(usr) && usr.get('password') !== undefined) {
          returnVal.data = usr._id;
        } else {
          await codesRepo.deactiveOldCodes(params.email, constants.ENUMS.HASH_TYPES.INVITE_EMAIL);
          const hash = utility.hash(12);
          await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.INVITE_EMAIL, undefined, params.email);
          const varsToReplace = {
            hash: hash,
            url: `${process.env.BASE_URL}emailinvite/`,
          };
          const inviteEmailHtml = this.emailer.renderEmailTemplate('invite_email', varsToReplace, 'email-templates');
          await this.emailer.sendEmail(params.email, 'Joining Invatation From OpenStroke', inviteEmailHtml);
          returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_SEND;
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.NOT_AUTHORISED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to archive the user by admin
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async archive(params: UserDetails, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      if (user.role == constants.ENUMS.ROLE.ADMIN) {
        const usr = await this.userRepo.findById(params.id);
        if (!utility.isEmpty(usr) && usr.isArchived === false) {
          usr.isArchived = true;
          usr.save();
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.NOT_AUTHORISED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to unarchive the user by admin
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async unarchive(params: UserDetails, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      if (user.role == constants.ENUMS.ROLE.ADMIN) {
        const usr = await this.userRepo.findById(params.id);
        if (!utility.isEmpty(usr) && usr.isArchived === true) {
          usr.isArchived = false;
          usr.save();
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.NOT_AUTHORISED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to unarchive the user by admin
   *
   * @param {contactUs}
   * @returns {ServiceReturnVal}
   */
  public async contactUs(params: contactUs): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const name = params.name;
      const email = params.email;
      const message = params.message;

      // sending mail
      const varsToReplace = {
        name: name,
        email: email,
        message: message,
      };

      const subject = `Contact Us Request Raised By ${name}`;

      const inviteEmailHtml = this.emailer.renderEmailTemplate('contact_us', varsToReplace, 'email-templates');
      await this.emailer.sendEmail('hello@sketchish.com', subject, inviteEmailHtml);
      returnVal.data = constants.SUCCESS_MESSAGES.OK;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, (error as Error).message);
    }
    return returnVal;
  }
}
