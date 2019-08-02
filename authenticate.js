const passport=require('passport');
const LocalStreategy=require('passport-local').Strategy;

const User=require('./models/users');
const JwtStreategy=require('passport-jwt').Strategy;
const extractJWT=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');

const config= require('./config')

exports.local=passport.use((new LocalStreategy(User.authenticate())));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=(user)=>{
    return jwt.sign(user,config["secret-key"],
    {expiresIn:3600})
}

var opts={};

opts.jwtFromRequest=extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config["secret-key"];

exports.jwtPassport=passport.use(new JwtStreategy(opts,
    (jwt_payload,done) => {
        console.log("JWT Payload:",jwt_payload);

        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false)
            }
            else if(user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    }));

    exports.verifyUser=passport.authenticate('jwt',{session:false})