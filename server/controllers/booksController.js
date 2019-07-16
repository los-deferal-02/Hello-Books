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
  findAuthor,
  addFavouriteAuthor,
  viewFavouriteAuthors,
  deletefavouriteAuthor,
  addFavouriteBook,
  viewFavouriteBooks,
  deletefavouriteBook,
  selectOneBook,
  selectAllBooks,
  updateVerification,
  deleteBook,
  findByPage,
  findUserBorrowedBooks
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

  /**
   *
   * Method to add favourite author to user list
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} Success message when successful
   * @memberof BooksController
   */
  static async favouriteAuthor(req, res) {
    const authorId = await findAuthor(req.params.id);
    if (!authorId) {
      return badPostRequest(res, 404, { author: 'Author Not Found' });
    }
    const authorAdded = await addFavouriteAuthor(req.user.id, req.params.id);
    if (!authorAdded) {
      return badPostRequest(res, 409, {
        author: 'Author is already added as favourite'
      });
    }
    return successfulRequest(res, 201, {
      message: 'Author added to your favourite list'
    });
  }

  /**
   *
   * Controller method to get all user favourite authors
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} containing list of user favourite authors
   * @memberof BooksController
   */
  static async viewFavouriteAuthors(req, res) {
    const favouriteAuthors = await viewFavouriteAuthors(req.user.id);
    if (!favouriteAuthors) {
      return badGetRequest(res, 404, {
        author: 'You have not yet favourited any author'
      });
    }
    return successfulRequest(res, 200, favouriteAuthors);
  }

  /**
   *
   * Method to delete author from favourite list
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} containing response to the user
   * @memberof BooksController
   */
  static async deleteFavouriteAuthor(req, res) {
    const authorId = await findAuthor(req.params.id);
    if (!authorId) {
      return badPostRequest(res, 404, { author: 'Author Not Found' });
    }

    const deleteAuthor = await deletefavouriteAuthor(
      req.user.id,
      req.params.id
    );
    if (!deleteAuthor) {
      return badPostRequest(res, 404, {
        author: 'Author Not Found in your Favourite List'
      });
    }

    return successfulRequest(res, 200, {
      message: 'Author deleted from your favourite list'
    });
  }

  /**
   * @name getBooksByPage
   * @static
   * @async
   * @memberof BooksController
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object} JSON object with requested books
   */
  static async getBooksByPage(req, res, next) {
    try {
      const { limit, page } = req.query;
      const books = await findByPage(limit, page);
      return successfulRequest(res, 200, { ...books });
    } catch (error) {
      return next(error);
    }
  }
  
  /*
   * Method to add favourite book to user list
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} Success message when successful
   * @memberof BooksController
   */
  static async favouriteBook(req, res) {
    const bookId = await selectOneBook(req.params.id);
    if (!bookId) {
      return badPostRequest(res, 404, { book: 'Book Not Found' });
    }
    const bookAdded = await addFavouriteBook(req.user.id, req.params.id);
    if (!bookAdded) {
      return badPostRequest(res, 409, {
        book: 'Book is already added as favourite'
      });
    }
    return successfulRequest(res, 201, {
      message: 'Book added to your favourite list'
    });
  }

  /**
   *
   * Controller method to get all user favourite books
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} containing list of user favourite books
   * @memberof BooksController
   */
  static async viewFavouriteBooks(req, res) {
    const favouriteBooks = await viewFavouriteBooks(req.user.id);
    if (!favouriteBooks) {
      return badGetRequest(res, 404, {
        book: 'You have not yet favourited any books'
      });
    }
    return successfulRequest(res, 200, favouriteBooks);
  }

  /**
   *
   * Method to delete book from favourite list
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} containing response to the user
   * @memberof BooksController
   */
  static async deleteFavouriteBook(req, res) {
    const bookId = await selectOneBook(req.params.id);
    if (!bookId) {
      return badPostRequest(res, 404, { book: 'Book Not Found' });
    }
    const deletedBook = await deletefavouriteBook(req.user.id, req.params.id);
    if (!deletedBook) {
      return badPostRequest(res, 404, {
        book: 'Book Not Found in your Favourite List'
      });
    }

    return successfulRequest(res, 200, {
      message: 'Book deleted from your favourite list'
    });
  }

  /**
   *
   * Controller method to get all user borrowed books
   * @static
   * @param {object} req
   * @param {object} res
   * @return {object} response containing borrowed books stats
   * @memberof BooksController
   */
  static async getAllBorrowedBooks(req, res) {
    const borrowedBooks = await findUserBorrowedBooks(req.user.id);
    if (!borrowedBooks) {
      return badPostRequest(res, 404, {
        borrowedBooks: 'You have not read any book'
      });
    }
    const returned = borrowedBooks.filter(book => book.due);
    const possession = borrowedBooks.filter(book => !book.due);
    return successfulRequest(res, 200, { possession, returned });
  }
}
