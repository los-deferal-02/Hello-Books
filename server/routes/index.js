import express from 'express';
import userController from '../controllers/userController';

const { signUp, login, verifyEmail } = userController;

const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books API'
  });
});

// User Routes
router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.patch('/verifyEmail/:email/:verifyCode', verifyEmail);

export default router;
