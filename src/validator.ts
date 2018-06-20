import { Request, Response } from 'express';
import validator from 'validator';
import { check } from 'express-validator/check';
export let checkUsername = check('username')
    .isLength({min: 6, max: 20}).withMessage('Username should be 6 to 20 character long')
    .matches(/^\w+$/).withMessage('Username should only contain alphanumeric characters and underline')

export let checkPassword = check('password')
    .isLength({min: 8, max: 20}).withMessage('Password should be 8 to 20 character long')
    .matches(/\W/).withMessage('Should contain at least one non alphanumeric char ');

export let checkEmail = check('email')
    .isEmail().withMessage('Should be email');