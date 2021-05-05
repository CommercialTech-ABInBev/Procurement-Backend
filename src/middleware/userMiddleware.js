import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';

const {
  errorResponse
} = Toolbox;
const {
  validateVendor
} = GeneralValidation;

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
      validateVendor(req.body);
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }
};

export default UserMiddleware;
