export class MovingAverageQueue {
  constructor(size) {
    this.values = [];
    this.size = size;
  }

  addValue(value) {
    this.values.push(value);

    if (this.values.length > this.size) {
      this.values.shift();
    }
  }

  getAverage() {
    return (() =>
      this.values.reduce((a, b) => a + b, 0) / this.values.length)();
  }

  isFull() {
    return this.values.length >= this.size;
  }
}
