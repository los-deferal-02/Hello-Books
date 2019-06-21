import express from 'express';
import bookController from '../controllers/booksController';
import Auth from '../middlewares/auth';
import BookValidation from '../middlewares/bookValidation';
import Roles from '../middlewares/roles';

const { verifyToken } = Auth;
const {
  validateBookAdd,
  validateBookVerification,
  validateGetBooksByPage
} = BookValidation;
const { restrictUser, admin } = Roles;

const {
  addBook,
  getSingleBook,
  getAllBooks,
  adminUpdateVerification,
  deleteABook,
  getBooksByPage,
  favouriteBook,
  viewFavouriteBooks,
  deleteFavouriteBook
} = bookController;

const router = express.Router();

router.post('/', verifyToken, validateBookAdd, restrictUser, addBook);
router.get('/pages', validateGetBooksByPage, getBooksByPage);
router.get('/', getAllBooks);
router.get('/:id', getSingleBook);
router.patch(
  '/:id',
  verifyToken,
  admin,
  validateBookVerification,
  adminUpdateVerification
);
router.delete('/:id', verifyToken, admin, deleteABook);
router.post('/:id/favourites', verifyToken, favouriteBook);
router.get('/all/favourites', verifyToken, viewFavouriteBooks);
router.delete('/:id/favourites', verifyToken, deleteFavouriteBook);

export default router;
