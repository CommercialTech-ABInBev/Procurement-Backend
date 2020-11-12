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
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendPasswordResetEmail(req, user) {
    const {
      id, email, vendorId, role
    } = user;
    const passwordResetLink = createPasswordResetLink(req, {
      id, email, vendorId, role
    });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: 'd-4d40ffcdc0dc44c0a7980d6d0609e1e3',
      dynamic_template_data: {
        name: firstName,
        reset_link: passwordResetLink
      }
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
