/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox, Mailer } from '../util';
import database from '../models';
import { env } from '../config';

const {
  successResponse,
  errorResponse,
  createToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = Toolbox;
const {
  sendApprovalRequest,
  sendVerificationEmail
} = Mailer;
const {
  addEntity,
  updateByKey,
  findByKey,
  deleteByKey
} = GeneralService;
const {
  VendorRegistration
} = database;
const {
  CLIENT_URL
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
      const { id, email } = req.tokenData;
      const vendor = await addEntity(VendorRegistration, { ...req.body, userId: id });
      if (vendor.vendorType === 'capex') {
        await sendApprovalRequest(vendor, 'femi@ng.ab-inbev.com', email);
        await sendApprovalRequest(vendor, 'florence@ng.ab-inbev.com', email);
      } if (vendor.vendorType === 'opex') {
        await sendApprovalRequest(vendor, 'florence@ng.ab-inbev.com', email);
        await sendApprovalRequest(vendor, 'respectivemanager@ng.ab-inbev.com', email);
      }
      return successResponse(res, { user, vendorDetails, emailSent }, 201);
    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  }
};

export default UserController;
