/* eslint max-len: ["error", { "ignoreStrings": true }] */
import Joi from '@hapi/joi';

/**
 * @description User schema object for Joi validation
 * @constant
 */
export default {
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'First name is required';
            break;
          case 'any.required':
            err.message = 'First name is required';
            break;
          case 'string.min':
            err.message = `First name should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `First name should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Last name is required';
            break;
          case 'any.required':
            err.message = 'Last name is required';
            break;
          case 'string.min':
            err.message = `Last name should not be less than ${
              err.context.limit
            } characters!`;
            break;
          case 'string.max':
            err.message = `Last name should not be more than ${
              err.context.limit
            } characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  password: Joi.string()
    .min(7)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
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
          case 'string.min':
            err.message = `Password must not be less than ${
              err.context.limit
            } characters and must contain at least one number`;
            break;
          case 'string.regex.base':
            // max length error was disabled on the file because of this line
            err.message = 'Password at least one uppercase, one lowercase and one number e.g Coolpassword1000';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Email is required';
            break;
          case 'any.required':
            err.message = 'Email is required';
            break;
          case 'string.email':
            err.message = 'Please input a valid email e.g somename@somedomain.com';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  userName: Joi.string()
    .min(3)
    .max(15)
    .alphanum()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Username is required';
            break;
          case 'any.required':
            err.message = 'Username is required';
            break;
          case 'string.min':
            err.message = 'Username cannot be less than 3 characters';
            break;
          case 'string.max':
            err.message = `Username should not be more than ${
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
