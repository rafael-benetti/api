import debug from 'debug';

const logger = {
  info: debug('api:info'),
  error: debug('api:error'),
};

export default logger;
