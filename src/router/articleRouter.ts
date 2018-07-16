import * as articleController from '../controller/article';
import express from 'express';
import { isAuthenticated } from '../config/passport';

const router = express.Router();

router.post('/', isAuthenticated, articleController.newArticle);
router.get('/', articleController.getAllArticleId);
router.get('/my', isAuthenticated, articleController.getOwnArticleId);
router.get('/:articleId', articleController.getArticleById);
router.delete('/:articleId', isAuthenticated, articleController.deleteArticleById);

export default router;