import express from 'express';
import userController from '../controllers/userController';

const {
  signUp, login, forgotPassword, resetPassword
} = userController;

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

// Forgot password routes
router.post('/auth/forgot', forgotPassword);
router.post('/auth/reset/:token', resetPassword);

export default router;
