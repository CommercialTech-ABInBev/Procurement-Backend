/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  updateByKey,
  addEntity
} = GeneralService;
const {
  User,
  VendorDetail,
  VendorCategory
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
      let body;
      body = subCategories.map((item) => ({
        vendorId: req.vendorDetails.id, categoryId, subCategory: item
      }));
      const vendorcategory = await VendorCategory.bulkCreate(body);
      successResponse(res, { message: 'category added to vendor successfully', vendorcategory });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default SupplierController;
