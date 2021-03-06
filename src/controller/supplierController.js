/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { GeneralService, CategoryService } from '../services';
import { Toolbox, AzureUpload } from '../util';
import database from '../models';

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
  vendorsById,
  searchVendorByCategory,
  searchVendorBySubCategory
} = CategoryService;
const {
  User,
  VendorDetail,
  VendorCategory,
  Category,
  Notification,
  Media,
  Location,
  Vendor,
  Subject
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
      let images = [];
      const resee = new RegExp('^(http|https)://', 'i');
      let states;
      const { vendor } = req;
      if (req.body.website) {
        const test = resee.test(req.body.website);
        if (!test) req.body.website = `https://${req.body.website}`;
      }
      if (req.body.portfolioUrl) {
        const test = resee.test(req.body.portfolioUrl);
        if (!test) req.body.portfolioUrl = `https://${req.body.portfolioUrl}`;
      }
      // return console.log(req.body.website, req.body.portfolioUrl);
      if (req.body.locations) {
        const stateDetails = req.body.locations.map((item) => ({
          label: item, value: item, vendorDetailsId: vendor.id,
        }));
        states = await Location.bulkCreate(stateDetails);
        delete req.body.locations;
      }
      if (req.files) {
        let mediaUrls = [...req.files];
        mediaUrls = await uploadImage(mediaUrls);
        mediaUrls = mediaUrls.map((item) => ({ imageUrl: item, vendorDetailsId: vendor.id }));
        images = await Media.bulkCreate(mediaUrls);
        delete req.body.file;
        await updateByKey(VendorDetail, { ...req.body }, { userId: id });
        if (images.length > 0 && vendor.approvalStatus !== 'pending') await updateByKey(VendorDetail, { approvalStatus: 'pending' }, { userId: id });
      } else await updateByKey(VendorDetail, { ...req.body }, { userId: id });
      successResponse(res, { message: 'Profile update was successful', images, states });
    } catch (error) {
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
      await updateByKey(VendorDetail, { companyLogo: logo[0] }, { userId: id });
      successResponse(res, { message: 'Profile update was successful', logo });
    } catch (error) {
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
      const { id, approvalStatus } = req.vendorDetails;
      const bodyData = req.body;
      const subCategoryArray = [];
      let check = false;
      const venCat = await findMultipleByKey(VendorCategory, { vendorId: id });
      venCat.forEach((element) => {
        bodyData.forEach((x) => {
          x.subCategories.forEach((item) => {
            if (element.subCategory === item) {
              subCategoryArray.push(item);
              check = true;
            }
          });
        });
      });

      if (check) return errorResponse(res, { code: 404, message: `The following Sub Categories are already added ${subCategoryArray.join(', ')}. Please remove them and try again.` });
      const body = [];
      bodyData.forEach((item) => {
        item.subCategories.forEach((x) => {
          body.push({
            vendorId: id, categoryId: item.categoryId, subCategory: x
          });
        });
      });

      const vendorcategory = await VendorCategory.bulkCreate(body);
      if (approvalStatus !== 'pending') await updateByKey(VendorDetail, { approvalStatus: 'pending' }, { id });
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
      const {
        categoryId, id, approvalStatus, label
      } = req.query;
      const { role } = req.tokenData;
      let categoryVendors, similarVendors, similarCategoryVendors;
      if (role !== 'admin') {
        if (categoryId && label) categoryVendors = await vendorsByCategory({ categoryId }, { label });
        else if (categoryId && !label) categoryVendors = await vendorsByCategory({ categoryId }, {});
        else if (!categoryId && label) categoryVendors = await vendorsByCategory({}, { label });
        else if (id) {
          categoryVendors = await vendorsById({ id, approvalStatus: 'approved' });
          const catId = categoryVendors[0].vendorCategories.map((x) => x.categoryId);
          if (catId === []) similarCategoryVendors = [];
          else {
            similarCategoryVendors = await vendorsByCategory({ categoryId: catId }, {});
            similarCategoryVendors = similarCategoryVendors.filter((x) => x.id !== categoryVendors[0].id);
          }
        } else categoryVendors = await vendorsById({ approvalStatus: 'approved' }, role);
      } else if (categoryId && label) categoryVendors = await vendorsByCategory({ categoryId }, { label });
      else if (categoryId && !label) categoryVendors = await vendorsByCategory({ categoryId }, {});
      else if (!categoryId && label) categoryVendors = await vendorsByCategory({}, { label });
      else if (id) {
        categoryVendors = await vendorsById({ id });
        const catId = categoryVendors[0].vendorCategories.map((x) => x.categoryId);
        if (catId === []) similarCategoryVendors = [];
        else {
          similarCategoryVendors = await vendorsByCategory({ categoryId: catId }, {});
          similarCategoryVendors = similarCategoryVendors.filter((x) => x.id !== categoryVendors[0].id);
        }
      } else categoryVendors = await vendorsById({});
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors yet' });
      return successResponse(res, { categoryVendors, similarCategoryVendors });
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
  async getSimilarVendors(req, res) {
    try {
      const { similarVendors } = req.query;
      if (similarVendors === null || !similarVendors) return errorResponse(res, { code: 404, message: 'No Similar Vendors Yet!' });
      const categoryVendors = await vendorsByCategory({ categoryId: similarVendors }, {});
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'No Similar Vendors Yet!' });
      return successResponse(res, { categoryVendors });
    } catch (error) {
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
      let categoryVendors;
      if (subCategory && (!label || label === null)) categoryVendors = await vendorsByCategory({ subCategory }, {});
      if ((!subCategory || subCategory === null) && label) categoryVendors = await vendorsByCategory({}, { label });
      if (subCategory && label) categoryVendors = await vendorsByCategory({ subCategory }, { label });
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors yet' });
      return successResponse(res, { categoryVendors });
    } catch (error) {
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
      const categoryVendors = await vendorsByCategory({ location });
      if (!categoryVendors.length) return errorResponse(res, { code: 404, message: 'There are no vendors yet' });
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
      const { id } = req.tokenData;
      const profile = await vendorProfile({ userId: id });
      return successResponse(res, { profile });
    } catch (error) {
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
      const vendor = await searchVendorByCategory(req.query.search);
      return successResponse(res, {
        vendor,
        message: vendor === [] ? 'Categories With Search Criteria is not available' : 'Successfully'
      });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * search vendors by subcategory
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async serachSubCategories(req, res) {
    try {
      const vendor = await searchVendorBySubCategory(req.query.search);
      return successResponse(res, {
        vendor,
        message: vendor === [] ? 'No Vendor with subcategory name found' : 'Successfully'
      });
    } catch (error) {
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
      const { search } = req.query;
      const vendor = await searchVendorByKey(search);
      return successResponse(res, {
        vendor,
        message: vendor === [] ? 'No Vendor with subcategory name found' : 'Successfully'
      });
    } catch (error) {
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
  async search(req, res) {
    try {
      const { search } = req.query;
      const vendorByName = await searchVendorByKey(search);
      const vendorByCategory = await searchVendorByCategory(search);
      const vendorBySubcategory = await searchVendorBySubCategory(search);
      return successResponse(res, {
        vendorByName, vendorByCategory, vendorBySubcategory
      });
    } catch (error) {
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
      let subject;
      const { id, approvalStatus } = req.query;
      await updateByKey(VendorDetail, { approvalStatus }, { id });
      const vendor = await findByKey(VendorDetail, { id });
      const user = await findByKey(User, { id: vendor.userId });
      let notification;
      if (vendor) {
        subject = await addEntity(Subject, {
          subject: req.body.subject ? req.body.subject : `${vendor.companyName} details is ${approvalStatus.toUpperCase()}`,
          vendor: vendor.companyName || user.vendorId,
          vendorRead: false
        });

        notification = await addEntity(Notification, {
          to: vendor.companyName || user.vendorId,
          from: 'admin',
          userId: user.id,
          subjectId: subject.id,
          read: true,
          // eslint-disable-next-line no-nested-ternary
          message: req.body.message ? req.body.message
            : approvalStatus === 'approved'
              ? 'Thank You for registering with us, your request is hereby approved'
              : 'Please kindly review your details and add all neccessary information.\nThank You.'
        });
      }
      return successResponse(res, { message: `Vendor is ${approvalStatus}`, vendor, notification });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * submit for approval request
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async submitForApproval(req, res) {
    try {
      let subject;
      const { id, vendorId } = req.tokenData;
      const vendor = await findByKey(VendorDetail, { userId: id });
      let notification;
      if (vendor) {
        subject = await addEntity(Subject, {
          subject: `Vendor Approval Request (${vendorId})`,
          vendor: vendor.companyName || vendorId,
          adminRead: false
        });
        notification = await addEntity(Notification, {
          to: 'admin',
          from: vendor.companyName || vendorId,
          userId: id,
          subjectId: subject.id,
          message: 'I can attest that the information provided are valid and accurate. Kindly Approve my request.\nThank You.'
        });
      }
      return successResponse(res, { notification });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * add vendor Ids
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the product review details
   * @memberof SupplierController
   */
  async addVendorIds(req, res) {
    try {
      const vendor = req.body.vendorId.map((c) => ({ vendorId: c }));
      const vendors = await Vendor.bulkCreate(vendor);
      return successResponse(res, { vendors });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default SupplierController;
