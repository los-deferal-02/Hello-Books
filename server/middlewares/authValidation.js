import Joi from '@hapi/joi';
import userRegistrationSchema from '../schema/userRegistration';
import userLoginSchema from '../schema/userLogin';
import ResponseSpec from '../responseSpec';
import userModel from '../models/users';

const { badPostRequest, badGetRequest } = ResponseSpec;
const { findUserInput } = userModel;

/**
 * @description Class representing Validation of incoming auth requests
 * @returns {(object|function)} Next function if all checks pass
 */
export default class AuthValidation {
  /**
   * @description Validation function for user registration
   * @param {object} req - The express request object
   * @param {object} res - The express response object
   * @param {function} next - The function to be called if all checks pass
   * @static
   * @returns {(object|function)} - Returns an error object if validation fails
   */
  static validateRegistration(req, res, next) {
    // abort early is specified to send back all errors
    Joi.validate(
      req.body,
      userRegistrationSchema,
      { abortEarly: false },
      (err) => {
        const errors = {};
        if (err) {
          err.details.forEach((error) => {
            const newError = error;
            errors[newError.context.key] = newError.message;
          });
          return badPostRequest(res, 400, errors);
        }
        return next();
      }
    );
  }

  /**
   * @description Validation function for user login
   * @param {object} req - The express request object
   * @param {object} res - The express response object
   * @param {function} next - The function to be called if all checks pass
   * @static
   * @returns {(object|function)} - Returns an error object if validation fails
   */
  static validateLogIn(req, res, next) {
    Joi.validate(req.body, userLoginSchema, { abortEarly: false }, (err) => {
      const errors = {};
      if (err) {
        err.details.forEach((error) => {
          const newError = error;
          errors[newError.context.key] = newError.message;
        });
        return badPostRequest(res, 400, errors);
      }
      return next();
    });
  }

  /**
   * @name validateVerifiedEmail
   * @static
   * @async
   * @description - Validation function for checking for verified users
   * @param {Object} req - the Express request object
   * @param {Object} res - the Express request object
   * @param {Function} next - the function to be called if all checks pass
   * @returns {(JSON|Function)} - Returns an error
   */
  static async validateVerifiedEmail(req, res, next) {
    const user = await findUserInput(req.body.userLogin);
    if (!user) {
      return badPostRequest(res, 404, { message: 'Invalid Login Details' });
    }
    const { emailConfirmCode } = user;
    if (emailConfirmCode) {
      return badGetRequest(res, 401, { message: 'User email not verified' });
    }
    return next();
  }
}
