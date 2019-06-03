import express from 'express';
import authRouter from './userAuthRouter';
import booksRouter from './booksRouter';

const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books API'
  });
});

// User Routes
router.use('/auth', authRouter);
router.use('/books', booksRouter);

export default router;
