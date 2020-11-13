import sendgrid from '@sendgrid/mail';
import { env } from '../config';
import Toolbox from './toolbox';

const {
  ADMIN_EMAIL, SENDGRID_KEY
} = env;
const {
  createPasswordResetLink
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
      subject: 'RESET PASSWORD',
      html: `<h4>You've requested for a password reset. Click the link below to reset your password successfully!</h4><br><br>
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

};

export default Mailer;
