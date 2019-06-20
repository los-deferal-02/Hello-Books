import crypto from 'crypto';
import userModel from '../models/users';
import encypt from '../helpers/encrypt';
import emailModule from '../utilities/emailModule';
import EmailSender from '../utilities/emailSenders';
import ServerResponse from '../responseSpec';

const { encryptPassword, decryptPassword, generateToken } = encypt;
const {
  findUserInput,
  create,
  createProfile,
  editProfile,
  viewProfile
} = userModel;
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
      await createProfile(user.id);
      const userData = user;
      delete userData.password;
      const token = generateToken(userData);
      EmailSender.sendVerifyEmail(data);
      return successfulRequest(res, 201, { id: user.id, token });
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
      const userData = user;
      delete userData.password;
      const token = await generateToken(userData);
      return successfulRequest(res, 200, { id: user.id, token });
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

  /**
   *
   * Forgot Password Middleware - Enables users request new password
   * Edit user profile
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
      emailModule.sendEmailToUser(userLogin, mailSubject, mailContent);
      await userModel.updateToken(token, userLogin);
      await userModel.updateTokenExpires(Date.now() + 3600000, userLogin);

      return successfulRequest(res, 200, { token });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * Edit user Profile
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async editUserProfile(req, res, next) {
    try {
      const data = req.body;
      const { id } = req.params;
      const userId = req.user.id;
      if (parseInt(id, 10) !== userId) {
        return badPostRequest(res, 401, {
          message: 'Unauthorized access'
        });
      }
      const userProfile = await editProfile(id, data);
      if (!userProfile) {
        return badPostRequest(res, 400, {
          message: 'Profile failed to update'
        });
      }
      return successfulRequest(res, 200, { ...userProfile });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * Reset Password Middleware - Enables users reset their password
   * View user profile
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

  /**
   *
   * View User
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Object containing token to the user
   * @memberof UsersController
   */
  static async viewUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const userProfile = await viewProfile(id);
      if (!userProfile) {
        return badPostRequest(res, 404, {
          message: 'Profile not found'
        });
      }
      return successfulRequest(res, 200, { ...userProfile });
    } catch (err) {
      return next(err);
    }
  }
}
