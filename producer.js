const config = require('./smqConfig');
const Producer = require('redis-smq').Producer;



module.exports = async ctx => {
  const producer = new Producer(process.env.QUEUE_NAME, config);
  const produce = function(){
    return new Promise((resolve, reject) => {
      producer.produce.apply(producer, [...arguments, (err) => {
        if(err) reject(err);
        else resolve();
      }])
    });
  }

  const {time, latitude, longitude } = ctx.request.body;
  try {
    await produce({
        time,
        latitude,
        longitude,
    })
    ctx.status = 201;
  } catch (e) {
    console.error(e);
    ctx.status = 500;
    ctx.body = {
      error: e.messages
    }
  }
}
