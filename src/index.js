import path from 'path';

import SettingsBin from './lib/Settings';
import AudioAnalyser from './lib/Analyser';

const Settings = new SettingsBin(path.join(process.cwd(), 'settings.json'));
const Analyser = new AudioAnalyser(Settings.analyserSettings());

Analyser.open(Settings.config().inputFile);

//
// let lastValue = 0;
// function runEvents() {
//   const sampleSize = 8;
//   const timeShift = sampleSize / 2;
//   const sample = Analyser.queue().pull(sampleSize);
//   let end = sampleSize - timeShift;
//   if (end >= sample.length) {
//     end = sample.length - 1;
//   }
//
//   const historyData = sample.slice(0, end);
//   const freshData = sample.slice(end);
//
//   const result = Analyser.analyzeData(freshData, historyData);
//
//   Utils.fadeNumberTo(lastValue, result, (val) => {
//     //RGB.setIntensity(val);
//     // console.log(val);
//   });
//
//   // console.log(result);
// }
//
// // let lastRun = 0;
// // for(;;) {
// //   const now = new Date().getTime();
// //   if((now - lastRun) > 10) {
// //     runEvents();
// //     lastRun = now;
// //   }
// // }
