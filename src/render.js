import "./board.css";
import Game from "./game.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
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
    populateBtn.textContent = `Populate ${Game.getCurrentPlayer().name} board`;
    const doneBtn = document.createElement("button");
    doneBtn.textContent = `Done`;
    populateBtn.addEventListener("click", () =>
      Game.populatePredetermined(Game.getCurrentPlayer())
    );
    doneBtn.addEventListener("click", () => {
      //TODO  this logic shouldnt be here, renderer should only control the rendered elements
      if (Game.isPlayerReady(Game.getCurrentPlayer()))
        if (Game.allPlayersReady() === true) {
          //go to the move screen because all players are setup, should also switch players
          console.log("both players are setup");
          Render.switchingPlayerScreen(Render.playerMoveScreen, 3000);
        } else {
          //we still need p2 to setup, so lets switch the player then setup
          console.log("still need p2 to setup, lets go");
          Render.switchingPlayerScreen(Render.playerSetupScreen, 500);
        }
    });
    shipsDiv.append(populateBtn, doneBtn);

    const board = new Board();
    this.cachedDom.mainContainer.replaceChildren(
      shipsDiv,
      board.getRenderedBoard()
    );
  }
  static async switchingPlayerScreen(nextScreenFun, time) {
    const switching = document.createElement("p");
    switching.textContent = "Switching players, please hold . . . ";

    Render.cachedDom.mainContainer.replaceChildren(switching);
    await new Promise((resolve) => {
      setTimeout(() => {
        Game.switchPlayer();
        nextScreenFun.call(this);
      }, time);
    });

    //set a timer to change the screen and board to the other player
  }
  static playerMoveScreen() {
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
  updateBoard(gameboardInfo) {}

  loopBoard(callback) {
    for (let cell of this.renderedBoard.children) {
      if (cell.dataset.isLabel === true) continue;
      callback(cell);
    }
  }
}
