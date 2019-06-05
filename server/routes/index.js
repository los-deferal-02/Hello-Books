import express from 'express';
import userController from '../controllers/userController';
import AuthValidation from '../middleware/authValidation';

const { signUp, login } = userController;
const { validateRegistration, validateLogIn } = AuthValidation;

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

export default router;
