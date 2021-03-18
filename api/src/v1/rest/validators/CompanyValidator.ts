import {Company} from '../../shared/entities/Company';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
const Validator = require('validatorjs');

Validator.registerAsync('company_name_available', async (name: string, attribute: any, req: any, passes: any) => {
    let companyRepository = getRepository(Company);
    let company: Company | undefined = await companyRepository.findOne({name});

    if (!company) {
        passes();
    } else {
        passes(false, 'Company name already exist');
    }
});

const rules = new ValidationRules({
    name: ['required', 'max:150', 'company_name_available']
});

export const companyCreateValidation = (data: Partial<Company>) => {
    return new Validator(data, rules.fields);
};

export const companyUpdateValidation = (data: Partial<Company>, company: Company) => {
    if (data.name === company.name) {
        rules.fields.removeRuleFromNameField(['required', 'company_name_available']);
    }

    return new Validator(data, rules.fields);
}
