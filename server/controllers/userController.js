import userModel from '../models/users';
import encypt from '../helpers/encrypt';
import EmailSender from '../utilities/emailSenders';
import ServerResponse from '../responseSpec';

const { encryptPassword, decryptPassword, generateToken } = encypt;
const { findUserInput, create } = userModel;
const { badPostRequest, badGetRequest, successfulRequest } = ServerResponse;

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
        return badPostRequest(res, 409, {
          email: 'Email already exists'
        });
      }

      if (foundUserName) {
        return badPostRequest(res, 409, {
          userName: 'Username already exists'
        });
      }
      data.password = encryptPassword(password);
      const confirmCode = generateToken(req.body);
      data.emailConfirmCode = confirmCode.slice(0, 64);
      const user = await create(data);
      const token = generateToken(user);
      EmailSender.sendVerifyEmail(data);
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
   * Verify Email middleware- verify user's email address
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {JSON} Json response for email confirmation
   * @memberof UsersController
   */
  static async verifyEmail(req, res, next) {
    try {
      const userDetails = req.params;
      const { email, verifyCode } = userDetails;
      const user = await userModel.findUserInput(email);
      if (!user) {
        return badGetRequest(res, 404, { message: 'User not found' });
      }
      await userModel.verifyEmail(verifyCode);
      return successfulRequest(res, 200, { message: 'Email verified' });
    } catch (err) {
      return next(err);
    }
  }
}
