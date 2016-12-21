import fs from 'fs';
import Analyser from 'audio-analyser';
import average from 'average';
import Speaker from 'audio-speaker';
import blaster from 'pi-blaster.js';
import throttle from 'lodash.throttle';

import settings from '../settings.json'

const timeAverage = settings.timeAverage;
const smoothness = settings.smoothness;
const agressivity = settings.agressivity;
const samples = 1024 * agressivity;
const binCount = samples/2;

var analyser = new Analyser({
  fftSize: samples,
  frequencyBinCount: binCount,
  bufferSize: settings.bufferSize,
  smoothingTimeConstant: 0,
  minDecibels: -100,
  maxDecibels: -50
});

console.log(`Reading: ${settings.inputFile}`);
const stream = fs.createReadStream(settings.inputFile);
stream.pipe(analyser);

if(settings.test) {
  stream.pipe(Speaker())
}

let lastData = [250];

function adjustPercentage(data) {
  lastData.push(data);

  if(lastData.length > timeAverage) {
    lastData = lastData.splice(0,1);
  }
}

function getPercentage(data) {
  const max = Math.max(...lastData);
  const percentage = (data / max) * 100;

  if(percentage > 100) {
    return 100;
  }
  if(percentage <= 0) {
    return 0;
  }

  return percentage;
}

function resample(data, chunks) {
  chunks = chunks || smoothness;

  let resampled = [];
  let chunk = 0;
  const sampleSize = data.length / (data.length/ chunks);

  while(chunk < data.length) {
    resampled.push(data[chunk]);
    chunk += sampleSize;
  }

  resampled.map((data) => {
    if(data > 0 ){
      const percentage = getPercentage(data);
      // piblaster.setPwm(27, percentage );
      throttle(() => {
        putPercentage(percentage)
      }, 1000)()
    }
  });
}

analyser.on('data', function(d) {
  const bin = new Uint8Array(binCount);
  this.getByteFrequencyData(bin);

  adjustPercentage( average(bin) );
  resample(bin);
});


function putPercentage(data) {
  //console.log(data)
}

let lastValue = 0;
function fadeTo(amount)  {
  let starting = lastValue;

  const portion = Math.abs(amount - lastValue) / 500;

  setTimeout(() => {
    console.log(starting);
    lastValue += starting;
  }, 50)
}

setInterval(() => {
  const value = (Math.random() * 100) + 1;
  fadeTo(value);
  lastValue = value;

}, 500);
