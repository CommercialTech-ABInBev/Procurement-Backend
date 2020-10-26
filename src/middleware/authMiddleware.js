import { AuthValidation, GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { superAdminSchema, rolesSchema } from '../validation/adminValidation';
import { changePasswordSchema, passwordResetEmailSchema } from '../validation/passwordValidation';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse, checkToken, verifyToken, validate, successResponse
} = Toolbox;
const {
  validateSignup, validateLogin,
} = AuthValidation;
const {
  validateEmail
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  User, RoleUser
} = database;
const AuthMiddleware = {
  /**
   * middleware for user signup
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifySignup(req, res, next) {
    try {
      let user;
      const { email } = req.body;
      if (req.path === '/signup/check') {
        validateEmail(req.body);
        user = await findByKey(User, { email });
        if (user) return successResponse(res, { message: 'User Exist' });
        return errorResponse(res, { code: 409, message: 'Sorry, that email address seems to be invalid, kindly review the address' });
      }
      validateSignup(req.body);
      user = await findByKey(User, { email });
      // const userNameUnique = await findByKey(User, { userName });
      if (user) return errorResponse(res, { code: 409, message: 'Sorry, that email address seems to be invalid, kindly review the address' });
      // if (userNameUnique) return errorResponse(res, { code: 409, message: `User with userName "${userName}" already exists` });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for user login
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returened by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyLogin(req, res, next) {
    try {
      validateLogin(req.body);
      const { vendorIdOrEmail } = req.body;
      let user = await findByKey(User, { email: vendorIdOrEmail });
      if (!user) user = await findByKey(User, { vendorId: vendorIdOrEmail });
      if (!user) return errorResponse(res, { code: 404, message: 'email or vendorId does not match anything in our database' });
      req.userData = user;
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * user authentication
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async authenticate(req, res, next) {
    try {
      const token = checkToken(req);
      if (!token) return errorResponse(res, { code: 401, message: 'Access denied, Token required' });
      req.tokenData = verifyToken(token);
      next();
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'The token provided was invalid' });
      }
    }
  },

  /**
   * middleare for user role settings
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof AuthMiddleware
   */
  async roleSettings(req, res, next) {
    try {
      const schema = (req.body.email) ? rolesSchema : superAdminSchema;
      const { error } = validate(req.body, schema);
      if (error) {
        const message = error.details[0].context.label;
        return errorResponse(res, { code: 400, message });
      }
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * verify user role
   * @param {array} permissions - array with role id's permitted on route
   * @returns {function} - returns an async functon
   * @memberof AuthMiddleware
   */
  verifyRoles(permissions) {
    return async function bar(req, res, next) {
      try {
        const { id } = req.tokenData;
        const user = await findByKey(User, { id });
        if (!user) return errorResponse(res, { code: 404, message: 'user in token does not exist' });
        const { roleId } = await findByKey(RoleUser, { userId: id });
        const permitted = permissions.includes(roleId);
        if (!permitted) return errorResponse(res, { code: 403, message: 'Halt! You\'re not authorised' });
        next();
      } catch (error) {
        errorResponse(res, {});
      }
    };
  },
  /**
   * verify password resets
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyPasswordReset(req, res, next) {
    try {
      const schema = req.body.email ? passwordResetEmailSchema : changePasswordSchema;
      const { error } = validate(req.body, schema);
      if (error) {
        const message = 'Please make sure the passwords match';
        return errorResponse(res, { code: 400, message });
      }
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * check if user is verified
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyUser(req, res, next) {
    try {
      const { id } = req.tokenData;
      const user = await findByKey(User, { id });
      if (!user) return errorResponse(res, { code: 404, message: 'User does not exists. Please check your details' });
      if (!user.verified) return errorResponse(res, { code: 401, message: 'Please Verify Your Email' });
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }
};

export default AuthMiddleware;
