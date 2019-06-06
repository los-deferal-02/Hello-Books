import Joi from '@hapi/joi';

/**
 * @description User schema object for Joi validation
 * @constant
 */
export default {
  userLogin: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Username or email is required';
            break;
          case 'any.required':
            err.message = 'Username or email address is required';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  password: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Password is required';
            break;
          case 'any.required':
            err.message = 'Password is required';
            break;
          default:
            break;
        }
      });
      return errors;
    })
};
