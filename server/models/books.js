import Debug from 'debug';
import pool from '../config/index';

const debug = Debug('db');

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
      pages,
      hardcopy,
      genreId,
      authorId,
      uploadedBy
    } = book;
    const { rows } = await pool.query(
      `INSERT INTO books
      ("title", "body", "description", "pages", 
      "hardcopy", "genreId", "authorId", "uploadedBy") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [title, body, description, pages, hardcopy, genreId, authorId, uploadedBy]
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
      `INSERT INTO book_requests
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
        book_requests
      WHERE
        title = $1;`,
      [bookTitle.toLowerCase()]
    );

    return rows[0];
  }

  /**
   * @static
   * @description Method to select one book with details
   * @param {number} id Id of the book to be returned
   * @returns {object} Single book details
   * @memberof Books
   */
  static async selectOneBook(id) {
    const data = await pool.query(
      `SELECT books.*, authors."name" AS "authorName", genre."name" AS genre, 
      users."userName" AS uploader FROM books INNER JOIN authors ON 
      books."authorId" = authors.id INNER JOIN genre 
      ON books."genreId" = genre.id INNER JOIN users 
      ON books."uploadedBy" = users.id WHERE books.id = ${id};`
    );
    debug(data.rows[0]);
    return data.rows[0];
  }

  /**
   * @static
   * @description Method to select all books with details
   * @param {number} id Id of the book to be returned
   * @returns {array} All books in the DB
   * @memberof Books
   */
  static async selectAllBooks() {
    const data = await pool.query(
      `SELECT books.*, authors."name" AS "authorName", genre."name" AS genre, 
      users."userName" AS uploader FROM books INNER JOIN authors ON 
      books."authorId" = authors.id INNER JOIN genre 
      ON books."genreId" = genre.id INNER JOIN users 
      ON books."uploadedBy" = users.id`
    );
    debug(data.rows);
    return data.rows;
  }

  /**
   * @static
   * @description Method to select all books with details
   * @param {number} id Id of the book to be updated
   * @param {string} status new status of the book
   * @returns {object} Details of the newly updated book
   * @memberof Books
   */
  static async updateVerification({ verification, id }) {
    const data = await pool.query(
      `UPDATE books SET "verification" = '${verification}' 
      WHERE books.id = ${id} RETURNING *`
    );
    debug(data.rows[0]);
    return data.rows[0];
  }

  /**
   * @static
   * @description Method to delete a book
   * @param {number} id Id of the book to be deleted
   * @returns {object} Details of the newly updated book
   * @memberof Books
   */
  static async deleteBook(id) {
    const data = await pool.query(`DELETE FROM books * WHERE id = ${id}`);
    debug(data.rows);
    return data.rows;
  }

  /**
   *
   * Methond to find author by name
   * @static
   * @param {string} nameOrId
   * @returns {object} Author data
   * @memberof Books
   */
  static async findAuthor(nameOrId) {
    const column = Number.isNaN(Number(nameOrId)) ? 'name' : 'id';
    const data = await pool.query(
      `SELECT * FROM authors 
    WHERE ${column} = $1`,
      [nameOrId]
    );
    if (data.rowCount < 1) return false;
    return data;
  }

  /**
   *
   * Add Favourite Author
   * @static
   * @param {string} userId
   * @param {string} authorId
   * @returns {object} Favourite Author
   * @memberof Books
   */
  static async addFavouriteAuthor(userId, authorId) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO favourite_authors 
    ("userId", "authorId") VALUES($1, $2) RETURNING *`,
        [userId, authorId]
      );
      return rows[0];
    } catch (err) {
      return false;
    }
  }

  /**
   *
   * Method to select all user favourite authors
   * @static
   * @param {string} userId
   * @returns {object} containing user favourite authors
   * @memberof Books
   */
  static async viewFavouriteAuthors(userId) {
    const data = await pool.query(
      `SELECT authors.id, authors.name FROM authors 
    JOIN favourite_authors ON authors.id = favourite_authors."authorId" 
    WHERE "userId" = $1`,
      [userId]
    );
    if (data.rowCount < 1) return false;
    return data.rows;
  }

  /**
   *
   * Delete Favourite Author
   * @static
   * @param {string} userId
   * @param {string} authorId
   * @returns {object} Delete favourite author
   * @memberof Books
   */
  static async deletefavouriteAuthor(userId, authorId) {
    const data = await pool.query(
      `DELETE FROM favourite_authors 
    WHERE "userId" = $1 and "authorId" = $2 RETURNING *`,
      [userId, authorId]
    );
    if (data.rowCount < 1) return false;
    return data.rows[0];
  }
}
