import express from 'express';
import bookController from '../controllers/booksController';

const { addBook } = bookController;

const router = express.Router();

router.post('/', addBook);

export default router;
