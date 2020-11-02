/* eslint-disable no-unused-vars */
import { GeneralService, CategoryService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  updateByKey,
  findMultipleByKey
} = GeneralService;
const {
  vendorsByCategory,
  searchCategoryByKey,
  searchVendorByKey,
  vendorProfile
} = CategoryService;
const {
  User,
  VendorDetail,
  VendorCategory,
  Category
} = database;
// const {
//   ADMIN_KEY,
//   CLIENT_URL
// } = env;

const SupplierController = {
  /**
   * update user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async updateProfile(req, res) {
    try {
      const { id } = req.tokenData;
      if (req.body.mediaPictures) {
        const mediaUrls = JSON.stringify(req.body.mediaPictures);
        await delete req.body.mediaPictures;
        await updateByKey(VendorDetail,{ ...req.body }, { userId: id });
        await updateByKey(VendorDetail, { mediaUrls }, { userId: id });
      } else await updateByKey(VendorDetail, { ...req.body }, { userId: id });
      successResponse(res, { message: 'Profile update was successful' });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * update user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async addVendorCategory(req, res) {
    try {
      const { categoryId, subCategories } = req.body;
      let check = false;
      const venCat = await findMultipleByKey(VendorCategory, { vendorId: req.vendorDetails.id });
      venCat.forEach(element => {
        subCategories.forEach((item) => {
          if (element.subCategory === item) {
            check = true;
          }
        })
      });
      if (check) return errorResponse(res, { code: 404, message: 'subCategory is already added to this vendor' });
      const body = subCategories.map((item) => ({
        vendorId: req.vendorDetails.id, categoryId, subCategory: item
      }));
      const vendorcategory = await VendorCategory.bulkCreate(body);
      successResponse(res, { message: 'category added to vendor successfully', vendorcategory });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * get supplier by category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async getVendor(req, res) {
    try {
      const { categoryId, id } = req.query;
      let categoryVendors 
      if (categoryId) categoryVendors = await vendorsByCategory({ categoryId });
      if (id) categoryVendors = await vendorsByCategory({ id });
      else categoryVendors = await vendorsByCategory({ id });
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors for this category' });
      return successResponse(res, { categoryVendors });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * get supplier by category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async getProfile(req, res) {
    try {
      const { vendorId } = req.tokenData;
      const profile = await vendorProfile({ vendorId });
      return successResponse(res, { profile });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

   /**
   * search vendors and categories with name
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async serachCategories(req, res) {
    try {
      const category = await searchCategoryByKey(req.query.search);
      if (!category.length) return errorResponse(res, { code: 404, message: 'Categories With Search Criteria is not available' });
      return successResponse(res, { category });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },


   /**
   * search vendors and categories with name
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async serachVendors(req, res) {
    try {
      const vendor = await searchVendorByKey(req.query.search);
      if (!vendor.length) return errorResponse(res, { code: 404, message: 'Vendor With Search Criteria is not available' });
      return successResponse(res, { vendor });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

   /**
   * update vendor status
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async updateVendorStatus(req, res) {
    try {
      const { id, approvalStatus } = req.query;
      const vendor = await updateByKey(VendorDetail, { approvalStatus }, { id });
      return successResponse(res, { message: `Vendor is ${approvalStatus}`, vendor });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },
};

export default SupplierController;
