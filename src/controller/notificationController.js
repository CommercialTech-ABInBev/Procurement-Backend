/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
    successResponse,
    errorResponse
} = Toolbox
const {
  addEntity,
  findByKey
} = GeneralService;
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
};

export default NotificationController;
