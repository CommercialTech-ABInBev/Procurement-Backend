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
  notificationsBykey,
  singlenotificationsBykey
} = NotificationService;
const {
  Notification,
  VendorDetail,
  User,
  Message,
  Subject
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
      // let subject;
      const { id, vendorId } = req.tokenData;
      const vendor = await findByKey(VendorDetail, { userId: id })
      if(vendor.companyName === null || vendorId === null) return errorResponse(res, { code: 409, message: 'Please update your details before contacting admin' });
      const subject = await addEntity(Subject, { ...req.body.subject });
      const notification = await addEntity(Notification, {
        to: 'admin',
        from: vendor.companyName || vendorId,
        userId: id,
        subjectId: subject.id,
        message: req.body.message
      });
      return successResponse(res, { notification });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * admin add notifications
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof NotificationController
   */
  async adminReplySubject(req, res) {
    try {
      const { subjectId, vendorId } = req.query;
      const vendor = await findByKey(VendorDetail, { vendorId });
      const user = await findByKey(User, { vendorId });
      // const subject = await addEntity(Subject, { ...req.body.subject });
      const notification = await addEntity(Notification, {
        from: 'admin',
        to: vendor.companyName || vendorId,
        message: req.body.message,
        subjectId: subjectId,
        userId: user.id
      });
      return successResponse(res, { notification });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * admin add notifications
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof NotificationController
   */
  async vendorReplySubject(req, res) {
    try {
      const { subjectId } = req.query;
      const { id } = req.tokenData;
      const { vendorId, companyName } = await findByKey(VendorDetail, { userId: id })
      const notification = await addEntity(Notification, {
        to: 'admin',
        from: companyName || vendorId,
        message: req.body.message,
        subjectId: subjectId,
        userId: id
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
      if (req.query.subjectId) {
        notifications = await singlenotificationsBykey({ id: req.query.subjectId, userId: id });
        const ids = notifications[0].message.map(item => item.id );
        notifications = await updateByKey(Notification, { read: true }, { id: ids });
        notifications = await singlenotificationsBykey({ id: req.query.subjectId, userId: id });
      } else {
        if (role === "supplier") {
          notifications = await notificationsBykey({ userId: id }, true);
          // const Messages = notifications.map((item) => item.messages);
          // notifications = { subject: notifications[0].subject, Messages }
        } else notifications = await notificationsBykey({ to: 'admin' }, false);
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
      errorResponse(res, {});
    }
  },
};

export default NotificationController;
