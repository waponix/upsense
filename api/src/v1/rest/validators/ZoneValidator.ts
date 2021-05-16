import {Zone} from "../../shared/entities/Zone";
import {Company} from "../../shared/entities/Company";
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    name: ['required', 'max:150', 'zone_name_available'],
    company: ['required', 'integer', 'company_exist']
});

export const zoneCreateValidation = (data: Partial<Zone>) => {
    return new Validator(data, rules.fields);
};

export const zoneUpdateValidation = (data: Partial<Zone>, zone: Zone) => {
    rules.removeField('company');
    rules.fields.removeRuleFromNameField(['required']);
    if (data.name === zone.name) {
        rules.fields.removeRuleFromNameField(['zone_name_available']);
    }

    return new Validator(data, rules.fields);
}

Validator.registerAsync('zone_name_available', async function (name: string, attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);
    //@ts-ignore
    const companyId = parseInt(this.validator.input.company);
    const zone: Zone | undefined = await zoneRepository.findOne({where: {name, company: companyId}});

    if (!zone) {
        passes();
    } else {
        passes(false, 'Zone name already exist');
    }
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
