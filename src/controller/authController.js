/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
import vendordetails from '../models/vendordetails';
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
  Notification
} = database;

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
        if (vendorDetails){
          await addEntity(Notification, {
            to: vendorDetails.companyName || req.body.vendorId,
            from: 'admin',
            userId: user.id,
            subject: 'Welcome to PMS',
            message: 'A big welcome to you. Please ensure to fill in your details in the company details tab and submit for approval.\nWe will definitely get back to you as soon as possible.\nHappy doing business with you.'
          });
        }
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

   /**
   * reset user password
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async resetPassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { id } = req.tokenData;
      let user = await findByKey(User, { id });
      if (!user) return errorResponse(res, { code: 404, message: 'Sorry, user in token does not exist' });
      if (!comparePassword(oldPassword, user.password)) return errorResponse(res, { code: 401, message: 'Old password is incorrect' });
      const hashedPassword = hashPassword(newPassword);
      user = await updateByKey(User, { password: hashedPassword }, { id });
      successResponse(res, { message: 'Password has been changed successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * logs user out
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async logoutUser(req, res) {
    try {
      const token = '';
      res.cookie('token', token, { maxAge: 0, httpOnly: true });
      return successResponse(res, { message: 'Logout Successful', token });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
