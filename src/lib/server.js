'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import motorcycleRoutes from '../route/motorcycle-route';
import loggerMiddleware from './loggerMiddleware';
import errorMiddleware from './errorMiddleware';

const app = express();
let server = null;
//---------------------------------------------------------------------------------
app.use(loggerMiddleware);
app.use(motorcycleRoutes);
// Vinicio - manking sure I return a 404 status if I don't have a matching route
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
app.use(errorMiddleware);
//---------------------------------------------------------------------------------

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      // Vinicio - once I'm here, I know that mongoose is connected
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
