import { AuthValidation, GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { superAdminSchema, rolesSchema } from '../validation/adminValidation';
import { changePasswordSchema, passwordResetEmailSchema } from '../validation/passwordValidation';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse
} = Toolbox;
const {
  validateParameters
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Notification
} = database;

const NotificationMiddleware = {
  /**
   * check if user is verified
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof NotificationMiddleware
   */
  async verifyNotification(req, res, next) {
    try {
      validateParameters(req.body);
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }
};

export default NotificationMiddleware;
