#!/usr/bin/env node

const config = require('./smqConfig');
const QueueConsumer = require('./consumer');

const consumer = new QueueConsumer(config, { messageConsumeTimeout: 2000 });
consumer.run();
