import Joi from '@hapi/joi';
import ResponseSpec from '../responseSpec';
import addBookSchema from '../schema/addBook';
import verifyBookSchema from '../schema/bookVerification';

const { badPostRequest } = ResponseSpec;

/**
 * @description Class representing Validation of incoming book requests
 * @returns {(object|function)} Next function if all checks pass
 */
export default class BookValidation {
  /**
   * @description Validation function for adding books
   * @param {object} req - The express request object
   * @param {object} res - The express response object
   * @param {function} next - The function to be called if all checks pass
   * @static
   * @returns {(object|function)} - Returns an error object if validation fails
   */
  static validateBookAdd(req, res, next) {
    Joi.validate(req.body, addBookSchema, { abortEarly: false }, (err) => {
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
   * @description Validation function for verifying books
   * @param {object} req - The express request object
   * @param {object} res - The express response object
   * @param {function} next - The function to be called if all checks pass
   * @static
   * @returns {(object|function)} - Returns an error object if validation fails
   */
  static validateBookVerification(req, res, next) {
    Joi.validate(req.body, verifyBookSchema, { abortEarly: false }, (err) => {
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
}
