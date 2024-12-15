export default class Ship {
  #timesHit = 0;
  #sunk = false;
  constructor(length) {
    if (length === undefined || Number.isInteger(length) === false)
      throw new Error("Lenght must be provided");
    this.length = length;
  }
  hit() {
    this.#timesHit++;
  }
  isSunk() {
    return this.#timesHit >= this.length;
  }
}
