import AudioAnalyser from 'audio-analyser';
import Speaker from 'audio-speaker';
import fs from 'fs';
import argv from 'argv';
import QueueBin from './Queue'
import * as Utils from './Utils';
import socket from 'socket.io-client';
import RGBClient from './RGBClient'

argv.option([{ name: 'play', type: 'boolean' } ]);
const args = argv.run();

const RGBclient = new RGBClient('http://xifi.local:10000');
RGBclient.setColor(255, 0, 255);

class Analyser {
  constructor(options) {
    this._analyser = new AudioAnalyser(options);
    this._options = options;
    this.socket = socket('http://localhost:9002');

    this._queue = new QueueBin();
    this.run();

    this.buffer = [];
  }

  queue() {
    return this._queue;
  }

  open(fifoFile) {
    console.log('Opening: ', fifoFile);
    this._stream = fs.createReadStream(fifoFile);
    this._stream.pipe(this._analyser);

    if(args.options.play) {
      this.play();
    }

    return this._stream;
  }

  play() {
    console.log('Playing file ...');
    this._stream.pipe(Speaker())
  }

  resample(data, chunks = 20) {
    let resampled = [];
    let chunk = 0;
    const sampleSize = Math.floor(data.length / chunks);

    while(chunk < data.length) {
      resampled.push(data[chunk]);
      chunk += sampleSize;
    }

    return resampled;
  }

  pushBuffer(data) {
    this.buffer.push(data);

    if(this.buffer.length > 5) {
      this.buffer.splice(0,1);
    }

    return this.buffer;
  }
  run() {
    const options = this._options;
    const queue = this._queue;
    const socket = this.socket;
    const resampler = this.resample;
    let lastTime = new Date().getTime();

    const that = this;
    this._analyser.on('data', function(data) {
      const now = new Date().getTime();
      const bin = new Uint8Array(options.binCount);
      const binTimeData = new Uint8Array(options.binCount);
      const floatBin = new Float32Array(options.binCount);
      this.getFloatFrequencyData(floatBin);
      this.getByteTimeDomainData(binTimeData);
      this.getByteFrequencyData(bin);

      const resampledData = resampler(bin);
      // console.log('Pushing data');
      // // queue.push(bin, now-lastTime);
      // // lastTime = now;
      //
      // socket.emit('sync:data', {
      //   payload: bin,
      // });
      const avg = Utils.averageArray(bin);
      const buffer = that.pushBuffer(bin);

      let maximum = 0;

      buffer.map((b) => {
        const localMaximum = Utils.averageArray(b);

        if(localMaximum > maximum) {
          maximum = localMaximum;
        }
      });


      RGBclient.setColor(255, 0, 255);
      const intensity = Math.round(avg / maximum);
      RGBclient.setIntensity(intensity);
    });
  }


}

export default Analyser;
