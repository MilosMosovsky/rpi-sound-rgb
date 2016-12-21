import fs from 'fs';

class Settings {
  constructor(fileName) {
    const file = fs.readFileSync(fileName, 'utf-8');
    const settings = JSON.parse(file);

    this._config = {
      timeAverage: settings.timeAverage,
      smoothness: settings.smoothness,
      agressivity: settings.agressivity,
      samples: 1024 * settings.agressivity,
      binCount: (1024 * settings.agressivity) / 2,
      bufferSize: settings.bufferSize
    }
  }

  analyserSettings() {
    return {
      fftSize: this._config.samples,
      frequencyBinCount: this._config.binCount,
      bufferSize: this._config.bufferSize,
      binCount: this._config.binCount,
      smoothingTimeConstant: 0,
      minDecibels: -100,
      maxDecibels: -50
    }
  }
}

export default Settings;
