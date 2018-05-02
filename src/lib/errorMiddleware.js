'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR__MIDDLEWARE__');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.INFO, `Responding with a ${error.status} code and the message is ${error.message}`);
    return response.sendStatus(error.status);
  }
  // catching an error of not the type above
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'Responding with a 404 error code');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'Responding with a 409 error code');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'Responding with a 401 error code');
    return response.sendStatus(401);
  }
  // last catch all for errors, error 500
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  logger.log(logger.ERROR, error);
  return response.sendStatus(500);
};
