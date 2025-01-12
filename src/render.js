import { css } from "webpack";
import "./board.css";
export default class Render {}

export class Board {
  constructor(rows, columns, className) {
    // this.init(rows, columns, className);
  }
  init(rows, columns, className) {
    const cellNumber = columns * rows;

    const cells = [];
    //
    for (let i = 0; i < cellNumber; i++) {
      const cell = document.createElement("div");
      cells.push(cell);
    }

    const boardContainer = document.createElement("div");
    boardContainer.append(...cells);
    boardContainer.classList.add(className);
    return boardContainer;
  }
  //   #generateCells(rows, columns) {}
  //   #columnIndicators(numCol) {
  //     const cssClass = "board-column-indicator";
  //     const letterCode = 65;
  //     const container = document.createElement("div");
  //     for (let i = 0; i < numCol; i++) {
  //       const div = document.createElement("div");
  //       div.classList.add(cssClass);
  //       div.textContent = String.fromCharCode(letter);
  //       container.appendChild(div);
  //     }

  //     container.classList.add("board-column-indicators");
  //     return container;
  //   }
  //   #rowIndicators(numRows) {
  //     const cssClass = "bord-row-indicator";
  //     const container = document.createElement("div");
  //     for (let i = 0; i < numCol; i++) {
  //       const row = document.createElement("div");
  //       row.textContent = i;
  //       row.classList.add(cssClass);
  //       container.appendChild(container);
  //     }
  //     container.classList.add("bord-row-indicators");
  //   }
}
