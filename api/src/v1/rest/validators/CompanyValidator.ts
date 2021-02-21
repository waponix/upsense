import {Company} from '../../shared/entities/Company';
import {getRepository} from 'typeorm';
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

export const companyCreateValidation = (data: Partial<Company>) => {
    return new Validator(data, {
        name: 'required|string|max:150|company_name_available',
    });
};

export const companyUpdateValidation = (data: Partial<Company>, company: Company) => {
    return new Validator(data, {
        name: 'string|max:150|company_name_available',
    })
}
