import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    username: ['string', 'max:50', 'username_available'],
    password: ['required', 'string', 'max:100'],
    firstName: ['required', 'string', 'max:50'],
    lastName: ['string', 'max:50'],
    email: ['required', 'email', 'email_available'],
    mobile: ['required', 'max:20', 'mobile_available'],
    picture: ['string', 'url', 'max:255'],
    company: ['required', 'integer', 'company_exist'],
    zones: ['array', 'zone_exist']
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
        .removeField('company')
        .removeField('zones')
        .addField('addZones', ['array', 'zone_exist'])
        .addField('removeZones', ['array', 'zone_exist']);

    rules.fields.removeRuleFromPasswordField('required');

    data.company = user.company.id;

    if (data.email === user.email) {
        // only validate email if it is not the same with old email
        rules.fields.removeRuleFromEmailField('email_available');
    }

    if (data.mobile === user.mobile) {
        // only validate mobile if it is not the same with old mobile
        rules.fields.removeRuleFromMobileField('mobile_available');
    }

    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_exist', async function (zones: any[], attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);
    //@ts-ignore
    const companyId = parseInt(this.validator.input.company);

    for (let zoneId of zones) {
        const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId), company: companyId}});

        if (!zone) {
            passes(false, `There is no zone with id ${zoneId}`);
        }
    }

    passes();
});

Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
    const userRepository = getRepository(User);
    const manager: User | undefined = await userRepository.findOne({where: {username}});

    if (!manager) {
        passes();
    } else {
        passes(false, 'Username has already been taken');
    }
});

Validator.registerAsync('mobile_available', async (mobile: string, attribute: any, req: any, passes: any) => {
    const userRepository = getRepository(User);
    const manager: User | undefined = await userRepository.findOne({where: {mobile}});

    if (!manager) {
        passes();
    } else {
        passes(false, 'Mobile is already connected to an existing account');
    }
});

Validator.registerAsync('email_available', async (email: string, attribute: any, req: any, passes: any) => {
    const userRepository = getRepository(User);
    const admin: User | undefined = await userRepository.findOne({where: {email}});

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
