import bycrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


/**
 *
 *
 * @export
 * @class encrypt
 */
export default class encrypt {
  /**
   *
   * Encrypt User Password
   * @static
   * @param {string} password
   * @returns {string} Encrypted Password
   * @memberof encrypt
   */
  static encryptPassword(password) {
    return bycrpt.hashSync(password, 10);
  }


  /**
   *
   * Decrypt User Password
   * @static
   * @param {string} inputPassword
   * @param {string} encryptedPassword
   * @returns {boolen} True if valid
   * @memberof encrypt
   */
  static decryptPassword(inputPassword, encryptedPassword) {
    return bycrpt.compareSync(inputPassword, encryptedPassword);
  }


  /**
   *
   * Generate user token
   * @static
   * @param {object} user
   * @returns {string} Token
   * @memberof encrypt
   */
  static generateToken(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload,
      process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  }
}
