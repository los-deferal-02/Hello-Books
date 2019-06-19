import bookModel from '../models/books';
import authorModel from '../models/author';
import genreModel from '../models/genre';
import ServerResponse from '../responseSpec';
import isEmpty from '../helpers/isEmpty';

const { successfulRequest, badGetRequest, badPostRequest } = ServerResponse;
const { findOrCreateAuthor } = authorModel;
const { findOrCreateGenre } = genreModel;
const {
  create,
  selectOneBook,
  selectAllBooks,
  updateVerification,
  deleteBook
} = bookModel;

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
      const {
        title,
        body,
        description,
        genre,
        pages,
        author,
        hardcopy
      } = req.body;
      const bookGenre = await findOrCreateGenre(genre);
      const bookAuthor = await findOrCreateAuthor(author);
      const data = {
        title,
        body,
        description,
        pages,
        hardcopy
      };

      data.genreId = bookGenre[0].id;
      data.authorId = bookAuthor[0].id;
      data.uploadedBy = req.user.id;
      await create(data);
      return successfulRequest(res, 201, {
        bookTitle: title,
        bookBody: body,
        bookDescription: description,
        bookGenre: bookGenre[0].name,
        bookPages: pages,
        bookAuthor: bookAuthor[0].name
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @description View one book with details
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} bookDetails
   * @memberof BooksController
   */
  static async getSingleBook(req, res, next) {
    try {
      const { id } = req.params;
      const bookDetails = await selectOneBook(parseInt(id, 10));
      if (bookDetails) {
        delete bookDetails.authorId;
        delete bookDetails.genreId;
        delete bookDetails.uploadedBy;
        return successfulRequest(res, 200, bookDetails);
      }
      return badGetRequest(res, 404, { bookId: 'Book not found' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @description View all books with details
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} booksDetails
   * @memberof BooksController
   */
  static async getAllBooks(req, res, next) {
    try {
      const allBooks = await selectAllBooks();
      if (allBooks.length > 0) {
        const booksDetails = allBooks.map((book) => {
          delete book.authorId;
          delete book.genreId;
          delete book.uploadedBy;
          return book;
        });
        return successfulRequest(res, 200, booksDetails);
      }
      return badGetRequest(res, 404, {
        message: 'There are no books at this time'
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @description Update verification status of a book
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} updatedBookDetails
   * @memberof BooksController
   */
  static async adminUpdateVerification(req, res, next) {
    try {
      if (req.user.role !== 4) {
        return badGetRequest(res, 401, { message: 'You are not authorized!' });
      }
      const { id } = req.params;
      const { verification } = req.body;
      const data = {};
      const bookToBeUpdated = await selectOneBook(parseInt(id, 10));
      if (isEmpty(bookToBeUpdated)) {
        return badGetRequest(res, 404, { bookId: 'Book not found' });
      }
      if (bookToBeUpdated.verification === verification) {
        return badPostRequest(res, 409, {
          // eslint-disable-next-line max-len
          verification: `This book's verification status is already ${verification}`
        });
      }
      data.id = id;
      data.verification = verification;
      const updatedBookDetails = await updateVerification(data);
      return successfulRequest(res, 200, updatedBookDetails);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @description Delete a book
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} message about deleted book
   * @memberof BooksController
   */
  static async deleteABook(req, res, next) {
    try {
      if (req.user.role !== 4) {
        return badGetRequest(res, 401, { message: 'You are not authorized!' });
      }
      const { id } = req.params;
      const bookToBeDeleted = await selectOneBook(parseInt(id, 10));
      if (isEmpty(bookToBeDeleted)) {
        return badGetRequest(res, 404, { bookId: 'Book not found' });
      }
      await deleteBook(parseInt(id, 10));
      return successfulRequest(res, 200, {
        bookId: 'This book has been successfully deleted'
      });
    } catch (err) {
      return next(err);
    }
  }
}
