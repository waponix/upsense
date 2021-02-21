import {Admin} from '../../shared/entities/Admin';
import {getRepository} from 'typeorm';
const Validator = require('validatorjs');

Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(Admin);
    const admin: Admin | undefined = await adminRepository.findOne({where: {username}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Username has already been taken');
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

export const adminCreateValidation = (data: any) => {
    return new Validator(data, {
        username: 'required|string|max:50|username_available',
        password: 'required|string|max:100',
        firstName: 'required|string|max:50',
        lastName: 'required|string|max:50',
        email: 'required|email|email_available',
        mobileNumber: 'max:20',
        picture: "string|url|max:255"
    });
};

export const adminUpdateValidation = (data: any, admin: Admin) => {
    let fields = {
        password: 'string|max:100',
        firstName: 'string|max:50',
        lastName: 'string|max:50',
        email: 'email|email_available',
        mobileNumber: 'max:20',
        picture: "string|url|max:255"
    };

    if (data.email && data.email === admin.email) {
        // only validate email if it is not the same with old email
        fields.email.replace('|email_available', '');
    }

    return new Validator(data, fields);
};
