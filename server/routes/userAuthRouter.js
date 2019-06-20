import express from 'express';
import userController from '../controllers/userController';
import AuthValidation from '../middlewares/authValidation';

const {
  signUp, login, forgotPassword, resetPassword
} = userController;
const { validateRegistration, validateLogIn } = AuthValidation;

const router = express.Router();

// User Routes
router.post('/signup', validateRegistration, signUp);
router.post('/login', validateLogIn, login);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;
