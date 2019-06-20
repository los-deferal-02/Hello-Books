import express from 'express';
import bookController from '../controllers/booksController';
import Auth from '../middlewares/auth';
import tryCatch from '../middlewares/tryCatchHandler';

const { verifyToken } = Auth;

const {
  favouriteAuthor,
  viewFavouriteAuthors,
  deleteFavouriteAuthor
} = bookController;

const router = express.Router();
router.post('/:id/favourite', verifyToken, tryCatch(favouriteAuthor));
router.patch('/:id/favourite', verifyToken, tryCatch(deleteFavouriteAuthor));
router.get('/favourites', verifyToken, tryCatch(viewFavouriteAuthors));

export default router;
