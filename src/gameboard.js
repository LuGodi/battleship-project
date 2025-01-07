import Ship from "./ship";

export default class Gameboard {
  //missed shots coordinate are not zero indexed
  missedShots = [];
  attacksReceived = [];
  coordinates;
  constructor() {
    this.coordinates = new Map();
  }
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
      case "Map":
        //should I clear or return a new map ?
        returnVal = new Map();
        break;
      default:
        throw new TypeError("Value should be an array or an object literal");
    }
    return returnVal;
  }
  #isCoordinateOccupied(column, row) {
    const coordinate = this.#toBoardCoordinates(column, row);
    return this.coordinates.has(coordinate);
  }
  getCoordinate(column, row) {
    if (this.#isCoordinateValid(column, row) === false)
      throw new Error("Invalid coordinate");
    const coordinate = this.#toBoardCoordinates(column, row);
    return this.coordinates.get(coordinate);
  }
  updateCoordinate(column, row, value) {
    throw new Error("Not implemented");
  }
  setCoordinate(column, row, value) {
    if (this.#isCoordinateValid(column, row) === false)
      throw new Error("Invalid coordinate", {
        cause: { column: column, row: row },
      });
    if (this.#isCoordinateOccupied(column, row) === true) {
      throw new Error(
        "Coordinate already taken, to overwrite use updateCoordinate",
        {
          cause: { column: column, row: row },
        }
      );
    }
    //shallow copy the map
    const newCoordinates = new Map(this.coordinates);
    const coordinate = this.#toBoardCoordinates(column, row);
    newCoordinates.set(coordinate, value);
    this.coordinates = newCoordinates;
  }
  #toBoardCoordinates(column, row) {
    const coordinate = column + row.toString();
    return coordinate;
  }
  //it actually states that placeShip should make a new instance of ship, but how is the player going to decide which ship it is?
  placeShip(column, row, length, direction = "horizontal") {
    if (direction !== "horizontal" && direction !== "vertical")
      throw new Error("Invalid direction: should be horizontal or vertical");
    const ship = new Ship(length);
    let currentLen = 1;
    const coordinatesBackup = this.coordinates;
    try {
      this.setCoordinate(column, row, ship);
      this.#spreadShip(column, row, ship, direction, length);
    } catch (e) {
      // console.log(e);

      //TODO implement a decent error handler
      if (
        e.message === "Invalid coordinate" ||
        e.message === "Coordinate already taken"
      )
        //would be good if I could get which coordinates got this error
        console.error(`Failed at ${JSON.stringify(e.cause)}, ${e.message}`);
      this.coordinates = coordinatesBackup;
      throw new Error(`${e.message} at ${e.cause.column}${e.cause.row}`);
    }
  }
  #spreadShip(column, row, ship, direction, length) {
    let currentLen = 1;
    //ship.length was causing the test not to work because it is an empty mock, not a mock implementation
    while (currentLen < length) {
      if (direction === "horizontal") {
        column = this.#increaseHorizontal(column);
      } else {
        row = this.#increaseVertical(row);
      }
      currentLen++;
      this.setCoordinate(column, row, ship);
    }
  }
  receiveAttack(column, row) {
    const ship = this.getCoordinate(column, row);
    // if (this.attacksReceived([column, row]))
    if (ship instanceof Ship) {
      ship.hit();
      return true;
    }
    this.missedShots = this.#recordMiss(column, row);
    return false;
  }
  allSunk() {
    if (this.coordinates.size < 1) {
      console.log("there are no ships");
      return false;
    }
    return Array.from(this.coordinates.values()).every((ship) => {
      return ship.isSunk() === true;
    });
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
  #increaseHorizontal(column) {
    const codeUnit = column.charCodeAt(0);
    const newColumn = String.fromCharCode(codeUnit + 1);
    return newColumn;
  }
  #increaseVertical(row) {
    return row + 1;
  }
}
