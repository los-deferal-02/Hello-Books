import Joi from '@hapi/joi';
import userRegistrationSchema from '../schema/userRegistration';
import ResponseSpec from '../responseSpec';

const { badPostRequest } = ResponseSpec;

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
}
