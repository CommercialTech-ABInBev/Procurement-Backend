import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
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
  Notification,
  Subject
} = database;

const UserMiddleware = {
  /**
   * check if user is verified
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof UserMiddleware
   */
  async verifyVendor(req, res, next) {
    try {
      let notification;
      if (req.body) validateParameters(req.body);
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  }
};

export default UserMiddleware;
