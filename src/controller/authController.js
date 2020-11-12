/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox, Mailer } from '../util';
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
const {
  sendPasswordResetEmail
} = Mailer;
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
   * user reset password email
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async resetPasswordEmailLink(req, res) {
    try {
      const { vendorIdOrEmail } = req.body;
      let vendor;
      let user = await findByKey(User, { email: vendorIdOrEmail });
      if (!user) {
        user = await findByKey(User, { vendorId: vendorIdOrEmail });
        vendor = await findByKey(VendorDetail, { vendorId: vendorIdOrEmail });
      }
      if (!user) return errorResponse(res, { code: 404, message: 'email or vendorId does not match anything in our database' });
      // TODO: uncomment for production
      const emailSent = await sendPasswordResetEmail(req, user, vendor);
      // TODO: delete bottom line for production
      // const emailSent = true;
      if (emailSent) return successResponse(res, { message: 'A password reset link has been sent to your email' });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

    /**
   * verify reset password link
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async verifyResetPasswordLink(req, res) {
    try {
      const { token } = req.query;verifyToken
      const tokenData = (token);
      if (tokenData) {
        res.cookie('token', token, { maxAge: 70000000, httpOnly: true });
        // const url = `${req.protocol}s://${req.get('host')}/v1.0/api/auth/set-password`;
        // successResponse(res, { message: `success, redirect to api route ${url} with password objects` });
        return res.redirect(`${CLIENT_URL}/set-password?token=${token}`);
      }
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'The token provided was invalid' });
      }
      const status = error.status || 500;
      errorResponse(res, { code: status, message: `could not verify, ${error.message}` });
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
