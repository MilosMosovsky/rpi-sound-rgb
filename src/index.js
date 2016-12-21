import * as Utils from './lib/Utils';
import RGBControl from './lib/RGBControl';

const RGB = new RGBControl(27, 22, 23);
RGB.setColor(255, 255, 255);

Utils.fadeNumberTo(0, 100, (number) => {
  console.log(number);
  RGB.setIntensity(number/ 100);
}, 5000);
