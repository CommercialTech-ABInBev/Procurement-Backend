/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService, UserService } from '../services';
import { Toolbox, Mailer } from '../util';
import database from '../models';
import { env } from '../config';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  sendApprovalRequest
} = Mailer;
const {
  addEntity,
  findByKey,
  updateByKey,
  allEntities
} = GeneralService;
const {
  getVendorRegistrationRquest
} = UserService;
const {
  VendorRegistration,
  JobFunction,
  User
} = database;
const {
  FEMI_EMAIL,
  MADAM_FLORENCE_EMAIL
} = env;

const UserController = {
  /**
   * user signup
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async registerVendor(req, res) {
    try {

      const sendEmails = [];
      let adminAccounts = '';
      const { id, email } = req.tokenData;
      const job = await findByKey(JobFunction, { id: req.body.jobId });
      const vendor = await addEntity(VendorRegistration, { ...req.body, userId: id });
      if (vendor.vendorType === 'capex') {
        // adminAccounts = await findByKey(User, { email: FEMI_EMAIL });
        sendEmails.push({ email: FEMI_EMAIL });
        sendEmails.push({ email: MADAM_FLORENCE_EMAIL });
      } if (vendor.vendorType === 'opex') {
        sendEmails.push({ email: MADAM_FLORENCE_EMAIL });
        sendEmails.push({ email: job.dataValues.directorEmail });
      }
      const emailSent = await sendApprovalRequest(vendor, sendEmails, email);
      return successResponse(res, { vendor, emailSent });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
   * add job
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async addJob(req, res) {
    try {
      const job = await addEntity(JobFunction, { ...req.body });
      return successResponse(res, { job });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * get job
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async getJobFunction(req, res) {
    try {
      const jobs = await allEntities(JobFunction);
      return successResponse(res, { jobs });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
 * get vendor request by super admins
 * @param {object} req
 * @param {object} res
 * @returns {JSON } A JSON response with the user's profile details.
 * @memberof UserController
 */
  async getVendorRequest(req, res) {
    try {
      let vendorRequest;
      if (req.query.requestId) vendorRequest = await getVendorRegistrationRquest({ id: req.query.requestId });
      else vendorRequest = await getVendorRegistrationRquest({});
      if (!vendorRequest.length) return errorResponse(res, { code: 404, message: 'No Vendor Registration Request Yet!' });
      return successResponse(res, { message: 'Vendor Registration Request Gotten', vendorRequest });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

  /**
 * get vendor request by super admins
 * @param {object} req
 * @param {object} res
 * @returns {JSON } A JSON response with the user's profile details.
 * @memberof UserController
 */
  async updateVendorRegistrationRequest(req, res) {
    try {
      let subject;
      const { requestId, approvalStatus } = req.query;
      await updateByKey(VendorRegistration, { approvalStatus, approvedBy: req.tokenData.id }, { id: requestId });
      const VendorRegistrationDetails = await findByKey(VendorRegistration, { id: requestId });
      // const vendor = await findByKey(VendorDetail, { id });
      // const user = await findByKey(User, { id: vendor.userId });
      // let notification;
      // if (vendor){
      //   subject = await addEntity(Subject, { 
      //     subject: req.body.subject ?? `${vendor.companyName} details is ${approvalStatus.toUpperCase()}`,
      //     vendor: vendor.companyName || user.vendorId,
      //     vendorRead: false
      //   });
      //   notification = await addEntity(Notification, {
      //     to: vendor.companyName || user.vendorId,
      //     from: 'admin',
      //     userId: user.id,
      //     subjectId: subject.id,
      //     read: true,
      //     message: req.body.message ? req.body.message
      //       : approvalStatus == "approved"
      //         ? 'Thank You for registering with us, your request is hereby approved'
      //         : 'Please kindly review your details and add all neccessary information.\nThank You.'
      //   });
      // }
      return successResponse(res, { message: `Vendor is ${approvalStatus}`, VendorRegistrationDetails });
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },

};

export default UserController;
