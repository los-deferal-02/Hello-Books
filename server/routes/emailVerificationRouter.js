import express from 'express';
import userController from '../controllers/userController';

const { verifyEmail } = userController;

const router = express.Router();

router.patch('/:email/:verifyCode', verifyEmail);

export default router;
