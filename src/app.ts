
import express from 'express';
import cors from 'cors';
import http from "http";
import cookieParser from 'cookie-parser';
import passport from "passport";
import morgan from 'morgan';

import trainer from './presentation/routes/trainer.gateway';
import admin from './presentation/routes/admin.gateway';
import user from './presentation/routes/user.gateway';

import logger from './logger/index';
import config from 'config';
import { errorHandler } from 'presentation/middleware/errorHandler';

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}));

app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");
app.use(passport.initialize());


app.use('/trainer', trainer);
app.use('/user', user);
app.use('/admin', admin);


app.use(errorHandler);

export default server;