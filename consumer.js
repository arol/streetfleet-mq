'use strict';

require('dotenv').config();

const redisSMQ = require('redis-smq');

require('./db');
const Trip = require('./models/trip');
const Company = require('./models/company');

const Consumer = redisSMQ.Consumer;

const timeThreshold = 1000*60*15;

const distanceCoordinates = (lat1, lon1, lat2, lon2) => {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344 // KM
  return dist
}

class QueueConsumer extends Consumer {

  /**
   *
   * @param message
   * @param cb
   */
  async consume(message, cb) {
    const updateTotalTimeKm = async () => {
      const trips = await Trip.find({mac_address: message.mac_address});
      if (trips.length) {
        const lastTrip = trips.slice(-1)[0];
        const distance = lastTrip.distance;
        const time = lastTrip.end_time - lastTrip.start_time;
        const company = await Company.findOne({fleet: {$elemMatch: {mac_address: message.mac_address}}});
        const vehicles = company.fleet.filter(vehicle => vehicle.mac_address === message.mac_address);
        vehicles[0].total_driving_time += time;
        vehicles[0].total_km_driven += distance;
        await company.save();
      }
    }
    const locationTime = new Date(message.time);
    const fifteenMinAgo = new Date(locationTime-timeThreshold);
    let trip = await Trip.findOne({
      end_time: {
        $gte: fifteenMinAgo
      },
      mac_address: message.mac_address
    });

    if(!trip) {
      updateTotalTimeKm();
      trip = new Trip({
        mac_address: message.mac_address,
        start_time: message.time,
        distance: 0,
        locations: []
      });
    }

    trip.end_time = message.time;
    const { mac_address, ...location } = message;

    if(trip.locations.length > 0) {
      const lastLocation = trip.locations.slice(-1)[0];
      trip.distance += distanceCoordinates(
        lastLocation.latitude,
        lastLocation.longitude,
        location.latitude,
        location.longitude,
      )
    }

    trip.locations.push(location);
    await trip.save();

    cb();
  }
}

QueueConsumer.queueName = process.env.QUEUE_NAME;

module.exports = QueueConsumer;
