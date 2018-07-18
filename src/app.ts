import express, { json, urlencoded, Request, Response, NextFunction } from "express";
import path, { join } from "path";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import passport from 'passport';
import mongoose from 'mongoose';
import mongo from 'connect-mongo';
import * as config from './config/userConfig';
import apiRouter from './router/apiRouter'
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
app.use(express.static(path.join(__dirname, '../public')));

app.all('/', (req: Request, res: Response, next: NextFunction) => {
  // serve static index.html
  res.sendFile(join(__dirname, '../public/index.html'));
});

// router
app.use('/api', apiRouter)

// redirect
// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   res.redirect(`http://${req.hostname}:${process.env.PORT}`);
// });
// error handler
app.all('*', function (req, res) {
  res.sendFile(join(__dirname, '../public/index.html'));
});

export default app;
