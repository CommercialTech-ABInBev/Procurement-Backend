/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox, Mailer } from '../util';
import database from '../models';
import { env } from '../config';

const {
  successResponse,
  errorResponse,
  createToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = Toolbox;
const {
  sendPasswordResetEmail,
  sendVerificationEmail
} = Mailer;
const {
  addEntity,
  updateByKey,
  findByKey,
  deleteByKey
} = GeneralService;
const {
  User,
  VendorDetail,
  Notification,
  Subject
} = database;
const {
  CLIENT_URL
} = env;

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
      let body, user, vendorDetails, emailSent, subject;
      if (req.body.vendorId) {
        body = {
          vendorId: req.body.vendorId,
          password: hashPassword(req.body.password),
          role: 'supplier',
          verified: true
        };
        user = await addEntity(User, { ...body });
        vendorDetails = await addEntity(VendorDetail, {
          userId: user.id,
          vendorId: req.body.vendorId
        });
        if (vendorDetails) {
          subject = await addEntity(Subject, {
            subject: 'Welcome to IB Vendor Central',
            vendor: vendorDetails.companyName || req.body.vendorId,
            vendorRead: false
          });
          await addEntity(Notification, {
            to: vendorDetails.companyName || req.body.vendorId,
            from: 'admin',
            userId: user.id,
            subjectId: subject.id,
            read: true,
            message: 'A big welcome to you. Please ensure to fill in your details in the company profile tab and submit for approval.\nWe will definitely get back to you as soon as possible.\nHappy doing business with you.'
          });
        }
      } else if (req.body.role === 'super_admin') {
        body = {
          email: req.body.email,
          password: hashPassword(req.body.password),
          role: 'super_admin',
          verified: true
        };
        user = await addEntity(User, { ...body });
      } else {
        body = {
          email: req.body.email,
          password: hashPassword(req.body.password),
          role: req.body.admin ? 'admin' : 'staff',
          verified: true
        };
        user = await addEntity(User, { ...body });
      }

      if (user.role === 'staff') {
        emailSent = await sendVerificationEmail(req, user);
        return successResponse(res, { user, emailSent, message: 'A verification link has been Sent to your email, please verify your account' }, 201);
      }
      user.token = createToken({
        email: user.email,
        id: user.id,
        role: user.role,
        supplierApproval: vendorDetails !== undefined ? vendorDetails.approvalStatus : null,
        vendorId: vendorDetails !== undefined ? vendorDetails.vendorId : null,
        verified: user.verified
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, vendorDetails, emailSent }, 201);
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
      if (!comparePassword(password, user.password)) return errorResponse(res, { code: 401, message: 'Incorrect password' });
      // eslint-disable-next-line max-len
      // if (user.role === 'staff' && !user.verified) return errorResponse(res, { code: 409, message: 'Not Verified, Please check your email and verify your account.' });
      const vendorDetails = await findByKey(VendorDetail, { userId: user.id });
      user.token = createToken({
        email: user.email,
        id: user.id,
        role: user.role,
        supplierApproval: vendorDetails !== null ? vendorDetails.approvalStatus : null,
        vendorId: vendorDetails !== null ? vendorDetails.vendorId : null,
        verified: user.verified
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, {
        message: (user.role === 'staff' && user.verified === 'false')
          ? 'Please verifiy your account to use the platform' : 'Login Successful',
        token: user.token
      });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * verify user email
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const tokenData = verifyToken(token);
      const { id } = tokenData;
      await updateByKey(User, { verified: true }, { id });
      const user = await findByKey(User, { id });
      const newToken = createToken({
        email: user.email,
        id: user.id,
        role: user.role,
        verified: user.verified
      });
      res.cookie('token', newToken, { maxAge: 70000000, httpOnly: true });
      return res.redirect(`${CLIENT_URL}/staff?token=${newToken}`);
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'We could not verify your email, the token provided was invalid' });
      }
      if (error.message === 'Not Found') {
        return errorResponse(res, { code: 404, message: 'Sorry, we do not recognise this user in our database' });
      }
      errorResponse(res, {});
    }
  },

  /**
   * user gets a new email verification link
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async resendEmailVerificationLink(req, res) {
    try {
      const { email } = req.body;
      const user = await findByKey(User, { email });
      if (!user) return errorResponse(res, { code: 404, message: `User with email ${email} does not exist` });
      if (user.role !== 'staff') return errorResponse(res, { code: 409, message: 'This user is not a staff and does not need to be verified to access the platform' });
      // TODO: uncomment for production
      const emailSent = await sendVerificationEmail(req, user);
      // TODO: delete bottom line for production
      // const emailSent = true;
      if (emailSent) return successResponse(res, { message: 'An Email Verification link has been resent to your email' });
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
      if (!user) return errorResponse(res, { code: 404, message: 'Email or VendorId does not match anything in our database' });
      // TODO: uncomment for production
      const emailSent = await sendPasswordResetEmail(req, user, vendor);
      // TODO: delete bottom line for production
      // const emailSent = true;
      if (emailSent) return successResponse(res, { message: 'A password reset link has been sent to your email' });
    } catch (error) {
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
      const { token } = req.query;
      const tokenData = (token);
      if (tokenData) {
        res.cookie('token', token, { maxAge: 70000000, httpOnly: true });
        // const url = `${req.protocol}s://${req.get('host')}/v1.0/api/auth/set-password`;
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
   * one time password set
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async setPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { id } = req.tokenData;
      let user = await findByKey(User, { id });
      if (!user) return errorResponse(res, { code: 404, message: 'Sorry, user in token does not exist' });
      const hashedPassword = hashPassword(newPassword);
      user = await updateByKey(User, { password: hashedPassword }, { id });
      successResponse(res, { message: 'Password has been set successfully' });
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

  /**
   * deactivate a user by an admin
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async deactivateUsers(req, res) {
    try {
      const { id, email, vendorId } = req.query;
      let user;
      if (id) user = await deleteByKey(User, { id });
      if (email) user = await deleteByKey(User, { email });
      if (vendorId) user = await deleteByKey(User, { vendorId });
      return successResponse(res, { message: 'User Deleted Successfully', user });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
