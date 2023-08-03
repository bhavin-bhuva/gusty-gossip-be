import UserService from '../services/user';
import User from '../validations/user/user';
import WRRequest from '../lib/wr_request';
import { Response } from 'express';
import {
  ChangeEmail,
  changePassword,
  contactUs,
  DDList,
  GetUsers,
  SetupAcctProfile,
  UserDetails,
  VerifyHash,
} from '../types/request/user';
import { RespError, WRResponse } from '../lib/wr_response';
import { AuthParams } from '../types/common';

export default class UserController {
  private service = new UserService();
  private resp = new WRResponse();

  public async register(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getCreateUserVS(false);
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.register(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async login(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getLoginVS();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.login(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async changePassword(request: WRRequest<undefined, changePassword, undefined>, response: Response) {
    const valSchema = new User().getChangePasswordVS();
    const result = valSchema.validate(request.body);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.changePassword(request.body, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async update(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getUpdateVS();
    const params = request.body;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.update(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async verifyEmail(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().verifyEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.verifyEmail(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async socialLogin(request: WRRequest<undefined, AuthParams, undefined>, response: Response) {
    const valSchema = new User().getAuthVS();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.socialLogin(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async usersList(request: WRRequest<GetUsers, undefined, undefined>, response: Response) {
    const valSchema = new User().getUserListVs();
    const params = request.query;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.usersList(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async setPassword(request: WRRequest<undefined, VerifyHash, undefined>, response: Response) {
    const valSchema = new User().getSetPassword();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.setPassword(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async setupAcctProfile(request: WRRequest<undefined, SetupAcctProfile, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new User().getAcctProfile();
    const result = valSchema.validate(params);
    if (result.error == null) {
      params.files = request.files;
      const resp = await this.service.setupAcctProfile(params, request.currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async getEmail(request: WRRequest<undefined, undefined, VerifyHash>, response: Response) {
    const valSchema = new User().getEmail();
    const params = request.params;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.getEmail(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async forgotPassword(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().verifyEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const result = await this.service.forgotPassword(params);
      this.resp.resp(response).send(result);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async countriesList(request: WRRequest<DDList, undefined, undefined>, response: Response) {
    const valSchema = new User().DDListCountriesVS();
    const params = request.query;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.countriesList(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async statesList(request: WRRequest<DDList, undefined, undefined>, response: Response) {
    const valSchema = new User().DDListVS();
    const params = request.query;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.statesList(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async citiesList(request: WRRequest<DDList, undefined, undefined>, response: Response) {
    const valSchema = new User().DDListVS();
    const params = request.query;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.citiesList(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async loggedUser(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.loggedUser(currentUser);
    this.resp.resp(response).send(resp);
  }

  public async updateEmail(request: WRRequest<undefined, ChangeEmail, undefined>, response: Response) {
    const valSchema = new User().verifyUpdatedEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const result = await this.service.updateEmail(params, currentUser);
      this.resp.resp(response).send(result);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async newEmail(request: WRRequest<undefined, VerifyHash, undefined>, response: Response) {
    const valSchema = new User().UpdatedEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.newEmail(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async invite(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().verifyEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.invite(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async archive(request: WRRequest<undefined, undefined, UserDetails>, response: Response) {
    const valSchema = new User().userByIdVS();
    const params = request.params;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.archive(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async unarchive(request: WRRequest<undefined, undefined, UserDetails>, response: Response) {
    const valSchema = new User().userByIdVS();
    const params = request.params;
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.unarchive(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async contactUs(request: WRRequest<undefined, contactUs, undefined>, response: Response) {
    const valSchema = new User().contactUs(false);
    let params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.contactUs(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
