/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import Sequelize from 'sequelize';
import database from '../models';
import GeneralService from './generalService';

const {
  Notification,
  Message
} = database;

const NotificationService = {
  /**
   * get notifications
   * @async
   * @param {object} key - object containing category key and value
   * @param {object} user - is User
   * @returns {promise-Object} - A promise object with entity details
   * @memberof NotificationService
   */
  async notificationsBykey(key, user) {
    try {
      const entities = await Notification.findAll({
        include: [
          {
            model: Message,
            as: 'messages',
            required: user
          },
          // {
          //   model: Product,
          //   as: 'product',
          //   attributes: ['id', 'name', 'imageUrl', 'unit']
          // }
        ],
        where: key,
        order: [
          ['id', 'DESC'],
        ],
        distinct: true,
        nest: true,
        raw: true
      })
      return entities;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};

export default NotificationService;
