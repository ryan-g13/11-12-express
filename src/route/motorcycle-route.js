'use strict';

/* this is the old style
import express from 'express';
const Router = express.Router;
 */

import { Router } from 'express';
import bodyParser from 'body-parser';
import Motorcycle from '../model/motorcycle';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const motorcycleRouter = new Router();
// const noteRouter = module.exports = new Router(); // ES5

motorcycleRouter.post('/api/motorcycle', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Motorcycle(request.body).save()
    .then((motorcycle) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(motorcycle);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});


motorcycleRouter.get('/api/motorcycles/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Motorcycle.findById(request.params.id)
    .then((motorcycle) => { // Vinicio - note found OR note not found, but the id looks good
      if (!motorcycle) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!motorcycle)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(motorcycle);
    })
    .catch((error) => { // Vinicio - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

motorcycleRouter.delete('/api/motorcycles/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a delete');

  return Motorcycle.findByIdAndRemove(request.params.id)
    .then((motorcycle) => {
      if (!motorcycle) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - !motorcycle at ID');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - 204 code for successful delete');
      return response.sendStatus(204);
    })
    .catch((error) => {
      
    })
})

export default motorcycleRouter;
