import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  findByKey,
  findMultipleByKey
} = GeneralService;
const {
  validateProfile,
  validateParameters,
  validateImages
} = GeneralValidation;
const {
  Vendor,
  VendorDetail, 
  Category,
  Location
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
      const { id } = req.tokenData;
      const vendor = await findByKey(VendorDetail, { userId: id });
      validateProfile(req.body);
      if (req.files) validateImages(req.file);
      if (req.body.companyLocation) {
        const locations = await findMultipleByKey(Location, { vendorDetailsId: vendor.id });
        req.body.companyLocation.forEach((item, index) => {
          locations.forEach((loc) => {
            if (item === loc.label) {
              req.body.companyLocation.splice(index, 1);
            }
          })
        });

        if (!req.body.companyLocation.length) return errorResponse(res, { code: 409, message: 'States already added' });
      }
      req.vendor = vendor;
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
      // validateParameters(req.body);
      // const { categoryId, vendorId } = req.body;
      // const category = await findByKey(Category, { id: categoryId });
      // if (!category) return errorResponse(res, { code: 404, message: 'Category does not exist' });
      const body = req.body;
      const vendor = await findByKey(VendorDetail, { vendorId: body[0].vendorId });
      // if (!vendor) return errorResponse(res, { code: 404, message: 'Vendor does not exist' });
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
