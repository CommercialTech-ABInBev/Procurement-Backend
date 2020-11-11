/* eslint-disable no-unused-vars */
import { GeneralService, CategoryService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
import { AzureUpload } from './../util';
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
  addEntity,
  deleteByKey
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
  Media,
  Location
} = database;


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
      let states;
      const vendor = req.vendor;
      if (req.body.companyLocation) {
        const stateDetails = req.body.companyLocation.map((item) => ({
          label: item, value: item, vendorDetailsId: vendor.id,
        }));
        states = await Location.bulkCreate(stateDetails);
        await delete req.body.companyLocation;
      }
      if (req.files) {
        let mediaUrls = [...req.files];
        mediaUrls = await uploadImage(mediaUrls);
        mediaUrls = mediaUrls.map((item) => ({ imageUrl: item, vendorDetailsId: vendor.id }));
        images = await Media.bulkCreate(mediaUrls);
        await delete req.body.file;
        await updateByKey(VendorDetail,{ ...req.body }, { userId: id });
      } else await updateByKey(VendorDetail, { ...req.body }, { userId: id });
      successResponse(res, { message: 'Profile update was successful', images, states });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * update vendor logo
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
      successResponse(res, { message: 'Profile update was successful', logo });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * delete vendor image
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async deleteImage(req, res) {
    try {
      
      if (!req.query.id) {
        return errorResponse(res, { code: 409, message: 'Please select an image to delete.' });
      }
      const image = await deleteByKey(Media, { id: req.query.id });
      successResponse(res, { message: 'Image deleted successfully.', image });
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
      const { categoryId, id, approvalStatus, label } = req.query;
      const { role } = req.tokenData;
      let categoryVendors;
      if (role !== "admin") {
        if (categoryId && label) categoryVendors = await vendorsByCategory({ categoryId }, { label });
        else if (categoryId && !label) categoryVendors = await vendorsByCategory({ categoryId }, {});
        else if (!categoryId && label) categoryVendors = await vendorsByCategory({}, { label });
        else if (id) categoryVendors = await vendorsById({ id, approvalStatus: 'approved' });
        else categoryVendors = await vendorsById({ approvalStatus: 'approved' }, role);
      } else {
        if (categoryId && label) categoryVendors = await vendorsByCategory({ categoryId }, { label });
        else if (categoryId && !label) categoryVendors = await vendorsByCategory({ categoryId }, {});
        else if (!categoryId && label) categoryVendors = await vendorsByCategory({}, { label });
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
   * get supplier by subcategory
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async getVendorBySubcategory(req, res) {
    try {
      const { subCategory, label } = req.body;
      let categoryVendors 
      if (subCategory && !label) categoryVendors = await vendorsByCategory({ subCategory }, {});
      if (!subCategory && label) categoryVendors = await vendorsByCategory({}, { label });
      if (subCategory && label) categoryVendors = await vendorsByCategory({ subCategory }, { label });
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors yet' });
      return successResponse(res, { categoryVendors });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * get supplier by location
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof SupplierController
   */
  async getVendorByLocation(req, res) {
    try {
      const { location } = req.body;
      const categoryVendors = await vendorsByCategory({ subCategory });
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
