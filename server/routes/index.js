import express from 'express';
import authRouter from './userAuthRouter';
import booksRouter from './booksRouter';
import emailVerificationRouter from './emailVerificationRouter';
import profileRouter from './profileRouter';
import authorsRouter from './authorsRouter';


const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books API'
  });
});

router.use('/auth', authRouter);
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);
router.use('/userProfile', profileRouter);
router.use('/verifyEmail', emailVerificationRouter);

export default router;
