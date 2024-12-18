import Ship from "./ship";

export default class Gameboard {
  //missed shots coordinate are not zero indexed
  missedShots = [];
  coordinates = {};
  constructor() {}
  clearGameboard() {
    //this is not pure
    this.coordinates = {};
    this.#clearMissedShots();
  }
  #clearMissedShots() {
    this.missedShots = [];
  }
  getCoordinate(column, row) {
    const coordinate = column + row.toString();
    return this.coordinates[coordinate];
  }
  setCoordinate(column, row, value) {
    const newCoordinates = structuredClone(this.coordinates);
    const coordinate = column + row.toString();
    newCoordinates[coordinate] = value;
    this.coordinates = newCoordinates;
  }
  //it actually states that placeShip should make a new instance of ship, but how is the player going to decide which ship it is?
  placeShip(column, row, length) {
    const ship = new Ship(length);
    this.setCoordinate(column, row, ship);
  }
  receiveAttack(column, row) {
    const ship = this.getCoordinate(column, row);
    if (ship instanceof Ship) {
      ship.hit();
      return true;
    }
    this.missedShots = this.#recordMiss(column, row);
    return false;
  }
  #recordMiss(column, row) {
    this.setCoordinate(column, row, "miss");
    const copyMissedShots = [...this.missedShots];
    copyMissedShots.push([column, row]);
    return copyMissedShots;
  }
}
