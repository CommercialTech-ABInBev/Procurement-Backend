/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import Sequelize from 'sequelize';
import database from '../models';
import GeneralService from './generalService';

const {
  Notification
} = database;

const NotificationService = {
  /**
   * get notifications
   * @async
   * @param {object} key - object containing category key and value
   * @returns {promise-Object} - A promise object with entity details
   * @memberof NotificationService
   */
  async notificationsBykey(key) {
    try {
      const entities = await Notification.findAll({
        where: key,
        group: ['subject'],
        attributes: ['subject', 'message', [Sequelize.fn('COUNT', 'subject'), 'count']],
        order: [
          ['id', 'DESC'],
        ],
        // logging: true,
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
