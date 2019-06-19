import pool from '../config';

/**
 *
 *
 * @export
 * @class Genre
 */
export default class Genre {
  /**
   *
   *
   * @static
   * @param {string} name
   * @returns {object} Genre data according to supplied credential
   * @memberof Genre
   */
  static async findOrCreateGenre(name) {
    const data = await pool.query(
      'SELECT * FROM genre WHERE lower("name") = $1',
      [name.toLowerCase()]
    );
    // Check if the query returned a result an assign the rows to genreData
    const genreData = data.rows[0] ? data.rows[0] : null;
    if (genreData && genreData.name.toLowerCase() === name.toLowerCase()) {
      return data.rows;
    }
    const createData = await pool.query(
      'INSERT INTO genre ("name") VALUES ($1) RETURNING *',
      [name]
    );
    return createData.rows;
  }
}
