import {Admin} from '../../shared/entities/Admin';
import {getRepository} from 'typeorm';
const Validator = require('validatorjs');

// Always validate from the request.body root level
export default (data: any) => {
    Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
        let adminRepository = getRepository(Admin);
        let admin: Admin | undefined = await adminRepository.findOne({where: {username}});

        if (!admin) {
            passes();
        } else {
            passes(false, 'Username has already been taken');
        }
    });

    Validator.registerAsync('email_available', async (email: string, attribute: any, req: any, passes: any) => {
        let adminRepository = getRepository(Admin);
        let admin: Admin | undefined = await adminRepository.findOne({where: {email}});

        if (!admin) {
            passes();
        } else {
            passes(false, 'Email is already in use');
        }
    });

    let validation =  new Validator(data, {
        admin: {
            username: 'required|string|max:50|username_available',
            password: 'required|string|max:100',
            firstName: 'required|string|max:50',
            lastName: 'required|string|max:50',
            email: 'required|email|email_available',
            mobileNumber: 'required|max:20'
        }
    });

    return validation;
};
