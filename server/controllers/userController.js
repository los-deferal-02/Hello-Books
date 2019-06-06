import crypto from 'crypto';
import userModel from '../models/users';
import encypt from '../helpers/encrypt';
import emailModule from '../utilities/EmailModule';
import ServerResponse from '../responseSpec';

const { encryptPassword, decryptPassword, generateToken } = encypt;
const { findUserInput, create } = userModel;
const { badPostRequest, successfulRequest } = ServerResponse;

/**
 *
 *
 * @export
 * @class UsersController
 */
export default class UsersController {
  /**
   * Signup middleware - Create User Account
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async signUp(req, res, next) {
    try {
      const data = req.body;
      const { password, userName, email } = data;
      const foundUserEmail = await findUserInput(email);
      const foundUserName = await findUserInput(userName);

      if (foundUserEmail) {
        return badPostRequest(res, 409, { email: 'Email already exists' });
      }

      if (foundUserName) {
        return badPostRequest(res, 409, {
          userName: 'Username already exists'
        });
      }

      data.password = await encryptPassword(password);
      const user = await create(data);
      const token = await generateToken(user);

      return successfulRequest(res, 201, { token });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * Login Middleware - Logs user into the application
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async login(req, res, next) {
    try {
      const data = req.body;
      const { userLogin, password } = data;
      // Login with username or email address
      const user = await findUserInput(userLogin);
      if (!user) {
        return badPostRequest(res, 404, { message: 'Invalid Login Details' });
      }
      const passwordValid = await decryptPassword(password, user.password);
      if (!passwordValid) {
        return badPostRequest(res, 401, { message: 'Invalid Login Details' });
      }
      const token = await generateToken(user);
      return successfulRequest(res, 200, { token });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * Forgot Password Middleware - Enables users request new password
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async forgotPassword(req, res, next) {
    try {
      const { userLogin } = req.body;
      const user = await userModel.findUserInput(userLogin);
      if (!user) {
        return badPostRequest(res, 404, { message: 'Email does not exist' });
      }
      const token = await crypto.randomBytes(20).toString('hex');
      const mailSubject = 'Reset your password';
      const mailContent = `You are receiving this mail because you requested
       for a password change. Please Click on the link below or paste it
       in a browser to complete the process <br />
        http://${req.headers.host}/reset/${token} <br/>
        Link expires in 1 hour time. <br />
       If you did not request this, please Ignore this email and your
       password will remain unchanged.
      `;
      await emailModule.sendEmailToUser(userLogin, mailSubject, mailContent);
      await userModel.updateToken(token, userLogin);
      await userModel.updateTokenExpires(Date.now() + 3600000, userLogin);

      return successfulRequest(res, 200, { token });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * Reset Password Middleware - Enables users reset their password
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async resetPassword(req, res, next) {
    if (req.body.newPassword !== req.body.confirmPassword) {
      return badPostRequest(res, 400, {
        message: 'Confirm password and Password must match'
      });
    }
    try {
      const user = await userModel.findUserToken(req.params.token);
      if (user.rows.length < 1) {
        return badPostRequest(res, 401, { message: 'Token is not valid' });
      }
      if (Date.now() > user.rows[0].resettokenexpires) {
        return badPostRequest(res, 401, { message: 'Token has expired' });
      }
      const password = await encryptPassword(req.body.newPassword);
      await userModel.changePassword(password, user.rows[0].resetpasswordtoken);
      return successfulRequest(res, 200, {
        message: 'Password successfully changed'
      });
    } catch (error) {
      return next(error);
    }
  }
}
