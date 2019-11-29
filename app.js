const express = require('express');
const body = require('body-parser');
const indexRoust = require('./routes/index')
const cors = require("cors");
const session = require("express-session");
var app = express();


app.use(body.urlencoded({																	
    extended: false
}));
var server = express();
//6:配置跨域  允许程序列表
//  http://127.0.0.1:8080
//  http://localhost:8080
server.use(cors({
   origin:["http://127.0.0.1:8080","http://123.57.142.33:8080"],
   credentials:true  //每次请求验证
}))
//7:配置session环境
server.use(session({
   secret:"128位安全字符串",
   resave:true,         //请求更新数据 
   saveUninitialized:true//保存初始数据
}));
app.listen(8080);
app.use(express.static('./public'));
app.use("/index", indexRoust)