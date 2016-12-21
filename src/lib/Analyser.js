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

  resample(data, chunks = 50) {
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

    this._analyser.on('data', function() {
      const bin = new Uint8Array(options.binCount);
      this.getByteFrequencyData(bin);

      const resampledData = resampler(bin);

      queue.push(resampledData);
    });
  }

  analyzeData(data, history) {
    const currentData = data.map(Utils.averageArray);
    const historyData = history.map(Utils.averageArray);

    // console.log(currentData);
    // console.log(historyData);
    const avgCurrent = Utils.averageArray(currentData);
    const avgHistory = Utils.averageArray(historyData);

    // console.log('Avg in current is', avgCurrent);
    // console.log('Avg in history', avgHistory);
    const percentage = avgCurrent / avgHistory;
    return percentage < 1 ? percentage : 1;
  }
}

export default Analyser;
