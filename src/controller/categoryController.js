/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
    successResponse,
    errorResponse
} = Toolbox
const {
  allEntities
} = GeneralService;
const {
  Category
} = database;

const CategoryController = {

  /**
   * get categories
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof CategoryController
   */
  async getCategories(req, res) {
    try {
      const categories = await allEntities(Category);
      if (!categories.length) return errorResponse(res, { code: 404, message: 'There are no categories here' });
      return successResponse(res, { categories });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default CategoryController;
