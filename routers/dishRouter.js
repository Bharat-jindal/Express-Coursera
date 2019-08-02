const express=require('express');
const bodyParser =require('body-parser');
const mongoose=require('mongoose');

const Dishes=require('../models/dishes');
const authenticate=require('../authenticate');
const dishRouter=express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.get((req,res,next)=>{
    Dishes.find({})
    .populate('comments.authur')
    .then(dishes=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.create(req.body)
    .then(dish=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode=403;
    res.end('put operationnot supported')
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Dishes.deleteMany({})
    .then(resp=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },err=>{next(err)})
    .catch(err=>next(err))
});

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.authur')
    .then(dishes=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.end('Not supported this post operation ')
})
.put(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then(dish=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then(dish=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },err=>{next(err)})
    .catch(err=>next(err))
});

dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.authur')
    .then(dish=>{
        if(dish!==null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments)
        }
        else{
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!==null){
            req.body.authur=req.user._id
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish.comments)
            })
        }
        else{
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!==null){
            res.statusCode=403;
            res.end('Put operation not supported')
        }
        else{
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!==null){
            for(let i=(dish.comments.length-1);i>=0;i--){
                if(dish.comments[i].authur.toString()===req.user._id.toString()){
                    console.log(dish.comments[i].authur,req.user._id)
                    console.log(dish.comments[i].authur.toString(),req.user._id.toString())
                    dish.comments.id(dish.comments[i]._id).remove();
                }
            }
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            })
        }
        else{
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.authur')
    .then(dish=>{
        if(dish!==null && dish.comments.id(req.params.commentId)!==null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments.id(req.params.commentId))
        }
        else if(dish==null){
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        else{
            var err =new Error(`Comment with id ${req.param.commentId} does not found in this dish`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!==null && dish.comments.id(req.params.commentId)!==null){
            res.end('The request does not support post opertion')
        }
        else if(dish==null){
            var err =new Error(`Dish with id ${req.param.dishId} does not found`);
            err.status=404;
            return next(err)
        }
        else{
            var err =new Error(`Comment with id ${req.param.commentId} does not found in this dish`);
            err.status=404;
            return next(err)
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish.comments.id(req.param.commentId).authur.toString()===req.user._id.toString()){
            if(dish!==null && dish.comments.id(req.params.commentId)!==null){
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating=req.body.rating;
                }if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment=req.body.comment;
                }
                dish.save()
                .then(dish=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(dish.comments.id(req.params.commentId))
                })
                
            }
            else if(dish==null){
                var err =new Error(`Dish with id ${req.param.dishId} does not found`);
                err.status=404;
                return next(err)
            }
            else{
                var err =new Error(`Comment with id ${req.param.commentId} does not found in this dish`);
                err.status=404;
                return next(err)
            }
        }
        else{
            res.status(403).send('You are not Authorized to do this operation')
        }
        
    },err=>{next(err)})
    .catch(err=>next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish.comments.id(req.params.commentId).authur.toString()===req.user._id.toString()){
            if(dish!==null && dish.comments.id(req.params.commentId)!==null){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(dish)
                })
            }
            else if (dish==null){
                var err =new Error(`Dish with id ${req.param.dishId} does not found`);
                err.status=404;
                return next(err)
            }
            else{
                var err =new Error(`Comment with id ${req.param.commentId} does not found in this dish`);
                err.status=404;
                return next(err)
            }
        }
        else{
            res.status(403).send('You are not Authorized to do this operation')
        }
        
        
    },err=>{next(err)})
    .catch(err=>next(err))
})


module.exports=dishRouter;