import {User as Admin} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    username: ['string', 'max:50', 'username_available'],
    password: ['required', 'string', 'max:100'],
    firstName: ['required', 'string', 'max:50'],
    lastName: ['string', 'max:50'],
    email: ['required', 'email', 'email_available'],
    mobile: ['required', 'max:20', 'mobile_available'],
    picture: ['string', 'url', 'max:255']
});

export const adminCreateValidation = (data: any) => {
    if (!data.username) {
        rules.fields.removeRuleFromUsernameField('username_available')
    }
    return new Validator(data, rules.fields);
};

export const adminUpdateValidation = (data: any, admin: Admin) => {
    rules.removeField('username');

    rules.fields.removeRuleFromPasswordField('required');

    if (data.email === admin.email) {
        // only validate email if it is not the same with old email
        rules.fields.removeRuleFromEmailField('email_available');
    }

    if (data.mobile === admin.mobile) {
        // only validate mobile if it is not the same with old mobile
        rules.fields.removeRuleFromMobileField('mobile_available');
    }

    return new Validator(data, rules.fields);
};

Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(Admin);
    const admin: Admin | undefined = await adminRepository.findOne({where: {username}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Username has already been taken');
    }
});

Validator.registerAsync('mobile_available', async (mobile: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(Admin);
    const admin: Admin | undefined = await adminRepository.findOne({where: {mobile}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Mobile is already connected to an existing account');
    }
});

Validator.registerAsync('email_available', async (email: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(Admin);
    const admin: Admin | undefined = await adminRepository.findOne({where: {email}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Email is already in use');
    }
});
