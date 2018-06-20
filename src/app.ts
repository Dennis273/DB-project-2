import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import passport from 'passport';
import mongoose from 'mongoose';
import * as userController from './controller/user';
import router from './router';
import mongo from 'connect-mongo';
import * as config from './config/userConfig';

const MongoStore = mongo(session);
var app = express();
mongoose.connect(config.MONGODB_URI);

const db = mongoose.connection;
db.on('open', () => {
  console.log('Database connected!');
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
  store: new MongoStore({
    url: config.MONGODB_URI,
    autoReconnect: true
  }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(json());
app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'static  ')));


app.all('*', router);

// error handler
app.all('*', function (req, res) {
  res.status(404).end();
});

export default app;
