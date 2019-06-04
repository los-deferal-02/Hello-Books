import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import Debug from 'debug';

dotenv.config();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const debug = Debug('dev');
/**
 * Contains methods for handling user email services
 *
 * @exports
 * @class EmailModule
 */
class EmailModule {
  /**
   * Send email message to a single user
   *
   * @static
   * @async
   * @name sendEmailToUser
   * @param {object} receiver - Object contains "name" and "email" of receiver
   * @param {string} subject - Subject of the email
   * @param {string} content - Content of the email
   * @returns {string} Information about whether or not the operation succeeds
   * @memberof EmailModule
   */
  static async sendEmailToUser(receiver, subject, content) {
    const emailData = {
      to: receiver,
      from: 'Hello Books <hellobooks-care@hellobooks.com>',
      subject,
      html: content
    };

    try {
      await sendGridMail.send(emailData);
      debug('Email sent successfully');
      return 'Email sent successfully';
    } catch (error) {
      debug(error.response.body);
      throw new Error(error.response.body);
    }
  }
}

export default EmailModule;
