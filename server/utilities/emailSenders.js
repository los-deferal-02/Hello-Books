import dotenv from 'dotenv';
import EmailModule from './emailModule';

dotenv.config();

/**
 * Class contaning methods for all emails to be sent
 * @exports
 * @class EmailSender
 */
export default class EmailSender {
  /**
   * Method for sending email for verifying new users
   * @name sendVerifyEmail
   * @static
   * @memberof EmailSender
   * @param {Object} data
   * @returns {Boolean} true
   */
  static sendVerifyEmail(data) {
    const { SERVER_URL, PRODUCTION_URL } = process.env;
    const { email, emailConfirmCode } = data;
    const content = `
    <div style="text-align:center">
    <p style="font-size:16px">
    Dear valued subscriber, our amazing journey has started!
    <br>
    Let's confirm your email.</p>
    <p>By clicking on the following link, 
    you're confirming your email address</p>
    <p style="margin:30px">
    <a style="text-decoration:none; background-color:blue;
    padding:15px; color:white; border-radius:4px"
    href=${SERVER_URL}/verifyEmail/${email}/${emailConfirmCode}>
    Confirm Email</a></p>
    <p>Kindly disregard this email 
    if you did not sign up for an Hello-Books account.</p>
    <p><a style="text-decoration:none; font-size:14px; font-weight:bold"
    href=${PRODUCTION_URL}>Hello Books</a>
    <br>
    <span style="font-style:italic; font-size:10px">Read your love</span></p>
    <p style="margin:10px">© Hello Books Inc. Lagos, Nigeria.</p>
    </div>
    `;
    EmailModule.sendEmailToUser(email, 'Verify Email', content);
  }
}
