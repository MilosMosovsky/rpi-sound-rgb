import blaster from 'pi-blaster.js';

class RGBControl {
  constructor(red, green, blue) {
    this.redPin = red;
    this.greenPin = green;
    this.bluePin = blue;

    this.redAmount = 0;
    this.blueAmount = 0;
    this.greenAmount = 0;

    this.strength = 1;
    this.intensity = 0;

    this.run();
  }

  setColor(red, green, blue) {
    this.redAmount = red / 255;
    this.greenAmount = green / 255;
    this.blueAmount = blue / 255;

    this.run();
  }

  setStrength(strength) {
    this.strength = strength;
  }

  setIntensity(intensity) {
    this.intensity = intensity;

    this.run();
  }

  run() {
    const intensity = this.intensity * this.strength;

    blaster.setPwm(this.redPin, this.redAmount * intensity);
    blaster.setPwm(this.greenPin, this.greenAmount * intensity);
    blaster.setPwm(this.bluePin, this.blueAmount * intensity)
  }
}

export default RGBControl;
