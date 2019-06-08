import express from 'express';
import userController from '../controllers/userController';
import AuthValidation from '../middlewares/authValidation';
import Auth from '../middlewares/auth';

const {
  signUp, login, verifyEmail, editUserProfile, viewUserProfile
} = userController;

const { validateRegistration, validateLogIn } = AuthValidation;

const { verifyToken } = Auth;

const router = express.Router();

// Hello-Books API Default Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books API'
  });
});

// User Routes
router.post('/auth/signup', validateRegistration, signUp);
router.post('/auth/login', validateLogIn, login);
router.patch('/verifyEmail/:email/:verifyCode', verifyEmail);
router.patch('/userProfile/:id', verifyToken, editUserProfile);
router.get('/userProfile/:id', viewUserProfile);

export default router;
