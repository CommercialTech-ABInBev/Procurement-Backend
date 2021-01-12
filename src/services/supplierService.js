/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import { Op, QueryTypes } from 'sequelize';
import database from '../models';
import GeneralService from './generalService';

const {
  VendorDetail,
  VendorCategory,
  Category,
  Media,
  Location
} = database;

const CategoryService = {
  /**
   * user get product entities by category
   * @async
   * @param {object} key - object containing category key and value
   * e.g { id: 5 }
   * @param {object} ke2 - object containing category key and value
   * e.g { id: 5 }
   * @param {object} role - object containing approval status of product
   * @returns {promise-Object} - A promise object with entity details
   * @memberof CategoryService
   */
  async vendorsByCategory(key, key2) {
    try {
      const entities = await VendorDetail.findAll({
        include: [
          (key.categoryId || key.subCategory) ?
            {
              model: VendorCategory,
              as: 'vendorCategories',
              where: key,
              include: [
                  {
                      model: Category,
                      as: 'category',
                  },
              ]
            } :  {
              model: VendorCategory,
              as: 'vendorCategories',
              include: [
                {
                    model: Category,
                    as: 'category',
                },
              ]
          },
          {
            model: Media,
            as: 'vendorDetailImage',
            attributes: ['id', 'imageUrl'],
          },
          key2.label ?
          {
            model: Location,
            as: 'locations',
            attributes: ['label', 'value'],
            where: key2
          } :  {
            model: Location,
            as: 'locations',
            attributes: ['label', 'value']
          },
        ],
        where: { approvalStatus: 'approved' }
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * user get product entities by category
   * @async
   * @param {object} key - object containing category key and value
   * e.g { id: 5 }
   * @param {object} role - object containing approval status of product
   * @returns {promise-Object} - A promise object with entity details
   * @memberof CategoryService
   */
  async vendorsById(key, role) {
    try {
      const entities = await VendorDetail.findAll({
        include: [
            {
                model: VendorCategory,
                as: 'vendorCategories',
                required: true,
                include: [
                    {
                        model: Category,
                        as: 'category',
                    },
                ]
            },
            {
              model: Media,
              as: 'vendorDetailImage',
              attributes: ['id', 'imageUrl'],
          },
          {
            model: Location,
            as: 'locations',
            attributes: ['label', 'value']
          }
        ],
        where: key
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * user get product entities by category
   * @async
   * @param {object} key - object containing category key and value
   * @returns {promise-Object} - A promise object with entity details
   * @memberof CategoryService
   */
  async vendorProfile(key) {
    try {
      const entities = await VendorDetail.findOne({
        include: [
          {
              model: Media,
              as: 'vendorDetailImage',
              attributes: ['id', 'imageUrl'],
          },
          {
            model: Location,
            as: 'locations',
            attributes: ['label', 'value']
          },
          {
            model: VendorCategory,
            as: 'vendorCategories',
            include: [
                {
                    model: Category,
                    as: 'category',
                },
            ]
        },
        ],
        where: key
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
  async searchVendorBySubCategory(key) {
    try {
      const entities = await VendorDetail.findAll({
        include: [
          {
            model: VendorCategory,
            as: 'vendorCategories',
            required: true,
            where: { 
              [Op.or]: [
                { subCategory: { [Op.like]: `%${key}%` } },
              ],
            },
          }
        ],
        where: {
          approvalStatus: 'approved'
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
  async searchVendorByCategory(key) {
    try {
      const entities = await VendorDetail.findAll({
        include: [
          {
            model: VendorCategory,
            as: 'vendorCategories',
            required: true,
            include: [
                {
                    model: Category,
                    as: 'category',
                    where: { 
                      [Op.or]: [
                        { name: { [Op.like]: `%${key}%` } },
                      ],
                    },
                },
            ]
          }
        ],
        where: {
          approvalStatus: 'approved'
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
          approvalStatus: 'approved',
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
