import "./board.css";
import Game from "./game.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
  };
  static setTurn(currentPlayerName, phase) {
    this.cachedDom.statusNav.textContent = `${currentPlayerName.name}'s Turn`;
  }
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
  }
  static playerSetupScreen(currentPlayer) {
    //TODO
    for (let player of Game.players) {
      Game.populatePredetermined(player);
    }
    this.playerMoveScreen();
  }
  static switchingPlayerScreen(fromPlayer, toPlayer) {}
  static playerMoveScreen() {
    this.setTurn(Game.getCurrentPlayer());
  }
  static GameoverScreen() {}
}

// export class UI(){

// }
export class Board {
  constructor(rows, columns, className) {
    // this.init(rows, columns, className);
  }
  init(rows, columns, className) {
    const cellNumber = columns * rows;

    const cells = [];
    //

    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= columns; j++) {
        const cell = document.createElement("div");
        cell.dataset.column = j;
        cell.dataset.row = i;

        cells.push(cell);
      }
    }

    const boardContainer = document.createElement("div");
    boardContainer.append(...cells);
    boardContainer.classList.add(className);
    return boardContainer;
  }
  #generateCells(rows, columns) {}
  #columnIndicators(numCol) {
    const cssClass = "board-column-indicator";
    let letterCode = 65;
    const container = document.createElement("div");
    for (let i = 0; i < numCol; i++) {
      const div = document.createElement("div");
      div.classList.add(cssClass);
      div.textContent = String.fromCharCode(letterCode++);
      container.appendChild(div);
    }

    container.classList.add("board-column-indicators");
    return container;
  }
  #rowIndicators(numRows) {
    const cssClass = "bord-row-indicator";
    const container = document.createElement("div");
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement("div");
      row.textContent = i;
      row.classList.add(cssClass);
      container.appendChild(row);
    }
    container.classList.add("bord-row-indicators");
  }
}
