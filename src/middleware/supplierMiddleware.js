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
  validateParameters
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
      validateProfile(req.body);
      next();
    } catch (error) {
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
   * verify supplier category
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof SupplierMiddleware
   */
  async verifySupplierCategory(req, res, next) {
    try {
      validateParameters(req.query);
      const { categoryId, id } = req.query;
      if (categoryId) {
        const category = await findByKey(Category, { id: categoryId });
        if (!category) return errorResponse(res, { code: 404, message: 'Category does not exist' });
      }
      if (id) {
        const vendor = await findByKey(VendorDetail, { id });
        if (!vendor) return errorResponse(res, { code: 404, message: 'Vendor does not exist' });
      }
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * verify supplier category
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof SupplierMiddleware
   */
  async verifyApproval(req, res, next) {
    try {
      validateParameters(req.query);
      const { id } = req.query;
      if (id) {
        const vendor = await findByKey(VendorDetail, { id });
        if (!vendor) return errorResponse(res, { code: 404, message: 'Vendor does not exist' });
      }
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default SupplierMiddleware;
