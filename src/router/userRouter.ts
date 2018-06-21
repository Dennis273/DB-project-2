import * as userController from '../controller/user';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { checkValid, usernameContraints, passwordContraints, emailContraints } from '../model/validateModel';
import { ErrorMessages, ResponseMessage } from '../util/errorMessage';

const validUserData = (req: Request, res: Response, next: NextFunction) => {
    const errors: ErrorMessages[] = [].concat.apply([], [
        checkValid(req.body.username, usernameContraints),
        checkValid(req.body.password, passwordContraints),
        checkValid(req.body.email, emailContraints),
    ]);
    if (errors.length === 0) return next();
    else return res.status(200).json(new ResponseMessage(errors));
};

const router = express.Router();

router.post('/login', validUserData, userController.login);

router.post('/register', validUserData, userController.register);

router.all('/logout', userController.logout);

export default router;