import validator from 'validator';
import { ErrorMessages } from '../util/utilities';

export interface IConstraint {
    valid: Function,
    args: any[],
    error: ErrorMessages
};
export type checkValidFunction = (value: string, cons: IConstraint[]) => ErrorMessages[];
export let checkValid: checkValidFunction = (value, cons) => {
    if (value == undefined) return [];
    let errors: ErrorMessages[] = [];
    cons.forEach(c => {
        if (!c.valid.apply(this, [value].concat(c.args))) errors.push(c.error);
    });
    return errors;
};

// data constraints
export const passwordContraints: IConstraint[] = [
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
export const usernameContraints: IConstraint[] = [
    {
        valid: validator.isLength,
        args: [8, 18],
        error: ErrorMessages.invalidUsername_Length,
    },
]
export const emailContraints: IConstraint[] = [
    {
        valid: validator.isEmail,
        args: [],
        error: ErrorMessages.invalidEmailFormat,
    },
]



