const express=require('express')
//const db =require('./config/db')

const http=require('http')
const path = require('path');
const routes = require('./routes/app');
var bodyParser = require('body-parser');

global.ResponseController=require('./controller/responsecontroller')

const app=express();
const server = http.createServer(app)
global.db  = require('./config/db');
global.db = db.connect(server);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/',routes);





