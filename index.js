require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const router = require('koa-router')();
const smq = require('./producer');
const bodyparser = require('koa-body');

const config = require('./smqConfig');
const QueueConsumer = require('./consumer');

const consumer = new QueueConsumer(config, { messageConsumeTimeout: 2000 });
consumer.run();

router.post('/', smq);

app
  .use(logger())
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);

// const monitorServer = require('redis-smq').monitor(config);

// monitorServer.listen(() => {
//     console.log('Monitor server is running...');
// });
