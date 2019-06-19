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
}
