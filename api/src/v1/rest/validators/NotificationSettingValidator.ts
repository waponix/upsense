import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    type: ['required', 'string', 'enum:sms,email,push_notifications'],
    triggerTime: ['number', 'min:0', 'max:2147483647'],
    repeatTime: ['number', 'min:0', 'max:2147483647'],
    maxRepeat: ['number', 'min:0', 'max:32767']
});

export const notificationSettingCreateValidation = (data: any) => {
    if (!data.username) {
        rules.fields.removeRuleFromUsernameField('username_available')
    }
    return new Validator(data, rules.fields);
};

export const notificationSettingUpdateValidation = (data: any) => {
    rules
        .removeField('zones')
        /*.addField('addZones', ['array', 'zone_exist'])
        .addField('removeZones', ['array', 'zone_exist'])*/;
    rules.fields
        .removeRuleFromTypeField('required');

    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_exist', async function (zoneId: number, attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);

    //@ts-ignore
    const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId)}});

    if (!zone) {
        passes(false, `There is no zone with id ${zoneId}`);
    }

    passes();
});
