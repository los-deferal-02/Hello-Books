import express from 'express';
import bookController from '../controllers/booksController';
import BookValidation from '../middlewares/bookValidation';

const { addBook, addBookRequest } = bookController;
const { validateBookRequest } = BookValidation;

const router = express.Router();

router.post('/', addBook);
router.post('/request', validateBookRequest, addBookRequest);

export default router;
