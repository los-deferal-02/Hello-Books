import userModel from '../models/users';
import encypt from '../helpers/encrypt';

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
   * @returns {object} Token
   * @memberof UsersController
   */
  static async signUp(req, res, next) {
    try {
      const data = req.body;
      const { username, email, password } = data;
      const usernameExists = await userModel.findUserInput(username);
      const emailExists = await userModel.findUserInput(email);

      if (usernameExists) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'Username is already taken'
        });
      }

      if (emailExists) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'Email is already registered'
        });
      }
      data.password = await encryptPassword(password);
      const user = await userModel.create(data);
      const token = await generateToken(user);
      return res.status(201).json({
        status: res.statusCode,
        token
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * Login Middle - Logs user into the application
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
          status: res.statusCode,
          error: 'Invalid Login Details'
        });
      }
      const passwordValid = await decryptPassword(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({
          status: res.statusCode,
          error: 'Invalid Login Details'
        });
      }
      throw Error('Tetsing');
      const token = await generateToken(user);
      return res.status(200).json({
        status: res.statusCode,
        token
      });
    } catch (err) {
      return next(err);
    }
  }
}
