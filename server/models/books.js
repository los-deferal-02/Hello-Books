import Debug from 'debug';
import pool from '../config';

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

  /**
   * @name findByPage
   * @static
   * @async
   * @param {Number} limit Uses default parameter of 10
   * @param {Number} page Uses default parameter of 1
   * @returns {Object} Books specified in query
   * @memberof Books
   */
  static async findByPage(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const [
      { rows },
      {
        rows: [{ count }]
      }
    ] = await pool.query(
      `
        SELECT * FROM books 
        ORDER BY "createdOn" 
        LIMIT ${limit} OFFSET ${offset};
        SELECT COUNT(*) FROM books
    `
    );
    const data = {
      currentPage: Number(page),
      pages: Math.ceil(count / limit),
      itemCount: Number(count),
      items: rows
    };
    return data;
  }

   /*
   * Add Favourite Book
   * @static
   * @param {string} userId
   * @param {string} bookId
   * @returns {object} Favourite Book
   * @memberof Books
   */
  static async addFavouriteBook(userId, bookId) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO favourite_books 
    ("userId", "bookId") VALUES($1, $2) RETURNING *`,
        [userId, bookId]
      );
      return rows[0];
    } catch (err) {
      return false;
    }
  }

  /**
   *
   * Method to select all user favourite books
   * @static
   * @param {string} userId
   * @returns {object} containing user favourite books
   * @memberof Books
   */
  static async viewFavouriteBooks(userId) {
    const data = await pool.query(
      `SELECT books.id, books.title FROM books 
      JOIN favourite_books ON books.id = favourite_books."bookId" 
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
   * @param {string} bookId
   * @returns {object} Delete favourite author
   * @memberof Books
   */
  static async deletefavouriteBook(userId, bookId) {
    const data = await pool.query(
      `DELETE FROM favourite_books 
    WHERE "userId" = $1 and "bookId" = $2 RETURNING *`,
      [userId, bookId]
    );
    if (data.rowCount < 1) return false;
    return data.rows[0];
  }
}
