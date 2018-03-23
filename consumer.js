#!/usr/bin/env node

'use strict';

require('dotenv').config();

const redisSMQ = require('redis-smq');

const Consumer = redisSMQ.Consumer;

class QueueConsumer extends Consumer {

  /**
   *
   * @param message
   * @param cb
   */
  consume(message, cb) {
    console.log(`Got message to consume: `, JSON.stringify(message));

    cb();
  }
}

QueueConsumer.queueName = process.env.QUEUE_NAME;

const config = require('./smqConfig');

const consumer = new QueueConsumer(config, { messageConsumeTimeout: 2000 });
consumer.run();

// module.exports = QueueConsumer;
