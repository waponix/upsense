import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    type: ['required', 'string', 'in:sms,email,push_notifications'],
    triggerTime: ['number', 'min:0', 'max:2147483647'],
    repeatTime: ['number', 'min:0', 'max:2147483647'],
    maxRepeat: ['number', 'min:0', 'max:32767']
});

export const notificationSettingCreateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

export const notificationSettingUpdateValidation = (data: any) => {
    rules.fields
        .removeRuleFromTypeField('required');

    return new Validator(data, rules.fields);
};
