import 'reflect-metadata';
// import app from './app';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
// import hpp from 'hpp';
import * as bodyParser from 'body-parser';
import "./controllers/users.controller";
import "./controllers/post.controller"
import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { CREDENTIALS, LOG_FORMAT, ORIGIN } from './config';
import cookieParser from 'cookie-parser';
import { server } from './modules';
import { ErrorFunctionMiddleware } from './middlewares/error.middleware';


server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // app.use(morgan(LOG_FORMAT, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  // app.use(hpp());
  app.use(helmet());
  // app.use(compression());
  // app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
});

server.setErrorConfig((app) => {
  app.use(ErrorFunctionMiddleware)
})

let app = server.build();
app.listen(3000);


// app.listen(port, () => {
//   /* eslint-disable no-console */
//   console.log(`Listening: http://localhost:${port}`);
//   /* eslint-enable no-console */
// });
