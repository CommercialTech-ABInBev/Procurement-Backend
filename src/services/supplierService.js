/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
// import { Op } from 'sequelize';
import database from '../models';
import GeneralService from './generalService';

const {
  VendorDetail,
  VendorCategory,
  Category
} = database;

const { findMultipleByKey, findByKey, decremnentByKeys } = GeneralService;

const CategoryService = {
  /**
   * user get product entities by category
   * @async
   * @param {object} key - object containing category key and value
   * e.g { id: 5 }
   * @param {object} status - object containing approval status of product
   * @returns {promise-Object} - A promise object with entity details
   * @memberof CategoryService
   */
  async vendorsByCategory(key) {
    try {
      const entities = await VendorDetail.findAll({
        include: [
            {
                model: VendorCategory,
                as: 'vendorCategories',
                where: key,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        // where: { id: key.categoryId },
             
                    },
                ]
            },
        ],
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * user gets how many categories a product has
   * @async
   * @param {object} key - object containing category key and value
   * e.g { id: 5 }
   * @param {object} status - object containing approval status of product
   * @returns {promise-Object} - A promise object with entity details
   * @memberof CategoryService
   */
  async getProductCategory(key) {
    try {
      const entities = await ProductCategory.findAll({
        where: key,
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default CategoryService;
