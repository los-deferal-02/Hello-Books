import pool from '../config';

/**
 *
 *
 * @export
 * @class Users
 */
export default class Users {
  /**
   *
   * User model to create user account
   * @static
   * @param {object} user
   * @returns {object} User data
   * @memberof Users
   */
  static async create(user) {
    const {
      userName,
      email,
      firstName,
      lastName,
      password,
      emailConfirmCode
    } = user;
    const { rows } = await pool.query(
      `INSERT INTO 
    users
    ("userName", email, "firstName", "lastName", password, "emailConfirmCode")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
      [userName, email, firstName, lastName, password, emailConfirmCode]
    );
    return rows[0];
  }

  /**
   *
   * User model to create user profile
   * @static
   * @param {object} userId
   * @returns {object} User Profile data
   * @memberof Users
   */
  static async createProfile(userId) {
    const data = await pool.query(
      `INSERT INTO user_profiles(
        "userId"
      )
      VALUES (
        $1
      ) RETURNING *`,
      [userId]
    );
    return data.rows[0];
  }

  /**
   *
   * User model to edit user profile
   * @static
   * @param {object} userId
   * @param {object} userProfile
   * @returns {object} User Profile data
   * @memberof Users
   */
  static async editProfile(userId, userProfile) {
    const profile = await Users.viewProfile(userId);
    const fields = Object.keys(profile);
    const editedFields = Object.keys(userProfile);
    editedFields.map((key) => {
      const edited = fields.filter(prop => prop === key);
      if (edited) {
        profile[key] = userProfile[key];
      }
      return profile;
    });
    const {
      bio,
      avatarUrl,
      favoriteBook,
      favoriteGenre,
      favoriteAuthor,
    } = profile;
    const data = await pool.query(
      `UPDATE user_profiles 
      SET "bio" = $1,
      "avatarUrl" = $2,
      "favoriteBook" = $3,
      "favoriteGenre" = $4,
      "favoriteAuthor" = $5 
      WHERE "userId" = $6
      RETURNING *`,
      [bio, avatarUrl, favoriteBook, favoriteGenre, favoriteAuthor, userId]
    );
    return data.rows[0];
  }

  /**
   *
   * User model to view user profile
   * @static
   * @param {object} userId
   * @returns {object} User Profile data
   * @memberof Users
   */
  static async viewProfile(userId) {
    const data = await pool.query(
      `SELECT * FROM user_profiles WHERE 
      "userId" = $1`,
      [userId]
    );
    return data.rows[0];
  }

  /**
   *
   *
   * @static
   * @param {string} userData
   * @returns {object} User data according to supplied credential
   * @memberof Users
   */
  static async findUserInput(userData) {
    const column = userData.split('@').length === 2 ? 'email' : 'userName';
    const data = await pool.query(
      `SELECT * FROM users WHERE "${column}" = $1`,
      [userData]
    );
    if (data.rowCount < 1) {
      return false;
    }
    return data.rows[0];
  }

  /**
   * @static
   * @param {String} confirmCode
   * @returns {Boolean} true or false to indicate state of operation
   * @memberof Users
   */
  static async verifyEmail(confirmCode) {
    const data = await pool.query(
      `UPDATE users SET "emailConfirmCode" = Null 
      WHERE "emailConfirmCode" = $1`,
      [confirmCode]
    );
    if (!data.rowCount) {
      throw new Error('Error verifying email');
    }
    return true;
  }
}
