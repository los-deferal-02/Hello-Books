import userModel from '../models/users';
import encypt from '../helpers/encrypt';
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
}
