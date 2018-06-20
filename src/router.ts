import * as userController from './controller/user';
import * as workController from './controller/work';
import { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from './config/passport';
import express from 'express';
import { check, validationResult } from 'express-validator/check';
import * as validator from './validator';

let validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array(),
        });
    } else next();
};

const router = express.Router();

router.post('/login', [
    validator.checkUsername,
    validator.checkPassword,
], validate ,userController.login);

router.post('/register', [
    validator.checkEmail,
    validator.checkUsername,
    validator.checkPassword,
], validate, userController.register);
router.all('/logout', userController.logout);

router.get('/work/:id', workController.getWorkById);
router.get('/work/all', workController.getAllWork);

// require user login
router.post('/work/new', isAuthenticated, workController.add);
router.put('/work/update', isAuthenticated, workController.updateById);
router.delete('/work/delete', isAuthenticated, workController.deleteById);



export default router;