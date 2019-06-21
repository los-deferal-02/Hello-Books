import ResponseSpec from '../responseSpec';

const { badGetRequest } = ResponseSpec;

/**
 * @description Class representing Access Control of incoming requests
 * @returns {(object|function)} Next function if access is granted
 */
export default class Roles {
  /**
   *
   * Verify user token
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {string} Token
   * @memberof encrypt
   */
  static admin(req, res, next) {
    if (req.user.role === 4) {
      return next();
    }
    return badGetRequest(res, 401, {
      message: 'You are not authorized!'
    });
  }

  /**
   *
   * Verify user token
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {string} Token
   * @memberof encrypt
   */
  static restrictUser(req, res, next) {
    if (req.user.role === 1) {
      return badGetRequest(res, 401, {
        message: 'You are not authorized!'
      });
    }
    return next();
  }
}
