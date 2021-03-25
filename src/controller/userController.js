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
  allEntities
} = GeneralService;
const {
  getVendorRegistrationRquest
} = UserService;
const {
  VendorRegistration,
  JobFunction
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
      const { id, email } = req.tokenData;
      const job = await findByKey(JobFunction, { id: req.body.jobId });
      const vendor = await addEntity(VendorRegistration, { ...req.body, userId: id });
      if (vendor.vendorType === 'capex') {
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

};

export default UserController;
