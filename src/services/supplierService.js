/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import { Op, QueryTypes } from 'sequelize';
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
                where: key.categoryId ? { categoryId: key.categoryId } : {},
                include: [
                    {
                        model: Category,
                        as: 'category',
             
                    },
                ]
            },
        ],
        where: key.id ? { id: key.id } : {}
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

   /**
   * search products with keys
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof SupplierService
   */
  async searchCategoryByKey(key) {
    try {
        const entities = await Category.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${key}%` } },
                ]
            }
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

   /**
   * search products with keys
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof SupplierService
   */
  async searchVendorByKey(key) {
    try {
        const entities = await VendorDetail.findAll({
            where: {
                [Op.or]: [
                    { companyName: { [Op.like]: `%${key}%` } },
                ]
            }
      });
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
