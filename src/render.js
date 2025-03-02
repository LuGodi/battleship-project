import "./board.css";
import Game from "./game.js";
import { BoardRenderer } from "./board_renderer.js";
import DragAndDrop from "./drag_drop.js";
export class Render {
  static cachedDom = {
    body: document.querySelector("body"),
    statusNav: document.querySelector(".header"),
    mainContainer: document.querySelector(".main-container"),
    domBoards: [],
    logger: null,
  };

  static setHeader(title) {
    this.cachedDom.statusNav.textContent = title;
  }
  static pastMovesList() {}

  static gameStartScreen() {
    //TODO memoize
    console.log("game start screen");
    const onePlayerBtn = document.createElement("button");
    const twoPlayersBtn = document.createElement("button");
    onePlayerBtn.classList.add("one-player-button");
    twoPlayersBtn.classList.add("two-player-button");
    onePlayerBtn.textContent = "One player Mode";
    twoPlayersBtn.textContent = "Two players Mode";
    //TODO: No need to repeat, clean this up later
    onePlayerBtn.addEventListener("click", (event) => {
      const nextRenderPhase = Game.start(1);
      Render.cachedDom.mainContainer.classList.remove("game-start-phase");
      Render.nextScreen(Render[nextRenderPhase + "Screen"]);
    });
    twoPlayersBtn.addEventListener("click", (event) => {
      const nextRenderPhase = Game.start(2);
      Render.cachedDom.mainContainer.classList.remove("game-start-phase");

      Render.nextScreen(Render[nextRenderPhase + "Screen"]);
    });
    Render.cachedDom.mainContainer.replaceChildren(onePlayerBtn, twoPlayersBtn);
    Render.cachedDom.mainContainer.classList.add("game-start-phase");
    this.cachedDom.statusNav.textContent = "BattleShip";
  }
  static updateCachedBoards() {
    this.cachedDom.domBoards.forEach((element) => element.updateBoard());
    return this.cachedDom.domBoards;
  }
  //BUG: stage isnt changing to playerSetup
  static playerSetupScreen(currentPlayer) {
    this.cachedDom.mainContainer.classList.add("player-setup-phase");
    const board = new BoardRenderer(Game.getCurrentPlayer());

    if (Game.getCurrentPlayer().type === "computer") {
      Game.populateGameboard(Game.getCurrentPlayer());
      setupDone();
      return;
    }
    Render.setHeader(`${Game.getCurrentPlayer().name}'s Turn - Setup Phase`);
    const shipsDiv = renderUtil.makeElement("div", "ship-placement-container");
    const shipsMenuEl = renderUtil.makeShipsMenu(Game.SHIPS_TYPES);
    const populateBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Reset";
    populateBtn.textContent = `Populate ${Game.getCurrentPlayer().name} board`;
    doneBtn.textContent = `Done`;

    clearBtn.addEventListener("click", (event) => {
      Game.currentPlayer.gameboard.clearGameboard();
      board.updateBoard();
      this.playerSetupScreen(Game.getCurrentPlayer());
    });
    populateBtn.addEventListener("click", () => {
      Game.populateGameboard(Game.getCurrentPlayer());
      shipsDiv
        .querySelectorAll(".ship-info-container")
        .forEach((part) => part.remove());
      board.updateBoard();
    });
    doneBtn.addEventListener("click", setupDone);
    function setupDone(event) {
      //fixed

      const nextRenderPhase = Game.playerSetup();
      console.log(nextRenderPhase);
      Render.cachedDom.domBoards.push(board);
      Render.cachedDom.mainContainer.classList.remove("player-setup-phase");

      // Render.cachedDom.renderedBoards.push(board);
      Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"], 500);
    }

    shipsDiv.append(shipsMenuEl, clearBtn, populateBtn, doneBtn);
    board.getRenderedBoard().addEventListener("drop", board);
    board.getRenderedBoard().addEventListener("dragover", board);
    this.cachedDom.mainContainer.replaceChildren(
      shipsDiv,
      board.getRenderedBoard()
    );
  }

  //should I place update board here on the switching playerScreen  ?
  //TODO this is wrong? Is there a need to return promise here?
  static async nextScreen(nextScreenFun, time = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Game.switchPlayer();
        nextScreenFun.call(this);
      }, time);
    });
  }
  static async switchingPlayerScreen(nextScreenFun, time = 500) {
    const switching = document.createElement("p");
    switching.textContent = "Switching players, please hold . . . ";
    this.cachedDom.statusNav.textContent = `Switching from ${
      Game.getEnemyPlayer().name
    } to ${Game.getCurrentPlayer().name}`;

    Render.cachedDom.mainContainer.replaceChildren(switching);
    await Render.nextScreen(nextScreenFun, time);

    //set a timer to change the screen and board to the other player
  }

  //REFACTOR clean up this is messy
  static playerMoveScreen() {
    this.setHeader(`${Game.getCurrentPlayer().name}'s Turn`);

    //TODO next: Decide also if the two boards are going to be p1 board and p2 board or enemy and currentplayer board
    if (this.cachedDom.logger === null) {
      const logger = Game.logger;
      this.cachedDom.logger = logger;
      this.cachedDom.body.append(logger.getLogger());
    }
    this.cachedDom.mainContainer.classList.add("player-move-phase");
    // document.documentElement.style.setProperty(
    //   "--current-player",
    //   Game.getCurrentPlayer().name
    // );

    // console.log(this.cachedDom.domBoards);
    // console.log("player Move Screen");
    // console.log(Game.getCurrentStage());
    if (Game.currentPlayer.type === "computer") {
      console.log(Game.currentPlayer.type);
      let playerBoard;
      let computerBoard;
      this.cachedDom.domBoards.forEach((board) => {
        if (board.player.type === "computer") computerBoard = board;
        else playerBoard = board;
      });
      // const [playerBoard] = this.cachedDom.domBoards.filter(
      //   (board) => board.player.type !== "computer"
      // );
      // console.log(computerBoard);
      playerBoard.highlightBoard(true);
      computerBoard.getRenderedBoard().classList.add("dim");
      const nextRenderPhase = Game.computerPlayerMove();
      setTimeout(() => {
        playerBoard.highlightBoard(false);
        computerBoard.getRenderedBoard().classList.remove("dim");
        Render[nextRenderPhase + "Screen"]();
      }, BoardRenderer.TIME_FOR_HIT_FEEDBACK);

      return;

      // Render.switchingPlayerScreen(Render[nextRenderPhase + "Screen"], 0);
    }
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
    //listener is on the board
    const [enemyBoard] = this.cachedDom.domBoards.filter(
      (board) => board.amIEnemy() === true
    );
    enemyBoard.getRenderedBoard().addEventListener("click", enemyBoard);
    //TODO implement gameover check
  }
  static gameOverScreen() {
    this.cachedDom.mainContainer.classList.remove("player-move-phase");
    const [player1Board, player2Board] = this.cachedDom.domBoards;
    player1Board.revealBoard();
    player2Board.revealBoard();

    Render.cachedDom.mainContainer.replaceChildren(
      player1Board.getRenderedBoard(),
      player2Board.getRenderedBoard()
    );
    Game.finalStatus(Game.getCurrentPlayer());
    Game.finalStatus(Game.getEnemyPlayer());
    Render.setHeader(`${Game.getWinner().name} is the winner`);
  }
}
//TODO change to upperCase
export class renderUtil {
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

  //TODO move this to drag and drop ?
  static makeShipsMenu(SHIPS_TYPES) {
    const menuElements = [];
    for (let { name, length } of SHIPS_TYPES) {
      // const shipViewEl = this.makeElement("div", "ship-view");
      let direction = "horizontal";
      const shipViewEl = this.makeShipMenuImgs(length, direction);
      //TODO finish draggable implementation
      shipViewEl.draggable = true;

      // shipViewEl.addEventListener("dragend", (event) => {
      //   const data = event.dataTransfer.getData("text");
      //   console.log(data);
      // });
      const shipName = this.makeElement("p", "ship-name");
      const shipLength = this.makeElement("p", "ship-length");
      const shipDirection = this.makeElement("p", "ship-direction");
      shipName.textContent = name;
      shipLength.textContent = length;
      shipDirection.textContent = direction;
      shipViewEl.addEventListener(
        "dragstart",
        DragAndDrop.dragstartEvent(name, length)
      );
      shipViewEl.addEventListener("dragend", DragAndDrop.dragendHandler);

      const shipInfoEl = this.makeElement(
        "div",
        "ship-info",
        shipName,
        shipLength,
        shipDirection
      );
      shipInfoEl.dataset.direction = direction;
      shipInfoEl.addEventListener("click", (event) => {
        event.currentTarget.dataset.direction =
          event.currentTarget.dataset.direction === "horizontal"
            ? "vertical"
            : "horizontal";

        console.log(event.currentTarget);
        event.currentTarget.lastElementChild.innerText =
          event.currentTarget.dataset.direction;
      });
      menuElements.push(
        this.makeElement("div", "ship-info-container", shipViewEl, shipInfoEl)
      );
    }
    const shipsMenuEl = this.makeElement("div", "ships-menu", ...menuElements);
    return shipsMenuEl;
  }
  static makeShipMenuImgs(length, direction) {
    // const imgs = BoardRenderer.shipParts;
    // const imgVertical = []
    // const imgHorizontal = [BoardRenderer.shipParts.horizontalStart,BoardRenderer.shipParts]
    document.documentElement.style.setProperty(
      "--max-ship-size",
      Game.SHIP_MAX_SIZE
    );
    const containerEl = renderUtil.makeElement("div", "ship-parts-view");
    const grid = [];
    for (let i = 0; i < length; i++) {
      const part = new Image();
      if (i === 0) part.src = BoardRenderer.shipParts[direction + "Start"];
      else if (i === length - 1)
        part.src = BoardRenderer.shipParts[direction + "End"];
      else part.src = BoardRenderer.shipParts[direction + "Middle"];
      containerEl.append(part);
    }
    return containerEl;
  }
}
// export class UI(){

// }
