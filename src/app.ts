
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from "http";
import cookieParser from 'cookie-parser';
import passport from "passport";
import morgan from 'morgan';

import trainer from './Presentation/routes/trainer.gateway';
import admin from './Presentation/routes/admin.gateway';
import user from './Presentation/routes/user.gateway';

import logger from 'utils/logger';
import config from 'config';
import { errorHandler } from 'Presentation/middleware/errorHandler';

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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());


app.use('/trainer', trainer);
app.use('/user', user);
app.use('/admin', admin);


app.use(errorHandler);

export default server;