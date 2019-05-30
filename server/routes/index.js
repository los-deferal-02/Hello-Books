import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books Deferral API Version 1'
  });
});

export default router;
