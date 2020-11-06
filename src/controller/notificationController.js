/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService, NotificationService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
    successResponse,
    errorResponse
} = Toolbox
const {
  addEntity,
  findByKey,
  updateByKey,
  deleteByKey
} = GeneralService;
const {
  notificationsBykey
} = NotificationService;
const {
  Notification,
  VendorDetail
} = database;

const NotificationController = {

  /**
   * add notifications
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof NotificationController
   */
  async addNotification(req, res) {
    try {
      const { id, vendorId } = req.tokenData;
      const vendor = await findByKey(VendorDetail, { userId: id })
      if(vendor.companyName === null || vendorId === null) return errorResponse(res, { code: 409, message: 'Please update your details before contacting admin' });
      const notification = await addEntity(Notification, {
        to: 'admin',
        from: vendor.companyName || vendorId,
        userId: id,
        subject: req.body.subject,
        message: req.body.message
      });
      return successResponse(res, { notification });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * get notifications
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof NotificationController
   */
  async getNotifications(req, res) {
    try {
      const { id, role } = req.tokenData;
      let notifications;
      if (req.query.id) {
        await updateByKey(Notification, { read: true }, { id: req.query.id });
        notifications = await notificationsBykey({ id: req.query.id });
      } else {
        if (role === "supplier") notifications = await notificationsBykey({ userId: id, from: 'admin' });
        else notifications = await notificationsBykey({ to: 'admin' });
      }
      if (!notifications.length) return errorResponse(res, { code: 404, message: 'No Notifications Yet' });
      return successResponse(res, { notifications });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * delete notification
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof NotificationController
   */
  async deleteNotification(req, res) {
    try {
      if (!req.query.id) {
        return errorResponse(res, { code: 409, message: 'Please select a notification to delete.' });
      }
      const image = await deleteByKey(Notification, { id: req.query.id });
      successResponse(res, { message: 'Notification deleted successfully.', image });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },
};

export default NotificationController;
