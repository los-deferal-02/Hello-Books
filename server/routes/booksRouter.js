import express from 'express';
import bookController from '../controllers/booksController';
import BookValidation from '../middlewares/bookValidation';
import Auth from '../middlewares/auth';

const { verifyToken } = Auth;
const {
  validateBookAdd,
  validateBookVerification,
  validateBookRequest
} = BookValidation;

const {
  addBook,
  getSingleBook,
  getAllBooks,
  adminUpdateVerification,
  deleteABook,
  addBookRequest
} = bookController;

const router = express.Router();

router.post('/', verifyToken, validateBookAdd, addBook);
router.get('/', getAllBooks);
router.get('/:id', getSingleBook);
router.patch(
  '/:id',
  verifyToken,
  validateBookVerification,
  adminUpdateVerification
);
router.delete('/:id', verifyToken, deleteABook);
router.post('/request', validateBookRequest, verifyToken, addBookRequest);

export default router;
