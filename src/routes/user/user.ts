import { Router } from 'express';
import UserController from '../../controller/user';
import constants from '../../common/constants';
import s3Helper from '../../lib/s3_helper';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

export default class UserRoute {
  public router: Router;
  public controller = new UserController();

  private upload = multer({
    storage: multerS3({
      s3: s3Helper.s3Client(),
      bucket: constants.AWS_BUCKET_NAME,
      acl: 'public-read',
      key: function (_request, file, cb) {
        const fileName = `${constants.ASSET_FOLDER_PATH.USER}/${file.fieldname}-${Date.now()}${path.extname(
          file.originalname
        )}`;
        cb(null, fileName);
      },
    }),
  });

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/services/register', this.controller.register.bind(this.controller));
    this.router.post('/services/login', this.controller.login.bind(this.controller));
    this.router.put('/user/change-password', this.controller.changePassword.bind(this.controller));
    this.router.put('/user/update', this.controller.update.bind(this.controller));
    this.router.post('/services/verify-email', this.controller.verifyEmail.bind(this.controller));
    this.router.post('/services/social-login', this.controller.socialLogin.bind(this.controller));
    this.router.get('/user/list', this.controller.usersList.bind(this.controller));
    this.router.post('/services/set-password', this.controller.setPassword.bind(this.controller));
    this.router.put(
      '/user/setup-account',
      this.upload.fields([{ name: 'assets', maxCount: 1 }]),
      this.controller.setupAcctProfile.bind(this.controller)
    );
    this.router.get('/services/get-email/:hash', this.controller.getEmail.bind(this.controller));
    this.router.post('/services/forgot-password', this.controller.forgotPassword.bind(this.controller));
    this.router.get('/services/DDlist-countries', this.controller.countriesList.bind(this.controller));
    this.router.get('/services/DDlist-states', this.controller.statesList.bind(this.controller));
    this.router.get('/services/DDlist-cities', this.controller.citiesList.bind(this.controller));
    this.router.get('/user', this.controller.loggedUser.bind(this.controller));
    this.router.post('/user/update-email', this.controller.updateEmail.bind(this.controller));
    this.router.post('/services/new-email', this.controller.newEmail.bind(this.controller));
    this.router.post('/user/invite', this.controller.invite.bind(this.controller));
    this.router.delete('/user/archive/:id', this.controller.archive.bind(this.controller));
    this.router.put('/user/unarchive/:id', this.controller.unarchive.bind(this.controller));
    this.router.post('/services/user/contact-us', this.controller.contactUs.bind(this.controller));
  }
}
