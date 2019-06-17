/* eslint-disable no-unused-vars */
import Debug from 'debug';

const debug = Debug('dev');

/**
 * @description Server response according to defined JSend specs
 */
export default class ResponseSpec {
  /**
   * @description Response method for a bad POST request
   * @param {object} res - The response object
   * @param {number} status - The status code of the response
   * @param {object} errorData - Details concerning the data
   * @static
   * @returns {object} A response object sent back to the clinet
   */
  static badPostRequest(res, status, errorData) {
    return res.status(status).json({
      status: 'fail',
      data: errorData
    });
  }

  /**
   * @description Response method for a failed get request
   * @param {object} res - Response object
   * @param {number} status - Status code of the response
   * @param {(string|object)} message - Description of failure
   * @static
   * @returns {object} - A response object sent to the client
   */
  static badGetRequest(res, status, message) {
    return res.status(status).json({
      status: 'fail',
      data: message
    });
  }

  /**
   * @description Response method for a a successful request
   * @param {object} res - Response object
   * @param {number} status - Status code of the response
   * @param {(string|object)} data - Data or message sent back to the client
   * @static
   * @returns {object} - A response object sent to the client
   */
  static successfulRequest(res, status, data) {
    return res.status(status).json({
      status: 'success',
      data
    });
  }

  /**
   * @description Response method for an unecxpected server error
   * @param {object} err - The error object
   * @param {object} req - Request object
   * @param {object} res - The response object
   * @param {function} next - The next function to be called
   * @static
   * @returns {object} - A response object sent to the client
   */
  static serverError(err, req, res, next) {
    debug(err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Sorry, something unusual happened, we are working on a fix'
    });
  }

  /**
   * Error Handler for unknown routes
   * @param {object} req
   * @param {object} res
   * @returns {object} Containing Error Message
   */
  static error404(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'Oops!! Page not found'
    });
  }
}
