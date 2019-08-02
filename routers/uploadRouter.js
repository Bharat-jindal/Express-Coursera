const express=require('express');
const bodyParser =require('body-parser');
const multer=require('multer');

const authenticate=require('../authenticate');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const imageFileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can only upload only image files',false))
    }
    cb(null,true);
}

const uploadAsMulter=multer({storage,fileFilter:imageFileFilter});

const uploadRouter=express.Router();

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not allowed in /imageUpload');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin(),uploadAsMulter.single('imageFile'),(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not allowed in /imageUpload')
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode=403;
    res.end('DELETE operation not allowed in /imageUpload')
});

module.exports=uploadRouter