import express from 'express';
import userRouter from './userRouter';
import workRouter from './workRouter';
import articleRouter from './articleRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/work', workRouter);
router.use('/article', articleRouter);

export default router;