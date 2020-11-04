/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import { Op, QueryTypes } from 'sequelize';
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
        order: [
          ['id', 'DESC'],
      ],
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default NotificationService;
