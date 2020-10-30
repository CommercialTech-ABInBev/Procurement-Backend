import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  findByKey
} = GeneralService;
const {
  validateProfile,
} = GeneralValidation;
const {
  Vendor,
  VendorDetail, 
  Category
} = database;

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
      validateParameters(req.body);
      const { categoryId, vendorId } = req.body;
      const category = await findByKey(Category, { id: categoryId });
      if (!category) return errorResponse(res, { code: 404, message: 'Category does not exist' });
      const vendor = await findByKey(VendorDetail, { vendorId });
      if (!vendor) return errorResponse(res, { code: 404, message: 'Vendor does not exist' });
      req.vendorDetails = vendor;
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * verify profile update
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof SupplierMiddleware
   */
  async verifyCategory(req, res, next) {
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
