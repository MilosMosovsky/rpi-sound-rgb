import socket from 'socket.io-client';
import * as Utils from './Utils';

class Queue {
  constructor(options = {}) {
    this.socket = socket('http://localhost:9002');
    this.queue = [];
    this._options = {
      length: options.length || 150
    }
  }

  push(input, delay) {
    this.publishInput(input, delay);
    const channels = 6;
    const chunk = Math.floor(input.length / channels);

    const data = Utils.sumArray(input.slice(chunk, chunk*2));
    this.queue.push(data);
    let output = ''
    input.slice(chunk,chunk*2).map((item) => {
      output += item + '-'
    })

    if (this.queue.length > this._options.length) {
      this.queue.splice(0, 1);
    }

    this.publish();
  }

  pull(number = 0) {
    if(number > 0 ) {
      return this.queue.slice(0 - number);
    } else {
      return this.queue;
    }
  }

  publish() {
    this.socket.emit('sync:queue', this.queue)
  }

  publishInput(data, delay) {
    this.socket.emit('sync:data', {
      payload: data,
      delay
    });
  }

  sync(data) {
    // console.log(`Queue synchronized: ${data.length} items`);
    this.queue = data;
  }
}

export default Queue;
