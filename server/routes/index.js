import express from 'express';
import userController from '../controllers/userController';
import AuthValidation from '../middlewares/authValidation';

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail
} = userController;

const { validateRegistration, validateLogIn } = AuthValidation;

const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books API'
  });
});

router.post('/auth/signup', validateRegistration, signUp);
router.post('/auth/login', validateLogIn, login);
router.post('/auth/forgot', forgotPassword);
router.post('/auth/reset/:token', resetPassword);
router.patch('/verifyEmail/:email/:verifyCode', verifyEmail);

export default router;
