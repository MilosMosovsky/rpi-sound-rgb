import path from 'path';
import argv from 'argv';

import * as Utils from './lib/Utils';
import RGBControl from './lib/RGBControl';
import SettingsBin from './lib/Settings';
import AudioAnalyser from './lib/Analyser';
import QueueBin from './lib/Queue';

const RGB = new RGBControl(27, 22, 23);
const Settings = new SettingsBin(path.join(process.cwd(), 'settings.json'));
const Analyser = new AudioAnalyser(Settings.analyserSettings());

RGB.setColor(255, 255, 255);

Analyser.open(path.join(process.cwd(), 'output.raw'));

let lastValue = 0;
setInterval(() => {
  const sampleSize = 8;
  const timeShift = sampleSize/2;
  const sample = Analyser.queue().pull(sampleSize);
  let end = sampleSize - timeShift;
  if ( end >= sample.length) {
    end = sample.length -1;
  }

  const historyData = sample.slice(0, end);
  const freshData = sample.slice(end);

  const result = Analyser.analyzeData(freshData, historyData);

  Utils.fadeNumberTo(lastValue, result, (val) => {
    RGB.setIntensity(val);
    console.log(val);
  });

  lastValue = result;

}, 500);
