import Ship from "./ship";

export default class Gameboard {
  //missed shots coordinate are not zero indexed
  missedShots = [];
  coordinates = {};
  constructor() {}
  clearGameboard() {
    //this is not pure
    this.coordinates = this.#clear(this.coordinates);
    this.missedShots = this.#clear(this.missedShots);
  }
  #clear(value) {
    let returnVal;
    switch (value.constructor.name) {
      case "Array":
        returnVal = [];
        break;
      case "Object":
        returnVal = {};
        break;
      default:
        throw new TypeError("Value should be an array or an object literal");
    }
    return returnVal;
  }
  getCoordinate(column, row) {
    if (this.#isCoordinateValid(column, row) === false)
      throw new Error("Invalid coordinate");
    const coordinate = column + row.toString();
    return this.coordinates[coordinate];
  }
  setCoordinate(column, row, value) {
    if (this.#isCoordinateValid(column, row) === false)
      throw new Error("Invalid coordinate");
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
    const copyMissedShots = [...this.missedShots];
    copyMissedShots.push([column, row]);
    return copyMissedShots;
  }
  #isCoordinateValid(column, row) {
    //use regex here
    if (
      this.#isRowValid(row) === true &&
      this.#isColumnValid(column) === true
    ) {
      return true;
    }
    return false;
  }
  #isRowValid(row) {
    if (row > 10 || row < 1) {
      return false;
    }
    return true;
  }
  #isColumnValid(column) {
    const regex = /[A-J]/;
    return regex.test(column);
  }
}
