import http from 'http';
import socket from 'socket.io';
import QueueBin from './lib/Queue';
import RGBClient from './lib/RGBClient'
import * as Utils from './lib/Utils';
import PercentageScale from './lib/PercentageScale';

const server = http.createServer();
const io = socket(server);
const queue = new QueueBin();
const RGBclient = new RGBClient('http://xifi.local:10000');
const percentage = new PercentageScale(10);
RGBclient.setColor(255, 0, 255);


let lastData = [];

function bufferMaximum() {
  let maximum = 0;

  lastData.forEach((data) => {
    const max = Utils.averageArray(data);
    if(max>maximum) {
      maximum = max;
    }
  })

  return maximum;
}
io.on('connection', function(client){
  // console.log('Connected slave', client.id);

  // client.on('sync:queue', function(data){
  //   queue.sync(data);
  //   console.log(data.length);
  // });


  client.on('sync:data', function(data){
    // console.log('Forward data to the clients with delay', data.delay);
    // console.log(data)
    const avg = Utils.averageArray(data.payload);

    if(lastData.length > 100) {
      lastData.splice(0, 1);
    }

    // let maximums = [];
    // lastData.map((arr) => {
    //   maximums.push(Utils.averageArray(arr));
    // });

    // let intensity = ( avg / Utils.averageArray(maximums)).toFixed(2);

    // console.log('buffer maximum', bufferMaximum());
    // console.log('now', avg);

    let intensity = (avg / bufferMaximum()).toFixed(2)
    if ( intensity > 1) {
      intensity = 1;
    }

    if (intensity < 0) {
      intensity = 0;
    }
    console.log(intensity);

    RGBclient.setColor(255, 0, 255);
    RGBclient.setIntensity(intensity);

    lastData.push(data.payload);

    console.log(data.payload.length);
    io.emit('visualize', data.payload);
  });



});


server.listen(9002);

//
// let lastRun = 0;
//
// setInterval(() => {
//   const now = new Date().getTime();
//   if((now - lastRun) > 100) {
//     digest();
//     lastRun = now;
//   }
// })
//
//
// let lastValue = 0;
// function digest() {
//   const sample = queue.pull(1);
//   const result = Utils.averageArray(sample);
//   const scale = percentage.getPercentage(result);
//   //
//   // console.log(scale);
//   client.setIntensity(scale);
//   //   if(lastValue < scale) {
//   //     while(lastValue < scale) {
//   //       client.setIntensity(lastValue);
//   //       lastValue += 0.1;
//   //     }
//   //   } else {
//   //     while(lastValue > scale) {
//   //       client.setIntensity(lastValue);
//   //       lastValue -= 0.1;
//   //     }
//   //   }
//   //   Utils.fadeNumberTo(lastValue, scale, (percentage) => {
//   //     // console.log(percentage);
//   //     client.setIntensity(percentage);
//   // }, 80, 5);
//
//   lastValue = scale;
// }
