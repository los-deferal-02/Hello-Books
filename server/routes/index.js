import express from 'express';
import userController from '../controllers/userController';

const { signUp, login } = userController;

const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books Deferral'
  });
});

// User Routes
router.post('/auth/signup', signUp);
router.post('/auth/login', login);

export default router;
