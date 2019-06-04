import userModel from '../models/users';
import encypt from '../helpers/encrypt';
import EmailSender from '../utilities/emailSenders';

const { encryptPassword, decryptPassword, generateToken } = encypt;

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
      const { password } = data;
      data.password = await encryptPassword(password);
      const confirmCode = generateToken(req.body);
      data.emailConfirmCode = confirmCode.slice(0, 64);
      await userModel.create(data);
      const token = generateToken(data);
      EmailSender.sendVerifyEmail(data);
      return res.status(201).json({
        status: 'success',
        data: { token }
      });
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
      const user = await userModel.findUserInput(userLogin);
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          data: { message: 'Invalid Login Details' }
        });
      }
      const passwordValid = await decryptPassword(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({
          status: 'fail',
          data: { message: 'Invalid Login Details' }
        });
      }
      const token = await generateToken(user);
      return res.status(200).json({
        status: 'success',
        data: { token }
      });
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
        return res.status(404).json({
          status: 'fail',
          data: { message: 'User not found' }
        });
      }
      await userModel.verifyEmail(verifyCode);
      return res.status(200).json({
        status: 'success',
        data: { message: 'Email verified' }
      });
    } catch (err) {
      return next(err);
    }
  }
}
