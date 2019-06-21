import express from 'express';
import bookController from '../controllers/booksController';
import Auth from '../middlewares/auth';
import BookValidation from '../middlewares/bookValidation';

const { verifyToken } = Auth;
const {
  validateBookAdd,
  validateBookVerification,
  validateGetBooksByPage
} = BookValidation;

const {
  addBook,
  getSingleBook,
  getAllBooks,
  adminUpdateVerification,
  deleteABook,
  getBooksByPage
} = bookController;

const router = express.Router();

router.post('/', verifyToken, validateBookAdd, addBook);
router.get('/pages', validateGetBooksByPage, getBooksByPage);
router.get('/', getAllBooks);
router.get('/:id', getSingleBook);
router.patch(
  '/:id',
  verifyToken,
  validateBookVerification,
  adminUpdateVerification
);
router.delete('/:id', verifyToken, deleteABook);

export default router;
