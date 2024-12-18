import Ship from "./ship";

export default class Gameboard {
  //missed shots coordinate are not zero indexed
  missedShots = [];
  coordinates = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
  };
  constructor() {
    for (const [column, row] of Object.entries(this.coordinates)) {
      for (let i = 0; i < 10; i++) {
        row.push(null);
      }
    }
  }
  clearGameboard() {
    //this is not pure
    for (const key of Object.keys(this.coordinates)) {
      this.coordinates[key].fill(null);
    }
  }
  getCoordinate(column, row) {
    return this.coordinates[column][row - 1];
  }
  setCoordinate(column, row, value) {
    const newCoordinates = structuredClone(this.coordinates);
    newCoordinates[column][row - 1] = value;
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
    this.setCoordinate(column, row, "miss");
    this.missedShots.push([column, row]);
    return false;
  }
}
