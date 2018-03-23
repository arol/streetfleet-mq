require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const router = require('koa-router')();
const smq = require('./producer');
const bodyparser = require('koa-body');

router.post('/', smq);

app
  .use(logger())
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);

const config = require('./smqConfig');
const monitorServer = require('redis-smq').monitor(config);

monitorServer.listen(() => {
    console.log('Monitor server is running...');
});
