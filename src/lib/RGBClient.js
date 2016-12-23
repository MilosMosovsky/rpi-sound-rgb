import socket from 'socket.io-client';

class RGBClient {
  constructor(url) {
    this.client = socket(url);
  }

  setColor(red, green, blue) {
    this.client.emit('rgb:color', {
      red,
      green,
      blue
    })
  }

  setIntensity(intensity) {
    this.client.emit('rgb:intensity', {
      intensity
    })
  }
}

export default RGBClient;
