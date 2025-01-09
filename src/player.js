import Gameboard from "./gameboard";

export default class Player {
  #type = null;
  gameboard;
  constructor(type) {
    this.gameboard = new Gameboard();
    if (type) this.type = type;
  }
  set type(playerType) {
    if (playerType !== "real" && playerType !== "computer")
      throw new TypeError("Playertype should be computer or real");
    this.#type = playerType;
  }
  get type() {
    return this.#type;
  }
}
