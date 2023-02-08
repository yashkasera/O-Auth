require('dotenv').config();
require('./util/connectMongoose');
require('./util/firebase');

const express = require('express');
const app = express();
const cors = require('cors');
const {NotFoundError} = require("./util/error");
const apiRouter = require('./routes/app');
const webRouter = require('./routes/web');
require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRouter);

app.use('/', webRouter);


module.exports = app;