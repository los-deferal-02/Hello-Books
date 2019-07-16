import Joi from '@hapi/joi';
import ResponseSpec from '../responseSpec';
import addBookSchema from '../schema/addBook';
import verifyBookSchema from '../schema/bookVerification';

const { badPostRequest, badGetRequest } = ResponseSpec;

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

  /**
   * @description Validation function for getting books by page
   * @name validateGetBooks
   * @static
   * @async
   * @memberof AuthValidation
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {(object|Function)} an error object if validation fails
   */
  static async validateGetBooksByPage(req, res, next) {
    try {
      const schema = {
        page: Joi.number().optional(),
        limit: Joi.number().optional()
      };
      await Joi.validate(req.query, schema, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.details.map(x => x.message.replace(/([\\"])/g, ''));
      return badGetRequest(res, 400, errors);
    }
  }
}
