import {Admin} from "../../v1/shared/entities/Admin";
import {getRepository, Repository} from "typeorm";
const {BasicStrategy} = require('passport-http');
const {AuthTokenStrategy} = require('passport-auth-token');
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

passport.use(new AuthTokenStrategy(
   async (token: any, done: any) => {
       console.log(token);
   }
));

export default passport;
