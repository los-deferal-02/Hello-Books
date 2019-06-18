/* eslint-disable max-len */
import Joi from '@hapi/joi';

/**
 * @description Book request schema object for Joi validation
 * @constant
 */
export default {
  title: Joi.string()
    .required()
    .max(255)
    .error((errors) => {
      errors.forEach((error) => {
        switch (error.type) {
          case 'any.empty':
            error.message = 'Title should not be empty';
            break;
          case 'any.required':
            error.message = 'Title is required';
            break;
          case 'string.max':
            error.message = `Title should not be more than ${
              error.context.limit
            } characters`;
            break;
          default:
            break;
        }
      });

      return errors;
    }),
  author: Joi.string()
    .required()
    .max(150)
    .error((errors) => {
      errors.forEach((error) => {
        switch (error.type) {
          case 'any.empty':
            error.message = 'Author should not be empty';
            break;
          case 'any.required':
            error.message = 'Author is required';
            break;
          case 'string.max':
            error.message = `Author should not be more than ${
              error.context.limit
            } characters`;
            break;
          default:
            break;
        }
      });

      return errors;
    })
};
