import express from 'express';
import bookController from '../controllers/booksController';
import Auth from '../middlewares/auth';
import BookValidation from '../middlewares/bookValidation';
import tryCatch from '../middlewares/tryCatchHandler';

const { verifyToken } = Auth;
const { validateBookAdd, validateBookVerification } = BookValidation;

const {
  addBook,
  getSingleBook,
  getAllBooks,
  adminUpdateVerification,
  deleteABook,
  getAllBorrowedBooks
} = bookController;

const router = express.Router();

router.post('/', verifyToken, validateBookAdd, addBook);
router.get('/', getAllBooks);
router.get('/stats/borrowed', verifyToken, tryCatch(getAllBorrowedBooks));
router.get('/:id', getSingleBook);
router.patch(
  '/:id',
  verifyToken,
  validateBookVerification,
  adminUpdateVerification
);
router.delete('/:id', verifyToken, deleteABook);

export default router;
