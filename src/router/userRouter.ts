import * as userController from '../controller/user';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { checkValid, usernameContraints, passwordContraints, emailContraints } from '../model/validateModel';
import { ErrorMessages, ResponseMessage } from '../util/utilities';
import _ from 'lodash';
const validUserData = (req: Request, res: Response, next: NextFunction) => {
    try {
        let errors = _.concat(
            checkValid(req.body.username || '', usernameContraints),
            checkValid(req.body.password || '', passwordContraints),
            checkValid(req.body.email || '', emailContraints),
        );
        if (errors.length === 0) return next();
        else res.status(200).json(new ResponseMessage(errors));
    } catch (error) {
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
};

const router = express.Router();

router.get('/', userController.getUserInfo);
router.post('/login', validUserData, userController.login);
router.post('/register', validUserData, userController.register);
router.all('/logout', userController.logout);
router.get('/likes', userController.getUserLikes);
router.get('/:userId', userController.getUserInfo);
router.get('/:userId/likes', userController.getUserLikes);
router.post('/:userId/follow', userController.setUserFollow);
router.post('/:userId/unfollow', userController.setUserUnfollow);

export default router;