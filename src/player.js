import Gameboard from "./gameboard";

export default class Player {
  #type = null;
  name;
  gameboard;
  constructor(type, name) {
    this.gameboard = new Gameboard();
    this.name = name;
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
