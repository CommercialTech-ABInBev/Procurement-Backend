/* eslint-disable valid-jsdoc */
// import { ApiError } from '../utils';
import Sequelize from 'sequelize';
import database from '../models';
import GeneralService from './generalService';

const {
  User,
  Notification,
  Subject
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
      const entities = await Subject.findAll({
        include: [
          {
            model: Notification,
            as: 'message',
            where: key
          }
        ],
        attributes: ['id', 'subject']
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  /**
   * get notifications
   * @async
   * @param {object} key - object containing category key and value
   * @param {object} user - is User
   * @returns {promise-Object} - A promise object with entity details
   * @memberof NotificationService
   */
  async singlenotificationsBykey(key, user) {
    try {
      const entities = await Subject.findAll({
        include: [
          {
            model: Notification,
            as: 'message',
            where: key.userId ? { userId: key.userId } : {},
          }
        ],
        attributes: ['id', 'subject'],
        where: { id: key.id }
      }).map((values) => values.get({ plain: true }));
      return entities;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};

export default NotificationService;
