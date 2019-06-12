import bookModel from '../models/books';
import ServerResponse from '../responseSpec';


const { successfulRequest } = ServerResponse;

/**
 *
 *
 * @export
 * @class BooksController
 */
export default class BooksController {
  /**
   * addBook controller - Add new book
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} bookDetails
   * @memberof BooksController
   */
  static async addBook(req, res, next) {
    try {
      const data = req.body;
      const {
        title,
        body,
        description,
        genre,
        pages,
        author,
      } = data;
      await bookModel.create(data);
      return successfulRequest(res, 201, {
        bookTitle: title,
        bookBody: body,
        bookDescription: description,
        bookGenre: genre,
        bookPages: pages,
        bookAuthor: author,
      });
    } catch (err) {
      return next(err);
    }
  }
}
