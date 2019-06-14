import pool from '../config/index';

/**
 *
 *
 * @export
 * @class Books
 */
export default class Books {
  /**
   *
   * Book model to create new Books
   * @static
   * @param {object} book
   * @returns {object} Book data
   * @memberof Books
   */
  static async create(book) {
    const {
      title,
      body,
      description,
      genre,
      pages,
      author,
    } = book;
    const { rows } = await pool.query(`INSERT INTO books
    (title, body, description, genre, pages, author) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [title, body, description, genre, pages, author]);
    return rows[0];
  }
}
