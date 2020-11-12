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
      html: `<p>Please click on this link to reset your password, ${passwordResetLink}</p>`
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
