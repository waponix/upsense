import {Admin} from "../../v1/shared/entities/Admin";
import {getRepository, Repository} from "typeorm";
import {jwtConfig} from "../../config";
const {BasicStrategy} = require('passport-http');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
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

const JwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret,
    issuer: jwtConfig.issuer,
    algorithms: [jwtConfig.algorithm]
};

passport.use(new JwtStrategy(
    JwtStrategyOptions,
    async (token: any, done: any) => {
        const {user: {id}} = token;

        const adminRepo: Repository<Admin> = getRepository(Admin);
        const admin: Admin | undefined = await adminRepo.findOne({where: {id}});

        if (admin) {
            return done(null, admin);
        }

        done(null, false);
    }
));

export default passport;
