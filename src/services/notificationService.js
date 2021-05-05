/* eslint-disable valid-jsdoc */
import database from '../models';

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
   * @returns {promise-Object} - A promise object with entity details
   * @memberof NotificationService
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
   * get notifications
   * @async
   * @param {object} key - object containing category key and value
   * @returns {promise-Object} - A promise object with entity details
   * @memberof NotificationService
   */
  async singlenotificationsBykey(key) {
    try {
      const entities = await Subject.findAll({
        include: [
          {
            model: Notification,
            as: 'message',
            include: [
              {
                model: User,
                as: 'users',
                attributes: ['vendorId'],
              }
            ],
          }
        ],
        where: { id: key.id },
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

export default NotificationService;
