import sendgrid from '@sendgrid/mail';
import { env } from '../config';
import Toolbox from './toolbox';

const {
  ADMIN_EMAIL, SENDGRID_KEY
} = env;
const {
  createPasswordResetLink,
  createVerificationLink
} = Toolbox;

sendgrid.setApiKey(SENDGRID_KEY);


const Mailer = {
  /**
   * send email for password reset
   * @param {object} req
   * @param {object} user
   * @param {object} vendor
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendPasswordResetEmail(req, user, vendor) {
    const {
      id, email, vendorId, role
    } = user;
    const passwordResetLink = createPasswordResetLink(req, {
      id, email: vendor ? vendor.companyEmail : email, vendorId, role
    });
    const mail = {
      to: vendor ? vendor.companyEmail : email,
      from: ADMIN_EMAIL,
      subject: 'IB VENDOR CENTRAL RESET PASSWORD',
      html: `<p>You've requested for a password reset. Click the button below to reset your password!</p><br><br>
      <a href="${passwordResetLink}" target="_blank" style="background-color: #B11F24;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;">Reset Password</a>
      `
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  },

   /**
   * send email verification to user after signup
   * @param {object} req
   * @param {object} user - { id, email, firstName ...etc}
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendVerificationEmail(req, user) {
    const { id, email } = user;
    const verificationLink = createVerificationLink(req, { id, email });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      subject: 'IB VENDOR CENTRAL EMAIL VERIFICATION',
      html: `<p>A big welcome to you for registering to our platform. The button below will redirect to verify your email and complete your registration.\n
        I hope you have a great time with using this appliation.</p><br><br>
        <a href="${verificationLink}" target="_blank" style="background-color: #B11F24;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;">Verify Email</a>
      `
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  },

};

export default Mailer;
