import "./board.css";
import Game from "./game.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
    renderedBoards: [],
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
    Render.setHeader(`${Game.getCurrentPlayer().name}'s Turn - Setup Phase`);
    const shipsDiv = renderUtil.makeElement("div", "ship-placement-container");
    const populateBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    populateBtn.textContent = `Populate ${Game.getCurrentPlayer().name} board`;
    doneBtn.textContent = `Done`;
    const board = new Board(Game.getCurrentPlayer());
    populateBtn.addEventListener("click", () => {
      Game.populatePredetermined(Game.getCurrentPlayer());
      board.updateBoard();
    });
    doneBtn.addEventListener("click", () => {
      //fixed

      const nextRenderPhase = Game.playerSetup();
      Render.cachedDom.renderedBoards.push(board);
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"], 500);
    });
    shipsDiv.append(populateBtn, doneBtn);

    this.cachedDom.mainContainer.replaceChildren(
      shipsDiv,
      board.getRenderedBoard()
    );
  }
  static async switchingPlayerScreen(nextScreenFun, time = 500) {
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
    //TODO next: Decide also if the two boards are going to be p1 board and p2 board or enemy and currentplayer board
    console.log("player Move Screen");
    console.log(Game.getCurrentStage());
    //REFACTOR stop making new boards
    const currentPlayerRenderedBoard = new Board(Game.getCurrentPlayer());
    const enemyPlayerRenderedBoard = new Board(Game.getEnemyPlayer());
    currentPlayerRenderedBoard.updateBoard();
    enemyPlayerRenderedBoard.updateBoard();
    const boardContainers = renderUtil.makeElement("div", "board-containers");
    boardContainers.replaceChildren(
      currentPlayerRenderedBoard.getRenderedBoard(),
      enemyPlayerRenderedBoard.getRenderedBoard()
    );
    this.cachedDom.mainContainer.replaceChildren(boardContainers);
    //REFACTOR change to handleEvent on the board
    enemyPlayerRenderedBoard.getRenderedBoard().addEventListener(
      "click",
      (e) => {
        //FIXED, row is getting the wrong info
        const attackCoordinates = enemyPlayerRenderedBoard.clickBoardEvent(e);
        const nextRenderPhase = Game.playerMove(attackCoordinates);
        enemyPlayerRenderedBoard.updateBoard();
        //CHANGE switchingPlayerScreen so i dont have to call Render[nextrentedphar + "screen"] on each new call
        Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"]);
      },
      { once: true }
    );
    //TODO implement gameover check
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
  player;
  constructor(player, rows = 10, columns = 10, className = "board-container") {
    this.rows = rows;
    this.columns = columns;
    this.className = className;
    this.init(rows, columns, className);
    this.player = player;
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
    // const boundEvent = this.clickBoardEvent.bind(this);
    // boardContainer.addEventListener("click", boundEvent);
    boardContainer.append(...cells);
    boardContainer.classList.add(className);
    this.renderedBoard = boardContainer;
    console.log(this.renderedBoard);
    // return boardContainer;
  }
  getRenderedBoard() {
    return this.renderedBoard;
  }
  updateBoard() {
    if (Game.getCurrentPlayer() === this.player)
      //need to see my ships and enemy players hits
      //I am the current player
      this.allyView();
    else {
      //if im the enemy player, the current player needs to see
      //my attacks received, missed hits
      this.enemyView();
    }
  }
  //REFACTOR
  enemyView(gameboardInstance) {
    const missedHits = this.player.gameboard.missedShots;
    const attacksReceived = this.player.gameboard.attacksReceived;

    this.loopBoard((cell) => {
      if (missedHits.includes(cell.dataset.coordinates)) {
        cell.textContent = "miss";
      } else if (attacksReceived.includes(cell.dataset.coordinates)) {
        cell.textContent = "hit";
      }
    });
  }
  allyView(gameboardInstance) {
    //!!
    this.loopBoard((cell) => {
      //if gameboard coordinates matches missed shots or attacks received or coordinates
      //change text content(img later) to match according to what it is
      //board is updated whenever places ship
      //REFACTOR
      if (this.player.gameboard.coordinates.has(cell.dataset.coordinates)) {
        console.log("found");
        cell.textContent = "ship";
      }
      if (
        this.player.gameboard.attacksReceived.includes(cell.dataset.coordinates)
      ) {
        cell.textContent = "hit";
      }
      if (
        this.player.gameboard.missedShots.includes(cell.dataset.coordinates)
      ) {
        cell.textContent = "miss";
      }
    });
  }

  clickBoardEvent(event) {
    if (this.player === Game.getEnemyPlayer()) {
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
}
