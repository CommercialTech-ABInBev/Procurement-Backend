/* eslint-disable no-unused-vars */
import { GeneralService, CategoryService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
import { AzureUpload } from './../util';
// import upload from '../middleware/uploadMiddleware';
// import { env } from '../config';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  uploadImage
} = AzureUpload;
const {
  updateByKey,
  findMultipleByKey,
  findByKey,
  addEntity
} = GeneralService;
const {
  vendorsByCategory,
  searchCategoryByKey,
  searchVendorByKey,
  vendorProfile,
  vendorsById
} = CategoryService;
const {
  User,
  VendorDetail,
  VendorCategory,
  Category,
  Notification,
  Media
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
      let images;
      if (req.files) {
        let mediaUrls = [...req.files];
        mediaUrls = await uploadImage(mediaUrls);
        const vendor = await findByKey(VendorDetail, { userId: id });
        mediaUrls = mediaUrls.map((item) => ({ imageUrl: item, vendorDetailsId: vendor.id }));
        images = await Media.bulkCreate(mediaUrls);
        await delete req.body.file;
        await updateByKey(VendorDetail,{ ...req.body }, { userId: id });
      } else await updateByKey(VendorDetail, { ...req.body }, { userId: id });
      successResponse(res, { message: 'Profile update was successful', images });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * update user logo
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async updateLogo(req, res) {
    try {
      const { id } = req.tokenData;
      if (!req.files) {
        return errorResponse(res, { code: 409, message: 'Please add a logo' });
      }
      let logo = [...req.files];
      logo = await uploadImage(logo);
      await updateByKey(VendorDetail,{ companyLogo: logo[0] }, { userId: id });
      successResponse(res, { message: 'Profile update was successful' });
    } catch (error) {
      console.error(error);
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
      const { categoryId, id, approvalStatus } = req.query;
      const { role } = req.tokenData;
      let categoryVendors;
      if (role !== "admin") {
        if (categoryId) categoryVendors = await vendorsByCategory({ categoryId });
        else if (id) categoryVendors = await vendorsById({ id, approvalStatus: 'approved' });
        else categoryVendors = await vendorsById({ approvalStatus: 'approved' }, role);
      } else {
        if (categoryId) categoryVendors = await vendorsByCategory({ categoryId });
        else if (id) categoryVendors = await vendorsById({ id });
        else if (approvalStatus) categoryVendors = await vendorsById({ approvalStatus });
        else categoryVendors = await vendorsById({});
      };
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors yet' });
      return successResponse(res, { categoryVendors });
    } catch (error) {
      console.error(error);
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
      const { id } = req.tokenData;
      const profile = await vendorProfile({ userId: id });
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
      await updateByKey(VendorDetail, { approvalStatus }, { id });
      const vendor = await findByKey(VendorDetail, { id });
      const user = await findByKey(User, { id: vendor.userId });
      let notification;
      if (vendor){
        notification = await addEntity(Notification, {
          to: vendor.companyName || user.vendorId,
          from: 'admin',
          userId: user.id,
          subject: `Your details is ${approvalStatus.toUpperCase()}`,
          message: req.body.message ? req.body.message 
            : approvalStatus == "approved" 
              ? 'Thank You for registering with us, your request is hereby approved' 
              : 'Please kindly review your details and add all neccessary information.\nThank You.'
        });
      }
      return successResponse(res, { message: `Vendor is ${approvalStatus}`, vendor, notification });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },
};

export default SupplierController;
