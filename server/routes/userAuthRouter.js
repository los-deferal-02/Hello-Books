import express from 'express';
import userController from '../controllers/userController';

const { signUp, login } = userController;

const router = express.Router();

// User Routes
router.post('/signup', signUp);
router.post('/login', login);

export default router;
