import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const { log } = console;

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
      log('Email sent successfully');
      return 'Email sent successfully';
    } catch (error) {
      log(error.response.body);
      return 'Email could not be sent';
    }
  }
}

export default EmailModule;
