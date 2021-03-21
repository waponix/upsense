import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    username: ['string', 'max:50', 'username_available'],
    password: ['required', 'string', 'max:100'],
    firstName: ['required', 'string', 'max:50'],
    lastName: ['string', 'max:50'],
    email: ['required', 'email', 'email_available'],
    mobileNumber: ['max:20'],
    picture: ['string', 'url', 'max:255'],
    company: ['required', 'integer', 'company_exist']
});

export const userCreateValidation = (data: any) => {
    if (!data.username) {
        rules.fields.removeRuleFromUsernameField('username_available')
    }
    return new Validator(data, rules.fields);
};

export const userUpdateValidation = (data: any, user: User) => {
    rules
        .removeField('username')
        .removeField('company');
    rules.fields
        .removeRuleFromPasswordField('required')
        .removeRuleFromFirstNameField('required')
        .removeRuleFromEmailField('required');

    if (data.email && data.email === user.email) {
        // only validate email if it is not the same with old email
        rules.fields.removeRuleFromEmailField('email_available');
    }

    return new Validator(data, rules.fields);
};

Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
    const managerRepository = getRepository(User);
    const manager: User | undefined = await managerRepository.findOne({where: {username}});

    if (!manager) {
        passes();
    } else {
        passes(false, 'Username has already been taken');
    }
});

Validator.registerAsync('email_available', async (email: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(User);
    const admin: User | undefined = await adminRepository.findOne({where: {email}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Email is already in use');
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
