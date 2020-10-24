import { AuthValidation } from '../validation';
import { Toolbox } from '../util';
import { superAdminSchema, rolesSchema } from '../validation/adminValidation';
import { changePasswordSchema, passwordResetEmailSchema } from '../validation/passwordValidation';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse, checkToken, verifyToken, validate, successResponse
} = Toolbox;
const {
  validateSignup, validateLogin, validateUsername,
} = AuthValidation;
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
      validateSignup(req.body);
      const { email, userName } = req.body;
      const user = await findByKey(User, { email });
      const userNameUnique = await findByKey(User, { userName });
      if (user) return errorResponse(res, { code: 409, message: `User with email "${email}" already exists` });
      if (userNameUnique) return errorResponse(res, { code: 409, message: `User with userName "${userName}" already exists` });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for username check
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async checkUsername(req, res, next) {
    try {
      const { id } = req.tokenData;
      validateUsername(req.query);
      const { userName, change } = req.query;
      const user = await findByKey(User, { userName });
      if (!user) {
        if (change === 'true') return next();
        return successResponse(res, { message: `username: ${userName} is free` });
      }
      if (user.id !== id) return errorResponse(res, { code: 409, message: 'username has already been taken' });
      if (user.id === id) return errorResponse(res, { code: 400, message: 'usernamr entered is the same as before' });
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
      const { usernameOrEmail } = req.body;
      let user = await findByKey(User, { email: usernameOrEmail });
      if (!user) user = await findByKey(User, { userName: usernameOrEmail });
      if (!user) return errorResponse(res, { code: 404, message: 'username or email does not match anything in our database' });
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
