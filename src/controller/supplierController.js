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
} = GeneralService;
const {
  User,
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
        await updateByKey(User, req.body, { id });
        await updateByKey(User, { mediaUrls }, { id });
      } else await updateByKey(User, req.body, { id });
      successResponse(res, { message: 'Profile update was successful' });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default SupplierController;
