import bookModel from '../models/books';
import ServerResponse from '../responseSpec';


const { successfulRequest, badPostRequest, badGetRequest } = ServerResponse;
const {
  create, findAuthor, addFavouriteAuthor,
  viewFavouriteAuthors, deletefavouriteAuthor
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
      const data = req.body;
      const {
        title,
        body,
        description,
        genre,
        pages,
        author,
      } = data;
      await create(data);
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
    const authorAdded = await addFavouriteAuthor(req.userId, req.params.id);
    if (!authorAdded) {
      return badPostRequest(res, 409,
        { author: 'Author is already added as favourite' });
    }
    return successfulRequest(res, 201,
      { message: 'Author added to your favourite list' });
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
    const favouriteAuthors = await viewFavouriteAuthors(req.userId);
    if (!favouriteAuthors) {
      return badGetRequest(res, 404,
        { author: 'You have not yet favourited any author' });
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

    const deleteAuthor = await
    deletefavouriteAuthor(req.userId, req.params.id);
    if (!deleteAuthor) {
      return badPostRequest(res, 404,
        { author: 'Author Not Found in your Favourite List' });
    }

    return successfulRequest(res, 200,
      { message: 'Author deleted from your favourite list' });
  }
}
