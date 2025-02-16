import Game from "./game";
import { Render } from "./render";
import { renderUtil } from "./render";
export class BoardRenderer {
  rows;
  columns;
  className;
  renderedBoard;
  player;
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
        cell.textContent = "ship";
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
      if (cell.dataset.isLabel === true) continue;
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
    if (event.type === "drop") this.handleDropEvent(event);
    if (event.type !== "click") return;
    if (Game.getCurrentStage() === "playerMove" && this.amIEnemy() === true) {
      const attackCoordinates = this.clickBoardEvent(event);
      const nextRenderPhase = Game.playerMove(attackCoordinates);
      this.updateBoard();
      //this should not be here
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"]);
    }
  }

  handleDropEvent(event) {
    //TODO can I put the remove event listener here ?
    console.log("handledropevent");
    console.log(Game.getCurrentStage());
    //this here is my element
    console.log(this);
    console.log(this.player);

    if (Game.getCurrentStage() !== "playerSetup") return;
    // if (event.target.dataset.coordinates === undefined) {
    //   console.log("aborted");
    //   return;
    // }

    console.log(event.target);
    const [col, row] = [
      event.target.dataset.coordinates[0],
      event.target.dataset.coordinates.substring(1),
    ];
    const shipLen = Number.parseInt(event.dataTransfer.getData("shipLength"));
    const shipName = event.dataTransfer.getData("shipName");
    const shipDirection = event.dataTransfer.getData("shipDirection");
    console.log(shipLen, shipName, shipDirection);
    //TOFIX: if ship was already placed, position should be updated instead of placing another copy
    console.log(col, row, shipLen, shipDirection);
    //FIXED: WHEN PASSING A DIRECTION OTHER THAN HORIZONTAL A 1 GETS ADDED
    //TOFIX: When failing placing the ship, shouldnt interrupt the whole program anymore
    try {
      this.player.gameboard.placeShip(col, row, shipLen, shipDirection);
      this.updateBoard();
    } catch (err) {
      if (
        err.message.includes("Invalid coordinate") ||
        err.message.includes("Coordinate already taken")
      ) {
        //this is not going to work, dropEffect cant be changed on drop
        event.dataTransfer.dropEffect = "none";
        return;
      }
      throw err;
      //notify logger
    }
    // event.dataTransfer.dropEffect = "move";

    //I can either make it unable to drag after placing or
    //implement something that removes the ship

    //Dragend fires an event at the object that was being dragged, i can use it to remove the drag
    //or I can make an array that controls
  }
}
