import Joi from '@hapi/joi';
import bookRequestSchema from '../schema/bookRequestSchema';
import ResponseSpec from '../responseSpec';

const { badPostRequest } = ResponseSpec;

/**
 * Methods for validating user actions on books resource
 *
 * @class BookValidation
 */
export default class BookValidation {
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
}
