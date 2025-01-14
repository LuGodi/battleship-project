import "./board.css";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector("nav"),
  };
  static setNavStatus(playerName, phase) {
    this.cachedDom.statusNav.textContent = `${PlayerName}'s Turn`;
  }
  static moveList() {}

  static gameStartScreen() {}
  static switchingPlayerScreen(fromPlayer, toPlayer) {}
  static playerMoveScreen(currentPlayer) {}
  static GameoverScreen() {}
  static playerSetupScreen(currentPlayer) {}
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
