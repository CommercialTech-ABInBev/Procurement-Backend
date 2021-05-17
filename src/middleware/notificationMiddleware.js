import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse
} = Toolbox;
const {
  validateParameters
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Notification,
  Subject
} = database;

const NotificationMiddleware = {
  /**
   * check if user is verified
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof NotificationMiddleware
   */
  async verifyNotification(req, res, next) {
    try {
      let notification;
      if (req.body) validateParameters(req.body);
      if (req.query.subjectId) {
        const subject = await findByKey(Subject, { id: req.query.subjectId });
        if (!subject) return errorResponse(res, { code: 409, message: 'Subject does not exist' });
        req.subject = subject;
      }
      if (req.query.id) {
        const { id } = req.query;
        validateParameters({ id });
        notification = await findByKey(Notification, { id });
        if (!notification) return errorResponse(res, { code: 409, message: 'Notification does not exist' });
        req.notification = notification;
      }
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }
};

export default NotificationMiddleware;
