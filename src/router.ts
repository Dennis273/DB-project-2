import * as userController from './controller/user';
import * as workController from './controller/work';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.all('/logout', userController.logout);

router.get('/work/:id', workController.getWorkById);
router.get('/work/all', workController.getAllWork);

// require user login
router.all('*', (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) res.status(403).end();
    else next();
});


router.post('/work/new', workController.add);
router.put('/work/update', workController.updateById);
router.delete('/work/delete', workController.deleteById);

export default router;