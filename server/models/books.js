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
    let authorId = await Books.findAuthor(author);
    if (!authorId) {
      authorId = await pool.query(`INSERT INTO authors (name)
    VALUES($1) RETURNING authors.id`, [author]);
    }
    const { rows } = await pool.query(`INSERT INTO books
    (title, body, description, genre, pages, "authorId")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [title, body, description, genre, pages, authorId.rows[0].id]);
    return rows[0];
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
    const column = (Number.isNaN(Number(nameOrId)) ? 'name' : 'id');
    const data = await pool.query(`SELECT * FROM authors 
    WHERE ${column} = $1`, [nameOrId]);
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
      const { rows } = await pool.query(`INSERT INTO favourite_authors 
    ("userId", "authorId") VALUES($1, $2) RETURNING *`, [userId, authorId]);
      return rows[0];
    } catch (err) {
      return false;
    }
  }
}
