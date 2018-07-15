import express from 'express';
import userRouter from './userRouter';
import workRouter from './workRouter';

const router = express.Router();

router.use('/user', userRouter);
router.use('/work', workRouter);

export default router;