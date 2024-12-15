export default class Ship {
  #timesHit = 0;
  #sunk = false;
  constructor(length) {
    this.length = length;
  }
  hit() {
    this.#timesHit++;
  }
  isSunk() {
    return this.#timesHit >= this.length;
  }
}
