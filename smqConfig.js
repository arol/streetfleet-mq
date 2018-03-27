'use strict';

module.exports = {
  namespace: 'default',
  redis: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    connect_timeout: 3600000,
  },
  log: {
    enabled: 0,
    options: {
      level: 'debug',
    },
  }
};
