const express=require('express');
const bodyParser=require('body-parser');
const User=require('../models/users');
const passport=require('passport');
const authenticate=require('../authenticate')

var router=express.Router();
router.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    res.send('respond with a response')
});

router.post('/signup',(req,res,next)=>{
    User.register(new User({username:req.body.username}),
    req.body.password,(err,user)=>{
        if(err){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({Error:err})
        }
        else{
            if(req.body.firstname){
                user.firstname=req.body.firstname
            }
            if(req.body.lastname){
                user.lastname=req.body.lastname
            }
            user.save((err,user)=>{
                if(err){
                    res.statusCode=500;
                    res.setHeader('Content-Type','application/json');
                    res.json({Error:err});
                    return                    
                }
                passport.authenticate('local')(req,res,()=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true,status:'Authenticated',user})
                })                
            })
            
            
        }
    })
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
    const Token=authenticate.getToken({_id:req.user._id})
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({success:true,token:Token,status:'You are successfully logged in'})
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