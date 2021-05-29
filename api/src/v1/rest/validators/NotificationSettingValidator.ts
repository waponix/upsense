import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    // type: ['required', 'string', 'in:sms,email,push_notifications'],
    sendEmail: ['boolean'],
    sendSms: ['boolean'],
    triggerTime: ['numeric', 'min:0', 'max:2147483647'],
    repeatTime: ['numeric', 'min:0', 'max:2147483647'],
    maxRepeat: ['numeric', 'min:0', 'max:32767']
});

// export const notificationSettingCreateValidation = (data: any) => {
//     return new Validator(data, rules.fields);
// };

export const notificationSettingUpdateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};
