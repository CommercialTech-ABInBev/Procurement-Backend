/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
  successResponse,
  errorResponse,
  createToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = Toolbox;
// const {
//   sendVerificationEmail,
//   sendPasswordResetEmail
// } = Mailer;
const {
  addEntity,
  updateByKey,
  findByKey
} = GeneralService;
const {
  User,
  RoleUser
} = database;
// const {
//   ADMIN_KEY,
//   CLIENT_URL
// } = env;

const AuthController = {
  /**
   * user signup
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async signup(req, res) {
    try {
      const body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword(req.body.password),
        supplier: req.body.supplier,
        companyTheme: req.body.companyTheme
      };
      const user = await addEntity(User, { ...body });
      let role;
      if (req.body.supplier) role = await addEntity(RoleUser, { userId: user.id, roleId: 3 });
      else role = await addEntity(RoleUser, { userId: user.id, roleId: 4 });

      user.token = createToken({
        email: user.email,
        id: user.id,
        userName: user.userName,
        roleId: role.roleId,
        firstName: user.firstName,
        verified: user.verified
      });
      // TODO: uncomment for production
      // const emailSent = await sendVerificationEmail(req, user);
      // TODO: delete bottom line for production
      // const emailSent = true;
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, role }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
