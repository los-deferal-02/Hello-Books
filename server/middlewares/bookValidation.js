import Joi from '@hapi/joi';
import ResponseSpec from '../responseSpec';
import bookRequestSchema from '../schema/bookRequestSchema';
import addBookSchema from '../schema/addBook';
import verifyBookSchema from '../schema/bookVerification';

const { badPostRequest } = ResponseSpec;

/**
 * Methods for validating user actions on books resource
 *
 * @class BookValidation
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
   * Validate inputs when a user makes a book request
   *
   * @static
   * @name validateBookRequest
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Function to be called if all checks pass
   * @returns {(object|function)} Returns an error object if validation fails
   * @memberof BookValidation
   */
  static validateBookRequest(req, res, next) {
    const userInputs = {
      title: req.body.title,
      author: req.body.author
    };

    const { error } = Joi.validate(userInputs, bookRequestSchema, {
      abortEarly: false
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        const errorDetail = detail;
        errors[errorDetail.context.key] = errorDetail.message;
      });

      return badPostRequest(res, 422, errors);
    }

    return next();
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
