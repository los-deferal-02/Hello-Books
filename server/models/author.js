import pool from '../config';

/**
 *
 *
 * @export
 * @class Author
 */
export default class Author {
  /**
   *
   *
   * @static
   * @param {string} name
   * @returns {object} Author data according to supplied credential
   * @memberof Author
   */
  static async findOrCreateAuthor(name) {
    const data = await pool.query(
      'SELECT * FROM authors WHERE lower("name") = $1',
      [name.toLowerCase()]
    );
    // Check if the query returned a result an assign the rows to authorData
    const authorData = data.rows[0] ? data.rows[0] : null;
    if (authorData && authorData.name.toLowerCase() === name.toLowerCase()) {
      return data.rows;
    }
    const createData = await pool.query(
      'INSERT INTO authors ("name") VALUES ($1) RETURNING *',
      [name]
    );
    return createData.rows;
  }
}
