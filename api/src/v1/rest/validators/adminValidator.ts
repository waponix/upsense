import Admin from '../entities/admin';
import {getRepository} from 'typeorm';
const Validator = require('validatorjs');

// Always validate from the request.body root level
export default (data: any) => {
    Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
        let adminRepository = getRepository(Admin);
        let admin: Admin | undefined = await adminRepository.findOne({username});

        if (!admin) {
            passes();
        } else {
            passes(false, 'Username has already been taken');
        }
    });

    let validation =  new Validator(data, {
        admin: {
            username: 'required|string|max:50|username_available',
            password: 'required|string|max:100',
            firstName: 'required|string|max:50',
            lastName: 'required|string|max:50',
            email: 'required|email',
            mobileNumber: 'required|max:20'
        }
    });

    return validation;
};
