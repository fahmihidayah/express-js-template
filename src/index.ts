import 'reflect-metadata';
// import app from './app';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
// import hpp from 'hpp';
import * as bodyParser from 'body-parser';
import "./controllers/users.controller";
import "./controllers/roles.controller";
import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from './config';
import cookieParser from 'cookie-parser';
import { server } from './modules';
import { ErrorFunctionMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


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
  initializeSwagger(app)
});

server.setErrorConfig((app) => {
  app.use(ErrorFunctionMiddleware)
})

function initializeSwagger(app : express.Application) {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Example docs',
      },
    },
    apis: ['swagger.yaml'],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

export let app = server.build();
app.listen(PORT, () => {

  logger.info(`=================================`);
  logger.info(`======= ENV: ${NODE_ENV} =======`);
  logger.info(`🚀 App listening on the port ${PORT}`);
  logger.info(`=================================`);
});



// app.listen(port, () => {
//   /* eslint-disable no-console */
//   console.log(`Listening: http://localhost:${port}`);
//   /* eslint-enable no-console */
// });
