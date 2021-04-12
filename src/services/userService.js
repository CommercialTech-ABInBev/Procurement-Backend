/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import database from '../models';

const {
  User,
  VendorRegistration,
  JobFunction
} = database;

const UserService = {
  /**
   * get notifications
   * @async
   * @param {object} key - object containing category key and value
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async notificationsBykey(key) {
    try {
      const entities = await Subject.findAll({
        include: [
          {
            model: Notification,
            as: 'message',
            where: key,
            attributes: [],
            // include: [
            //   {
            //     model: User,
            //     as: 'users',
            //     attributes: ['vendorId'],
            //   }
            // ],
          }
        ],
        order: [
          ['updatedAt', 'Desc']
        ]
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * get requests
   * @async
   * @param {object} key - object containing category key and value
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getVendorRegistrationRquest(key) {
    try {
      const entities = await VendorRegistration.findAll({
        include: [
          {
            model: JobFunction,
            as: 'units',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'role'],
          }
        ],
        where: key,
        order: [
          ['updatedAt', 'Desc']
        ]
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default UserService;
