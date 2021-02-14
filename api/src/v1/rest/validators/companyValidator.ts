import {Company} from '../../shared/entities/Company';
import {getRepository} from 'typeorm';
const Validator = require('validatorjs');

// Always validate from the request.body root level
export default (data: any) => {
    Validator.registerAsync('company_name_available', async (name: string, attribute: any, req: any, passes: any) => {
        let companyRepository = getRepository(Company);
        let company: Company | undefined = await companyRepository.findOne({name});

        if (!company) {
            passes();
        } else {
            passes(false, 'Company name already exist');
        }
    });

    let validation =  new Validator(data, {
        company: {
            name: 'required|string|max:150|company_name_available',
        }
    });

    return validation;
};
