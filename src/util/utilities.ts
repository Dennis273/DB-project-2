
export enum ErrorMessages {
    unknownError = '未知错误',
    illegalOperation = '非法操作',
    usernameExist = '用户名已存在',
    emailExist = '电子邮箱已存在',
    wrongPasswor = '密码错误',
    userNotExist = '用户不存在',
    unAuthenticated = '未授权访问',
    workNotExist = '作品不存在',
    workNameExist = '作品名称已存在',
    invalidEmailFormat = '邮箱格式有误',
    // username format
    invalidUsername_Length = '用户名长度为8~20字符',
    // password format
    invalidPassword_Length = '密码长度为8~20字符',
    invalidPassword_Symbol = '密码需包含至少一个特殊字符(数字，字母，下划线以外)',
    invalidPassword_IllegaSymbol = '密码不能包含非法字符',
}
export class ResponseMessage {
    status: boolean;
    errorMessages: string[] = [];
    constructor(errors: ErrorMessages[] = [], data: object = {}) {
        this.status = errors.length === 0;
        errors.forEach((error) => {
            this.errorMessages.push(error);
        });
        Object.assign(this, data);
    };
}