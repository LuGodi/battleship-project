import Ship from "./ship";

export default class Gameboard {
  missedShots = [];
  columns = {
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
    for (const [column, row] of Object.entries(this.columns)) {
      for (let i = 0; i < 10; i++) {
        row.push(null);
      }
    }
  }
  getCoordinate(column, row) {
    return this.columns[column][row - 1];
  }
  setCoordinate(column, row, value) {
    this.columns[column][row - 1] = value;
  }
  //it actually states that placeShip should make a new instance of ship, but how is the player going to decide which ship it is?
  placeShip(column, row, ship) {
    this.columns[column][row - 1] = ship;
  }
  receiveAttack(column, row) {
    const ship = this.getCoordinate(column, row);
    if (ship instanceof Ship) {
      ship.hit();
      return true;
    }
    this.columns[column][row - 1] = "miss";
    this.missedShots.push([column, row]);
    return false;
  }
}
