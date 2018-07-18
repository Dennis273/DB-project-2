import * as workController from '../controller/work';
import { isAuthenticated } from '../config/passport';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import * as config from '../config/userConfig';
const upload = multer({
    fileFilter: (req, file, cb) => {
        const fileTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp'];
        if (fileTypes.includes(file.mimetype)) cb(null, true);
        else cb(null, false);
    },
    storage: multer.diskStorage({
        filename: (req: Request, file, cb) => {
            cb(null, req.params.workId);
        },
        destination: config.UPLOAD_PATH + '/work/cover',
    })
});
const router = express.Router();

router.get('/', workController.getAllWorks);
router.post('/create', isAuthenticated, workController.createWork);
router.get('/search', workController.search);
router.put('/:workId/update', isAuthenticated, workController.updateById);
router.delete('/:workId/delete', isAuthenticated, workController.deleteById);
// 
router.get('/:workId/cover', workController.getCover);
router.post('/:workId/cover', isAuthenticated, upload.single('cover'), workController.uploadCover);
router.post('/:workId/like', isAuthenticated, workController.like);
router.post('/:workId/unlike', isAuthenticated, workController.unlike);
// metadatas
router.post('/:workId/meta', isAuthenticated, workController.createMetadata);
router.put('/:workId/meta', isAuthenticated, workController.updateMetadata);
router.delete('/:workId/meta', isAuthenticated, workController.removeMetadata);
router.get('/:workId/meta', workController.getMetaDatas);

router.get('/:workId', workController.getWorkById);
router.post('/:workId/comment/new', isAuthenticated, workController.addComment);
router.get('/:workId/comment', workController.getComments);

router.post('/:workId/watched', isAuthenticated, workController.setWatched);
router.post('/:workId/rate', isAuthenticated, workController.setRate);
export default router;