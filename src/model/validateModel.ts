import { Request, Response } from 'express';
import validator from 'validator';
import { ErrorMessages } from '../util/errorMessage';
import { check } from 'express-validator/check';

export type constraints = {
    valid: Function,
    args: any[],
    error: ErrorMessages
}[];
export let checkValid = (value: string, cons: constraints): ErrorMessages[] => {
    let errors: ErrorMessages[] = [];
    cons.forEach(c => {
        if (!c.valid.apply(this, [value].concat(c.args))) errors.push(c.error);
    });
    return errors;
};

// data constraints
export const passwordContraints: constraints = [
    {
        valid: validator.isLength,
        args: [8, 20],
        error: ErrorMessages.invalidPassword_Length,
    },
    {
        valid: validator.matches,
        args: [/\W/],
        error: ErrorMessages.invalidPassword_Symbol,
    },
    {
        valid: validator.isAscii,
        args: [],
        error: ErrorMessages.invalidPassword_IllegaSymbol,
    }
];
export const usernameContraints: constraints = [
    {
        valid: validator.isLength,
        args: [8, 18],
        error: ErrorMessages.invalidUsername_Length,
    },
]
export const emailContraints: constraints = [
    {
        valid: validator.isEmail,
        args: [],
        error: ErrorMessages.invalidEmailFormat,
    },
]



