import {User} from '../../shared/entities/User';
import {getRepository, Repository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
import {Zone} from "../../shared/entities/Zone";
import {Hub} from "../../shared/entities/Hub";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    name: ['required', 'string'],
    serial: ['required', 'string', 'serial_not_exist'],
    zone: ['integer', 'zone_exist']
});

export const hubCreateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

export const hubUpdateValidation = (data: any) => {
    rules
        .removeField('name')
        .removeField('serial');
    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_exist', async function (zones: any[], attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);

    for (let zoneId of zones) {
        const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId)}});

        if (zone === undefined) {
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
