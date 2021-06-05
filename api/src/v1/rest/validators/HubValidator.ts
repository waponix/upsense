import {User} from '../../shared/entities/User';
import {getRepository, Repository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
import {Zone} from "../../shared/entities/Zone";
import {Hub} from "../../shared/entities/Hub";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    serial: ['required', 'string', 'serial_not_exit'],
    zone: ['integer', 'zone_not_exist']
});

export const hubCreateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

export const hubUpdateValidation = (data: any) => {
    rules.removeField('serial');
    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_not_exist', async function (zones: any[], attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);

    for (let zoneId of zones) {
        const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId)}});

        if (!zone) {
            passes(false, `There is no zone with id ${zoneId}`);
        }
    }

    passes();
});

Validator.registerAsync('serial_not_exist', async function (serial: string, attribute: any, req: any, passes: any) {
    const hubRepository: Repository<Hub> | undefined = getRepository(Hub);

    const hub: Hub | undefined = await hubRepository.findOne({where: {serial}});

    if (hub !== undefined) {
        passes(false, `Hub with serial '${serial}' already exist`)
    }

    passes();
});
