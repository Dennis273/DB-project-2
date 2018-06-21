import express, { json, urlencoded } from "express";
import { Request, Response, NextFunction } from 'express';
import { join } from "path";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import passport from 'passport';
import mongoose from 'mongoose';
import mongo from 'connect-mongo';
import * as config from './config/userConfig';
import userRouter from "./router/userRouter";
import workRouter from "./router/workRouter";

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
app.use(express.static(join(__dirname, 'static')));

app.all('/', (req: Request, res: Response, next: NextFunction) => {
  // serve static index.html
  res.sendFile(join(__dirname, '../public/index.html'));
});

// router
app.use('/user', userRouter);
app.use('/work', workRouter);

// redirect
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.redirect(`http://${req.hostname}:${process.env.PORT}`);
});
// error handler
app.all('*', function (req, res) {
  res.status(404).end();
});

export default app;
