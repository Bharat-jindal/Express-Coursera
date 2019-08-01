const express=require('express');
const bodyParser =require('body-parser');
const mongoose=require('mongoose');;

const leaderRouter=express.Router();

const Leaders=require('../models/leaders');

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then(leaders=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post((req,res,next)=>{
    Leaders.create(req.body)
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('put operationnot supported')
})
.delete((req,res,next)=>{
    Leaders.deleteMany({})
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>{next(err)})
    .catch(err=>next(err))
});

leaderRouter.route('/:promotionId')
    .get((req,res,next)=>{
        Leaders.findById(req.params.promotionId)
            .then(leader=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(leader)
            },err=>{next(err)})
            .catch(err=>next(err))
})
.post((req,res,next)=>{
    res.end('Not supported this post operation ')
})
.put((req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.promotionId,{
        $set:req.body
    },{new:true})
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete((req,res,next)=>{
    Leaders.findByIdAndDelete(req.params.promotionId)
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>{next(err)})
    .catch(err=>next(err))
})


module.exports=leaderRouter;