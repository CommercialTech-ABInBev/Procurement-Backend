/* eslint-disable no-unused-expressions */
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
  RoleUser,
  Role
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
      let body;
      let role;
      let roleUser;
      let user;
      if (req.body.supplier) {
        body = {
          vendorId: req.body.vendorId,
          password: hashPassword(req.body.password),
          supplier: req.body.supplier,
        };
        user = await addEntity(User, { ...body });
        role = await findByKey(Role, { role: 'supplier' });
        roleUser = await addEntity(RoleUser, { userId: user.id, roleId: role.id });
      } else {
        body = {
          email: req.body.email,
          password: hashPassword(req.body.password),
        };
        user = await addEntity(User, { ...body });
        req.body.admin ? role = await findByKey(Role, { role: 'admin' }) : role = await findByKey(Role, { role: 'staff' });
        roleUser = await addEntity(RoleUser, { userId: user.id, roleId: role.id });
      }

      user.token = createToken({
        email: user.email,
        id: user.id,
        roleId: roleUser.roleId,
        verified: user.verified
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, roleUser }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * user login
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async login(req, res) {
    try {
      const { password } = req.body;
      const user = req.userData;
      const { roleId } = await findByKey(RoleUser, { userId: user.id });
      if (!comparePassword(password, user.password)) return errorResponse(res, { code: 401, message: 'incorrect password or email' });
      user.token = createToken({
        email: user.email,
        id: user.id,
        roleId,
        vendorId: user.vendorId,
        name: user.name,
        companyName: user.companyName,
        verified: user.verified
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { message: 'Login Successful', token: user.token });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * get user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - A jsom response with user details
   * @memberof UserController
   */
  async getProfile(req, res) {
    try {
      const { id } = req.tokenData;
      const user = await findByKey(User, { id });
      successResponse(res, { user });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
