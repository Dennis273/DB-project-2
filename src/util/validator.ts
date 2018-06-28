import { Request, Response, NextFunction } from 'express';
import { checkValid } from '../model/validateModel';
import { ErrorMessages, ResponseMessage } from '../util/utilities';
import { IConstraint } from '../model/validateModel';
import _ from 'lodash';


interface ICheck {
    target: string,
    constraints: IConstraint[],
}
export let validateData = (checks: ICheck[]) => {
    return function (req: Request, res: Response, next: NextFunction) {
        let errors: ErrorMessages[] = [];
        checks.forEach(check => {
            let value = req.body[check.target] || req.params[check.target];
            if (value) _.concat(errors, checkValid(value, check.constraints));
        });
        if (_.isEmpty(errors)) return next();
        else return res.status(200).json(new ResponseMessage(errors));
    }
}
export let check = (target: string, constraints: IConstraint[]): ICheck => {
    return {
        target,
        constraints,
    }
}