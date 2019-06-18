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
      title, body, description, genre, pages, author
    } = book;
    const { rows } = await pool.query(
      `INSERT INTO books
    (title, body, description, genre, pages, author) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
      [title, body, description, genre, pages, author]
    );
    return rows[0];
  }

  /**
   * Store book request made by user to the database
   *
   * @static
   * @async
   * @name createBookRequest
   * @param {object} bookRequestEntity - Details of the book request
   * @returns {object} Details of the book request entity from database
   * @memberof Books
   */
  static async createBookRequest(bookRequestEntity) {
    const { userId, title, author } = bookRequestEntity;
    const { rows } = await pool.query(
      `INSERT INTO book_request
        ("userId", title, author) 
      VALUES
        ($1, $2, $3)
      RETURNING *`,
      [userId, title.toLowerCase(), author]
    );

    return rows[0];
  }

  /**
   * Store book request made by user to the database
   *
   * @static
   * @async
   * @name findABookRequest
   * @param {string} bookTitle - Title of the book that was requested
   * @returns {object} Details of the book that was searched
   * @memberof Books
   */
  static async findABookRequest(bookTitle) {
    const { rows } = await pool.query(
      `SELECT
        id,
        "userId",
        title,
        author
      FROM
        book_request
      WHERE
        title = $1;`,
      [bookTitle.toLowerCase()]
    );

    return rows[0];
  }
}
