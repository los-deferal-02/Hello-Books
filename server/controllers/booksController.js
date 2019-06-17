import bookModel from '../models/books';
import ServerResponse from '../responseSpec';


const { successfulRequest, badPostRequest } = ServerResponse;

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

  /**
   * Store book request made by user to the database
   *
   * @static
   * @async
   * @name addBookRequest
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Function to be called if all checks pass
   * @returns {boolean} Information about whether or not the operation succeeds
   * @memberof Books
   */
  static async addBookRequest(req, res, next) {
    try {
      const { title, author } = req.body;

      const existingBookRequest = await bookModel.findABookRequest(title);
      if (existingBookRequest) {
        return badPostRequest(res, 409, {
          message: 'A request has already been made for this book'
        });
      }

      // "userId" is temporarily hardcoded because the role access functionality
      // has not been implemented
      const bookRequest = await bookModel.createBookRequest({
        userId: 1,
        title,
        author,
      });

      return successfulRequest(res, 201, { bookRequest });
    } catch (error) {
      return next(error);
    }
  }
}
