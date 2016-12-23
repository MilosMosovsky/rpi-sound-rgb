import AudioAnalyser from 'audio-analyser';
import Speaker from 'audio-speaker';
import fs from 'fs';
import argv from 'argv';
import QueueBin from './Queue'
import * as Utils from './Utils';


argv.option([{ name: 'play', type: 'boolean' } ]);
const args = argv.run();

class Analyser {
  constructor(options) {
    this._analyser = new AudioAnalyser(options);
    this._options = options;

    this._queue = new QueueBin();
    this.run();
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

  run() {
    const options = this._options;
    const queue = this._queue;
    const resampler = this.resample;
    let lastTime = new Date().getTime();

    this._analyser.on('data', function(data) {
      const now = new Date().getTime();
      console.log(now-lastTime);
      const bin = new Uint8Array(options.binCount);
      const binTimeData = new Uint8Array(options.binCount);
      const floatBin = new Float32Array(options.binCount);
      this.getFloatFrequencyData(floatBin);
      this.getByteTimeDomainData(binTimeData);
      this.getByteFrequencyData(bin);

      const resampledData = resampler(bin);
      console.log('data recieved');
      queue.push(bin, now-lastTime);
      lastTime = now;
    });
  }


}

export default Analyser;
