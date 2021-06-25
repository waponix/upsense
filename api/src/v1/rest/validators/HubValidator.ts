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
    company: ['required', 'numeric', 'company_exist'],
    zone: ['numeric', 'zone_exist']
});

export const hubCreateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

export const hubUpdateValidation = (data: any) => {
    rules
        .removeField('serial');
    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_exist', async function (zoneId: any, attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);

    const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId)}});

    if (zone === undefined) {
        passes(false, `There is no zone with id ${zoneId}`);
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

Validator.registerAsync('company_exist', async (companyId: number, attribute: any, req: any, passes: any) => {
    const companyRepository = getRepository(Company);
    const company: Company | undefined = await companyRepository.findOne({where: {id: companyId}});

    if (!company) {
        passes(false, 'Company does not exist');
    } else {
        passes();
    }
});
