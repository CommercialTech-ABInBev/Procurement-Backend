import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
// import { GeneralService } from '../services';
// import database from '../models';

const {
  errorResponse,
} = Toolbox;
// const {
//   findByKey
// } = GeneralService;
const {
  validateProfile,
} = GeneralValidation;
// const {
//   User,
//   RoleUser,
// } = database;

const SupplierMiddleware = {
  /**
   * verify profile update
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof SupplierMiddleware
   */
  async verifySupplierProfileUpdate(req, res, next) {
    try {
      validateProfile(req.body);
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default SupplierMiddleware;
