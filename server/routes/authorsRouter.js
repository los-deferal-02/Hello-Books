import express from 'express';
import bookController from '../controllers/booksController';
import Auth from '../middlewares/auth';

const { verifyToken } = Auth;

const { favouriteAuthor } = bookController;

const router = express.Router();
router.post('/:id/favourite', verifyToken, favouriteAuthor);

export default router;
