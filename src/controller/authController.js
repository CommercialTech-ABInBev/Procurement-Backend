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
  VendorDetail,
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
      let user;
      let vendorDetails;
      if (req.body.vendorId) {
        body = {
          vendorId: req.body.vendorId,
          password: hashPassword(req.body.password),
          role: 'supplier'
        };
        user = await addEntity(User, { ...body });
        vendorDetails = await addEntity(VendorDetail, { userId: user.id, vendorId: req.body.vendorId });
      } else {
        body = {
          email: req.body.email,
          password: hashPassword(req.body.password),
          role: req.body.admin ? 'admin' : 'staff'
        };
        user = await addEntity(User, { ...body });
      }
 
      user.token = createToken({
        email: user.email,
        id: user.id,
        role: user.role,
        supplierApproval: vendorDetails !== undefined ? vendorDetails.approvalStatus : null,
        vendorId: vendorDetails !== undefined ? vendorDetails.vendorId : null
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, vendorDetails }, 201);
    } catch (error) {
      console.error(error);
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
      if (!comparePassword(password, user.password)) return errorResponse(res, { code: 401, message: 'incorrect password or email' });
      const vendorDetails = await findByKey(VendorDetail, { userId: user.id });
      user.token = createToken({
        email: user.email,
        id: user.id,
        role: user.role,
        supplierApproval: vendorDetails !== null ? vendorDetails.approvalStatus : null,
        vendorId: vendorDetails !== null ? vendorDetails.vendorId : null
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
