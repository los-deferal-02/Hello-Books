import Joi from '@hapi/joi';

/**
 * @description Book schema object for Joi validation
 * @constant
 */
export default {
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book title is required';
            break;
          case 'any.required':
            err.message = 'Book title is required';
            break;
          case 'string.min':
            err.message = `Book title should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `Book title should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  body: Joi.string()
    .min(2)
    .max(100)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book body is required';
            break;
          case 'any.required':
            err.message = 'Book body is required';
            break;
          case 'string.min':
            err.message = `Book body should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `Book body should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  description: Joi.string()
    .min(2)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book description is required';
            break;
          case 'any.required':
            err.message = 'Book description is required';
            break;
          case 'string.min':
            err.message = `Book description should not be less than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  genre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book genre is required';
            break;
          case 'any.required':
            err.message = 'Book genre is required';
            break;
          case 'string.min':
            err.message = `Book genre should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `Book genre should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  hardcopy: Joi.boolean()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book copy type is required';
            break;
          case 'any.required':
            err.message = 'Book copy type is required';
            break;
          case 'boolean.base':
            err.message = 'Book hardcopy can either be true or false';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  pages: Joi.number()
    .min(2)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Number of pages is required';
            break;
          case 'any.required':
            err.message = 'Number of pages is required';
            break;
          case 'number.base':
            err.message = 'Please input a valid number of pages';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  author: Joi.string()
    .min(2)
    .max(100)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Book author is required';
            break;
          case 'any.required':
            err.message = 'Book author is required';
            break;
          case 'string.min':
            err.message = `Book author should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `Book author should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    })
};
