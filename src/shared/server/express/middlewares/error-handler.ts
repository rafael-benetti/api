import 'express-async-errors';

import AppError from '@shared/errors/app-error';
import { ErrorRequestHandler } from 'express';
import { CelebrateError } from 'celebrate';
import appConfig from '@config/app';
import logger from '@config/logger';

const errorHandler: ErrorRequestHandler = async (error, req, res, _) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  if (error instanceof CelebrateError) {
    const object: Record<string, unknown> = {};

    error.details.forEach((value, key) => {
      object[key] = value;
    });

    return res.status(400).json({
      errorCode: 'VALIDATION_ERROR',
      details: object,
    });
  }

  if (appConfig.environment === 'production') {
    return res.status(500).json({
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error has occurred',
    });
  }

  logger.error(error);

  return res.status(500).json({ error: error.toString() });
};

export default errorHandler;
