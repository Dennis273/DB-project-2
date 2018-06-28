import * as userController from '../controller/user';
import express from 'express';
import { usernameContraints, passwordContraints, emailContraints } from '../model/validateModel';
import { isAuthenticated } from '../config/passport';
import { check, validateData } from '../util/validator';

const router = express.Router();

router.get('/', userController.getUserInfo);
router.post('/login', validateData([
    check('username', usernameContraints),
    check('email', emailContraints),
    check('password', passwordContraints),
]), userController.login);
router.post('/register', validateData([
    check('username', usernameContraints),
    check('email', emailContraints),
    check('password', passwordContraints),
]), userController.register);
router.all('/logout', userController.logout);
router.get('/likes', isAuthenticated, userController.getUserLikes);
router.get('/:userId', userController.getUserInfo);
router.get('/:userId/likes', userController.getUserLikes);
router.post('/:userId/follow', isAuthenticated, userController.setUserFollow);
router.post('/:userId/unfollow', isAuthenticated, userController.setUserUnfollow);
router.post('/:userId/message/send', isAuthenticated, userController.sendMessage);
// router.get('/:userId/message', isAuthenticated, undefined);
export default router;