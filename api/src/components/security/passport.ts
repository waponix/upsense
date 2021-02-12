import {Admin} from "../../v1/entities/Admin";
import {getRepository, Repository} from "typeorm";
const {BasicStrategy} = require('passport-http');
let passport = require('passport');

// digest authentication for requesting jwt token
passport.use(new BasicStrategy(
    async (username: any, password: any, done: any) => {
        let adminRepository: Repository<Admin> = getRepository(Admin);

        let admin: Admin | undefined = await adminRepository.findOne({username});

        if (!admin || !admin.validatePassword(password)) {
            return done(null, false);
        }

        return done(null, admin);
    }
));

export default passport;
