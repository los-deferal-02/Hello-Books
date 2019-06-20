import Joi from '@hapi/joi';

/**
 * @description Book verification schema object for Joi validation
 * @constant
 */
export default {
  verification: Joi.string()
    .valid('verified', 'rejected', 'pending')
    .trim()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Verification status is required';
            break;
          case 'any.required':
            err.message = 'Verificaiton status is required';
            break;
          case 'any.allowOnly':
            // eslint-disable-next-line max-len
            err.message = 'verification status must be one of verified, rejected, pending';
            break;
          default:
            break;
        }
      });
      return errors;
    })
};
