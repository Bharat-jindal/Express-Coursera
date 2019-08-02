const express=require('express');
const http=require('http');
const morgan=require('morgan');
const bodyParser= require('body-parser');
const cookieParser=require('cookie-parser')
const session =require('express-session');
const FileStore=require('session-file-store')(session);
const passport=require('passport');
const authenticate=require('./authenticate');
const config=require('./config')

const dishRouter=require('./routers/dishRouter');
const promptionRouter=require('./routers/promotionRouter');
const leadersRouter=require('./routers/leadersRouter');
const userRouter=require('./routers/usersRouter');
const uploadRouter=require('./routers/uploadRouter');

const mongoose=require('mongoose');
mongoose.Promise=require('bluebird');

const url=config.mongoUrl;

const connect=mongoose.connect(url,{useFindAndModify:true,useNewUrlParser:true});

connect.then(()=>{
    console.log('Connected correctly to the servver');
})
.catch(err=>console.log(err))

const app=express();
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cookieParser('123-bjsdjd9980hdsjk-dkjnds878956'))


app.use(passport.initialize());

app.use('/users',userRouter);

app.use(express.static(__dirname+'/public'));

app.use('/dishes',dishRouter);
app.use('/promotions',promptionRouter);
app.use('/leaders',leadersRouter);
app.use('/imageUpload',uploadRouter);

const port=3000;
const hostname='localhost';

app.all('/dishes',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next()
});
app.all('/leaders',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next()
});
app.all('/promotions',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next()
})


app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>Index html</h1><p>You are in index from js</p></body></html>')
})

const server=http.createServer(app)

server.listen(port,hostname,()=>{
    console.log('Server  started on port 3000');
})