import "./board.css";
import Game from "./game.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
    p1RenderedBoard: null,
    p2RenderedBoard: null,
  };

  static setHeader(title) {
    this.cachedDom.statusNav.textContent = title;
  }
  static pastMovesList() {}

  static gameStartScreen() {
    //TODO memoize
    const gameStartBtn = document.createElement("button");
    gameStartBtn.textContent = "Start";
    gameStartBtn.addEventListener("click", (event) => {
      Game.start();
      this.playerSetupScreen();
    });
    Render.cachedDom.mainContainer.replaceChildren(gameStartBtn);
    this.cachedDom.statusNav.textContent = "BattleShip";
  }
  static playerSetupScreen(currentPlayer) {
    //TODO
    Render.setHeader(`${Game.getCurrentPlayer().name}'s Turn - Setup Phase`);
    const shipsDiv = renderUtil.makeElement("div", "ship-placement-container");
    const populateBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    populateBtn.textContent = `Populate ${Game.getCurrentPlayer().name} board`;
    doneBtn.textContent = `Done`;
    const board = new Board();
    populateBtn.addEventListener("click", () => {
      Game.populatePredetermined(Game.getCurrentPlayer());
      board.updateBoard(Game.getCurrentPlayer().gameboard);
    });
    doneBtn.addEventListener("click", () => {
      //TODO  this logic shouldnt be here, renderer should only control the rendered elements
      //how do i know if its ready to go to the next phase?

      const nextRenderPhase = Game.playerSetup();

      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"], 5000);
    });
    shipsDiv.append(populateBtn, doneBtn);

    this.cachedDom.mainContainer.replaceChildren(
      shipsDiv,
      board.getRenderedBoard()
    );
  }
  static async switchingPlayerScreen(nextScreenFun, time) {
    const switching = document.createElement("p");
    switching.textContent = "Switching players, please hold . . . ";
    this.cachedDom.statusNav.textContent = `Switching from ${
      Game.getEnemyPlayer().name
    } to ${Game.getCurrentPlayer().name}`;

    Render.cachedDom.mainContainer.replaceChildren(switching);
    await new Promise((resolve) => {
      setTimeout(() => {
        // Game.switchPlayer();
        nextScreenFun.call(this);
      }, time);
    });

    //set a timer to change the screen and board to the other player
  }
  static playerMoveScreen() {
    console.log("player Move Screen");
    console.log(Game.getCurrentStage());
    this.cachedDom.mainContainer.replaceChildren();
    this.setHeader(`${Game.getCurrentPlayer().name}'s Turn`);
  }
  static GameoverScreen() {}
}
class renderUtil {
  static makeElement(element, className) {
    const myEl = document.createElement(element);
    myEl.classList.add(className);
    return myEl;
  }
}
// export class UI(){

// }
export class Board {
  rows;
  columns;
  className;
  renderedBoard;
  constructor(rows = 10, columns = 10, className = "board-container") {
    this.rows = rows;
    this.columns = columns;
    this.className = className;
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

    const boardContainer = document.createElement("div");
    boardContainer.append(...cells);
    boardContainer.classList.add(className);
    this.renderedBoard = boardContainer;
    console.log(this.renderedBoard);
    // return boardContainer;
  }
  getRenderedBoard() {
    return this.renderedBoard;
  }
  updateBoard(gameboardInstance) {
    console.log(gameboardInstance.coordinates);
    const arr = ["missedShots", "attacksReceived", "coordinates"];
    this.loopBoard((cell) => {
      //if gameboard coordinates matches missed shots or attacks received or coordinates
      //change text content(img later) to match according to what it is
      //board is updated whenever places ship
      if (gameboardInstance.coordinates.has(cell.dataset.coordinates)) {
        console.log("found");
        cell.textContent = "ship";
      }
    });
  }

  clickBoardEvent(event) {
    event.dataset.coordinates;
  }
  loopBoard(callback) {
    for (let cell of this.renderedBoard.children) {
      if (cell.dataset.isLabel === true) continue;
      callback(cell);
    }
  }
}
