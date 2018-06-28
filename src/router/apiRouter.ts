import express from 'express';
import userRouter from './userRouter';
import workRouter from './workRouter';

const router = express.Router();

router.all('/user', userRouter);
router.all('/work', workRouter);

export default router;