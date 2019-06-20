import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ResponseSpec from '../responseSpec';

dotenv.config();
const { badPostRequest } = ResponseSpec;

/**
 * @description Class representing Authentication of incoming requests
 * @returns {(object|function)} Next function if all checks pass
 */
export default class Auth {
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
  static verifyToken(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return badPostRequest(res, 403, {
        message: 'No token provided'
      });
    }
    const tokenArr = bearerToken.split(' ');
    const token = tokenArr[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return badPostRequest(res, 401, {
          message: 'Failed to authenticate token.'
        });
      }
      req.user = decoded;
      return next();
    });
  }
}
