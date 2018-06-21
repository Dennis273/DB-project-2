import * as workController from '../controller/work';
import { isAuthenticated } from '../config/passport';
import express from 'express';


const router = express.Router();

router.get('/', workController.getAllWork);
router.post('/create', isAuthenticated, workController.create);
router.put('/:workId/update', isAuthenticated, workController.updateById);
router.delete('/:workId/delete', isAuthenticated, workController.deleteById);
router.post('/:workId/like', isAuthenticated, workController.like);
router.post('/:workId/unlike', isAuthenticated, workController.unlike);
router.get('/:workId', workController.getWorkById);



export default router;