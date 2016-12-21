class Queue {
  constructor(options = {}) {
    this.queue = [];
    this._options = {
      length: options.length || 150
    }
  }

  push(data) {
    this.queue.push(data);

    if (this.queue.length > this._options.length) {
      this.queue.splice(0, 1);
    }
  }

  pull(number = 0) {
    if(number > 0 ) {
      return this.queue.slice(0 - number);
    } else {
      return this.queue;
    }

  }
}

export default Queue;
