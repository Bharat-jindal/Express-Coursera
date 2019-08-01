const express=require('express');
const bodyParser=require('body-parser');
const User=require('../models/users');

var router=express.Router();
router.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    res.send('respond with a response')
});

router.post('/signup',(req,res,next)=>{
    User.findOne({username:req.body.username})
    .then(user=>{
        if(user!==null){
            var err=new Error(`user with username ${req.body.username} already exists`);
            err.status=403;
            next(err);
        }else{
            return User.create({
                username:req.body.username,
                password:req.body.password
            })
            .then(user=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({status:'Registration Successful',user:user})
            },err=>next(err))
            .catch(err=>next(err))
        }
    })
    .catch(err=>next(err))
})

router.post('/login',(req,res,next)=>{
    if(!req.session.user){
        const authHeader=req.headers.authorization;
     
        if(!authHeader){
            var err = new Error('You are not authenticated authHandler not found');
            res.statusCode=401;
            res.setHeader('WWW-Authenticate','Basic');
            return next(err)
        }
    
        var auth=new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
        var [username,password]=auth;
        
        User.findOne({username:username})
        .then(user=>{
            if(username===user.username && password===user.password){
                req.session.user='authenticated'
                res.statusCode=200;
                res.setHeader('C0ntent-Type','text/plain');
                res.end('Tou are authenticated')
            }
            else if(password!==user.password){
                var err = new Error('Your password is incorrect');
                res.statusCode=403;
                res.setHeader('WWW-Authenticate','Basic');
                return next(err)
            }
            else if(user===null){
                var err = new Error('Please Enter username');
                res.statusCode=401;
                res.setHeader('WWW-Authenticate','Basic');
                return next(err)
            }
            else{
                var err = new Error('You are not authenticated passsword or sername not match');
                res.statusCode=401;
                res.setHeader('WWW-Authenticate','Basic');
                return next(err)
            }
        })
        .catch(err=>next(err))
     }
     else{
        res.statusCode=200;
        res.setHeader('C0ntent-Type','text/plain');
        res.end('You are already authenticated')
     }
});

router.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/')
    }
    else{
        const err=new Error('You are not login');
        err.status=403;
        next(err)
    }
})

module.exports=router