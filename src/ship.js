export default class Ship {
  timesHit = 0;
  constructor(length) {
    this.length = length;
    this.sunk = false;
    Object.seal(this);
  }
  hit() {
    this.timesHit++;
  }
  isSunk() {
    return this.timesHit >= this.length;
  }
}
