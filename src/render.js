import "./board.css";
import Game from "./game.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
    domBoards: [],
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
  static updateCachedBoards() {
    this.cachedDom.domBoards.forEach((element) => element.updateBoard());
    return this.cachedDom.domBoards;
  }
  static playerSetupScreen(currentPlayer) {
    Render.setHeader(`${Game.getCurrentPlayer().name}'s Turn - Setup Phase`);
    const shipsDiv = renderUtil.makeElement("div", "ship-placement-container");
    const populateBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    populateBtn.textContent = `Populate ${Game.getCurrentPlayer().name} board`;
    doneBtn.textContent = `Done`;
    const board = new Board(Game.getCurrentPlayer());
    this.cachedDom.domBoards.push(board);
    populateBtn.addEventListener("click", () => {
      Game.populatePredetermined(Game.getCurrentPlayer());
      board.updateBoard();
    });
    doneBtn.addEventListener("click", () => {
      //fixed

      const nextRenderPhase = Game.playerSetup();
      // Render.cachedDom.renderedBoards.push(board);
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"], 500);
    });
    shipsDiv.append(populateBtn, doneBtn);

    this.cachedDom.mainContainer.replaceChildren(
      shipsDiv,
      board.getRenderedBoard()
    );
  }

  //should I place update board here on the switching playerScreen  ?
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

  //REFACTOR clean up this is messy
  static playerMoveScreen() {
    //TODO next: Decide also if the two boards are going to be p1 board and p2 board or enemy and currentplayer board
    console.log("player Move Screen");
    console.log(Game.getCurrentStage());

    //DONE stop making new boards
    //DONE make board in the same position so theres no changing around each round
    const [player1Board, player2Board] = this.updateCachedBoards();

    //Refactor: Change this to a function that handles rendering the board altogether so I can reuse it on gameover scene
    //I can also just cache this screen and reuse it
    const boardContainers = renderUtil.makeBoardContainers(
      player1Board,
      player2Board
    );
    this.cachedDom.mainContainer.replaceChildren(boardContainers);
    //REFACTOR change to handleEvent on the board
    const [enemyBoard] = this.cachedDom.domBoards.filter(
      (board) => board.amIEnemy() === true
    );
    enemyBoard
      .getRenderedBoard()
      .addEventListener("click", enemyBoard, { once: true });
    //TODO implement gameover check
    this.setHeader(`${Game.getCurrentPlayer().name}'s Turn`);
  }
  static gameOverScreen() {
    const [player1Board, player2Board] = this.cachedDom.domBoards;
    player1Board.revealBoard();
    player2Board.revealBoard();

    Render.cachedDom.mainContainer.replaceChildren(
      player1Board.getRenderedBoard(),
      player2Board.getRenderedBoard()
    );
    Render.setHeader(`${Game.getWinner().name} is the winner`);
  }
}
//TODO change to upperCase
class renderUtil {
  static makeElement(element, className, ...childs) {
    const myEl = document.createElement(element);
    myEl.classList.add(className);
    if (childs) {
      myEl.append(...childs);
    }
    return myEl;
  }
  //todo
  static makeBoardContainers(player1Board, player2Board) {
    const boardContainers = renderUtil.makeElement("div", "board-containers");
    const board1HeaderInfo = renderUtil.makeElement(
      "span",
      "board-header-info"
    );
    const board2HeaderInfo = renderUtil.makeElement(
      "span",
      "board-header-info"
    );
    board1HeaderInfo.textContent = player1Board.player.name;
    board2HeaderInfo.textContent = player2Board.player.name;
    const board1InfoEl = renderUtil.makeElement(
      "div",
      "board-information",
      board1HeaderInfo,
      player1Board.getRenderedBoard()
    );
    const board2InfoEl = renderUtil.makeElement(
      "div",
      "board-information",
      board2HeaderInfo,
      player2Board.getRenderedBoard()
    );
    boardContainers.replaceChildren(board1InfoEl, board2InfoEl);
    return boardContainers;
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
    //this is breaking
    boardContainer.dataset.player = this.player.name;
    // const boundEvent = this.clickBoardEvent.bind(this);
    // boardContainer.addEventListener("click", boundEvent);

    this.renderedBoard = boardContainer;
    console.log(this.renderedBoard);
    // return boardContainer;
  }
  getRenderedBoard() {
    return this.renderedBoard;
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
    if (event.type !== "click") return;
    if (Game.getCurrentStage() === "playerMove") {
      const attackCoordinates = this.clickBoardEvent(event);
      const nextRenderPhase = Game.playerMove(attackCoordinates);
      this.updateBoard();
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"]);
    }
  }
}
