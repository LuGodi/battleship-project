import DragAndDrop from "./drag_drop";
import Game from "./game";
import { Render } from "./render";
import { renderUtil } from "./render";
export class BoardRenderer {
  rows;
  columns;
  className;
  renderedBoard;
  player;
  grouped = null;
  shipParts = {
    verticalMiddle: "H",
    verticalStart: "^",
    verticalEnd: "v",
    horizontalStart: "<",
    horizontalEnd: ">",
    horizontalMiddle: "=",
  };
  constructor(player, rows = 10, columns = 10, className = "board-container") {
    this.rows = rows;
    this.columns = columns;
    this.className = className;
    this.player = player;
    this.init(rows, columns, className);
  }
  init() {
    const rows = this.rows;
    const columns = this.columns;
    const className = this.className;
    const cellNumber = columns * rows;
    const alphabet = "ABCDEFGHIJ";
    const cells = [];
    //row 0 is the label for the columns
    //column 0 is the label for the rows

    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const cell = document.createElement("div");
        cell.dataset.column = column;
        cell.dataset.row = row;
        cell.dataset.isLabel = true;
        if (row > 0 && column > 0) {
          //strings are zero indexed but the column is not
          cell.dataset.isLabel = false;
          cell.dataset.coordinates = `${alphabet[column - 1]}${row}`;
        }

        cells.push(cell);
      }
    }

    const boardContainer = renderUtil.makeElement("div", className, ...cells);
    boardContainer.dataset.player = this.player.name;
    boardContainer.addEventListener("click", this);
    // const boundEvent = this.clickBoardEvent.bind(this);
    // boardContainer.addEventListener("click", boundEvent);

    this.renderedBoard = boardContainer;
    console.log(this.renderedBoard);
    // return boardContainer;
  }
  getRenderedBoard() {
    return this.renderedBoard;
  }
  initListener() {
    this.getRenderedBoard().addEventListener("click", this);
  }
  amIEnemy() {
    return Game.getEnemyPlayer() === this.player;
  }
  updateBoard() {
    this.grouped = this.groupCoordinatesByInstance();
    if (this.amIEnemy() === true) {
      //need to see my ships and enemy players hits
      //I am the current player
      console.log(`${this.player.name} is enemy`);
      this.enemyView();
      return;
    } else {
      //if im the enemy player, the current player needs to see
      //my attacks received, missed hits
      console.log(`${this.player.name} is active player`);
      this.allyView();
    }
  }
  revealBoard() {
    this.allyView();
  }
  //REFACTOR
  enemyView(gameboardInstance) {
    this.renderedBoard.dataset.playerStatus = "enemy";
    const missedHits = this.player.gameboard.missedShots;
    const attacksReceived = this.player.gameboard.attacksReceived;

    this.loopBoard((cell) => {
      if (missedHits.includes(cell.dataset.coordinates)) {
        cell.textContent = "miss";
      } else if (attacksReceived.includes(cell.dataset.coordinates)) {
        cell.textContent = "hit";
      } else {
        cell.textContent = "";
      }
    });
  }
  allyView(gameboardInstance) {
    //!!
    this.renderedBoard.dataset.playerStatus = "ally";
    //TODO can make the loop make three arrays and then we assign the content to those depending on type of array

    this.loopBoard((cell) => {
      //if gameboard coordinates matches missed shots or attacks received or coordinates
      //change text content(img later) to match according to what it is
      //board is updated whenever places ship
      //REFACTOR
      //TODO separate the stylying for each cell status
      if (
        this.player.gameboard.attacksReceived.includes(cell.dataset.coordinates)
      ) {
        cell.textContent = "hit";
      } else if (
        this.player.gameboard.missedShots.includes(cell.dataset.coordinates)
      ) {
        cell.textContent = "miss";
      } else if (
        this.player.gameboard.coordinates.has(cell.dataset.coordinates)
      ) {
        console.log("found");
        cell.textContent = this.renderShip(cell.dataset.coordinates);
      } else {
        cell.textContent = "";
      }
    });
  }

  clickBoardEvent(event) {
    if (this.amIEnemy() === true) {
      // console.log(event.target.dataset.coordinates);
      return event.target.dataset.coordinates;
    }
  }
  loopBoard(callback) {
    for (let cell of this.renderedBoard.children) {
      if (cell.dataset.isLabel === "true") {
        continue;
      }

      callback(cell);
    }
  }
  handleEvent(event) {
    console.log(this);
    console.log(event.type);
    console.log(event.target);
    console.log(Game.getCurrentStage());
    if (event.target.dataset.coordinates === undefined) return;
    //Refactor give the event to each handler properly
    console.log("here");
    if (event.type === "drop") this.dropEventHandler(event);
    if (event.type === "dragover") this.dragoverEventHandler(event);
    if (event.type !== "click") return;
    if (Game.getCurrentStage() === "playerMove" && this.amIEnemy() === true) {
      const attackCoordinates = this.clickBoardEvent(event);
      const nextRenderPhase = Game.playerMove(attackCoordinates);

      this.updateBoard();
      //this should not be here
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"]);
    }
  }

  //make this fun reference the other fun
  dropEventHandler(event) {
    if (Game.getCurrentStage() !== "playerSetup") return;
    DragAndDrop.dropEventHandler.call(this, event);
  }

  dragoverEventHandler(event) {
    DragAndDrop.dragoverEventHandler.call(this, event);
  }
  groupCoordinatesByInstance() {
    //I only need to run this after setup, then I can use the stored value and apply a tag for hit
    const gameboard = this.player.gameboard;
    const coordinatesByShips = new Map();
    //grouping by instances
    for (let [coordinate, instance] of gameboard.coordinates) {
      if (coordinatesByShips.has(instance) === true) {
        coordinatesByShips.get(instance).push(coordinate);
      } else {
        coordinatesByShips.set(instance, [coordinate]);
      }
    }
    //Sort so its either A1 A2 A3(vertical) or A1 B1 C1(horizontal)
    //its already sorted
    // coordinatesByShips.forEach((val, key) => val.sort());

    console.log("coordinatesbySHIPS");
    console.log(coordinatesByShips);
    return coordinatesByShips;
  }
  renderShip(cellCoordinate) {
    const groupedCoord = this.grouped;
    const coordinates = this.player.gameboard.coordinates;
    //I should only loop through the cells that have a ship, or, cells that are in the coordinates array

    console.log(cellCoordinate);
    if (coordinates.has(cellCoordinate)) {
      const shipInstance = coordinates.get(cellCoordinate);
      console.log(shipInstance);
      //all the coordinates that ship occupies
      const shipCoordinatesArr = groupedCoord.get(shipInstance);
      //which part is this? Start, middle or end ?
      const part = this.#assignShipParts(
        shipCoordinatesArr,
        shipInstance.getDirection(),
        cellCoordinate
      );
      console.log(part);
      return part;

      //DONE change this to only receive the coordinates and decide which part is
      // - should return the part
      // - should not loop
    }
  }

  //decides if its a middle, start or end part
  #assignShipParts(coordinatesOccupiedByShip, shipDirection, coordinates) {
    const part = coordinatesOccupiedByShip.indexOf(coordinates);
    const result = coordinatesOccupiedByShip.length - part;
    // return this.shipParts[shipDirection + result]

    if (result === 1) return this.shipParts[shipDirection + "End"];
    else if (result === coordinatesOccupiedByShip.length)
      return this.shipParts[shipDirection + "Start"];
    else {
      return this.shipParts[shipDirection + "Middle"];
    }
  }
}
