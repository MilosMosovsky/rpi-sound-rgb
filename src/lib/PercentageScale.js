class PercentageScale {
  constructor(memory) {
    this.memoryCount = memory;
    this.memory = [0];
  }

  push(data) {
    this.memory.push(data);

    if (this.memory.length > this.memoryCount) {
      this.memory.splice(0, 1);
    }
  }

  getPercentage(input) {
    const maxInMemory = Math.max(...this.memory);
    const minInMemory = Math.min(...this.memory);

    const workingRange = maxInMemory - minInMemory;
    const fromStart = input - minInMemory;

    const scale = fromStart / workingRange;

    this.push(input);
    if(scale > 1 ) {
      return 1;
    }

    if ( isNaN(scale) || scale <= 0 ) {
      return 0.05;
    }
    return scale;
  }
}

export default PercentageScale;
