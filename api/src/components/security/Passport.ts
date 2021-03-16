import {User} from "../../v1/shared/entities/User";
import {getRepository, Repository} from "typeorm";
import {jwtConfig} from "../../config";
const {BasicStrategy} = require('passport-http');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
let passport = require('passport');

// digest authentication for requesting jwt token
passport.use(new BasicStrategy(
    async (username: any, password: any, done: any) => {
        let userRepository: Repository<User> = getRepository(User);

        // try to look for user via username
        let user: User | undefined = await userRepository.findOne({where: {username}});

        if (user === undefined) { // if no record found via username, try with email
            user = await userRepository.findOne({where: {email: username}});
        }

        if (!user || !user.validatePassword(password)) {
            return done(null, false);
        }

        return done(null, user);
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

        const userRepo: Repository<User> = getRepository(User);
        const user: User | undefined = await userRepo.findOne({where: {id}});

        if (user) {
            return done(null, user);
        }

        done(null, false);
    }
));

export default passport;
