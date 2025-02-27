// import Gameboard from "./gameboard";
import Player from "./player";
import Logger from "./logger.js";
import Gameboard from "./gameboard.js";
//this will serve as the mediator ?
export default class Game {
  static players = [];
  static stages = ["start", "playerSetup", "playerMove", "gameOver"];
  static gameover = false;
  static logger = new Logger();

  //first item will be the current player
  static player1;
  static player2;
  static currentPlayer;
  static currentStage;

  static SHIPS_TYPES = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Destroyer", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Patrol Boat", length: 2 },
  ];

  static MAX_SHIPS = this.SHIPS_TYPES.length;
  //shouldnt I manage the phases here ?
  static get SHIP_MAX_SIZE() {
    let maxSize = 0;
    for (let { length } of Game.SHIPS_TYPES) {
      maxSize = length > maxSize ? length : maxSize;
    }
    return maxSize;
  }
  static start(mode = 1) {
    //populate the gameboard with predetermined coordinates
    console.log("start game");
    this.currentStage = "start";
    if (mode === 1) {
      Game.players.push(
        new Player("real", "Player"),
        new Player("computer", "Computer")
      );
    } else {
      Game.players.push(
        new Player("real", "Player 1"),
        new Player("real", "Player 2")
      );
    }
    [this.player1, this.player2] = this.players;
    Game.currentPlayer = this.player1;
    const nextStage = "playerSetup";

    return (this.currentStage = nextStage);
  }

  //stages''
  //This is not doing what it should
  //it should get the positions on the board and place ships there

  static playerSetup(coordArray) {
    //should I call the next phase here?
    console.log("Setting up", Game.getCurrentPlayer());
    this.currentStage = "playerSetup";
    if (Game.allPlayersReady() === true) {
      this.currentStage = "playerMove";
      Game.switchPlayer();
      return this.currentStage;
    }

    const currentPlayer = Game.currentPlayer;
    //TODO get coordinates that event handler got
    // for (const coord of coordArray) {
    //   currentPlayer.gameboard.placeShip(...coord);
    // }

    //if player placed all ships correctly he can proceed to the next phase
    if (Game.isPlayerReady(currentPlayer) === true) {
      Game.switchPlayer();
      return this.currentStage;
    } else {
      throw new Error("Player is not ready");
    }
  }

  //I should decide if it gets column,row or coordinates
  //I can use the Gameboard.splitColumnRow here to get the column and row
  static playerMove(attackCoordinates, waitTime = 0) {
    const [column, row] = [
      attackCoordinates[0],
      attackCoordinates.substring(1),
    ];
    this.currentStage = "playerMove";
    const enemyPlayer = this.getEnemyPlayer();
    const hit = enemyPlayer.gameboard.receiveAttack(column, row);
    const sunk =
      hit === false
        ? false
        : enemyPlayer.gameboard.getCoordinate(column, row).isSunk();

    this.logger.logAttack(
      this.getCurrentPlayer().name,
      this.getEnemyPlayer().name,
      attackCoordinates,
      hit,
      sunk
    );
    console.log(
      `${enemyPlayer.name} attack received at ${attackCoordinates}, did it hit ? : ${hit}`
    );
    if (this.isGameover()) {
      this.currentStage = "gameOver";

      return this.currentStage;
    }
    //insert gameovercheck
    Game.switchPlayer();
    return this.currentStage;
  }
  static computerPlayerMove() {
    let nextStage;
    let coordinates;
    while (true) {
      try {
        coordinates = Game.generateRandomCoordinate();
        return Game.playerMove(coordinates);
      } catch (error) {
        console.error(`tried at ${coordinates}, regenerating`);
        if (error.message.includes("coordinate has already been hit") === false)
          throw error;
      }
    }
  }
  //should I move this to gameboard ?
  static generateRandomCoordinate() {
    const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const MINCOORDINATE = 1;
    const MAXCOORDINATE = 10;
    const randomRow = Math.floor(
      Math.random() * (MAXCOORDINATE - MINCOORDINATE + 1) + MINCOORDINATE
    );
    //-1 at the end because arrays are zero indexed
    const randomCol =
      COLUMNS[
        Math.floor(
          Math.random() * (MAXCOORDINATE - MINCOORDINATE + 1) + MINCOORDINATE
        ) - 1
      ];

    return randomCol.concat(randomRow);
  }
  //not pure
  static isGameover() {
    //TODO im checking only for the enemy player, should I check for all just to make sure?
    this.gameover = this.players.some(
      (player) => player.gameboard.allSunk() === true
    );

    return this.gameover;
    // const enemyPlayer = Game.getEnemyPlayer();
    // return enemyPlayer.gameboard.allSunk();
  }
  static finalStatus(player) {
    const [enemy] = this.players.filter((p) => p !== player);
    const gameboard = enemy.gameboard;
    const ships = Array.from(new Set(gameboard.coordinates.values()));
    const shipsSunk = ships.filter((ship) => ship.isSunk() === true);
    console.log(shipsSunk);
    const status = {
      player: player,
      attacksReceived: gameboard.attacksReceived.length,
      missedShotsReceived: gameboard.missedShots.length,
      sunkShips: shipsSunk.length,
    };
    this.logger.logStatus(player, {
      enemyPlayer: enemy,
      sunkShips: status.sunkShips,
      dealtAttacks: status.attacksReceived,
      missedHits: status.missedShotsReceived,
    });
  }
  static getWinner() {
    if (this.gameover === false) return;
    const [winner] = this.players.filter(
      (player) => player.gameboard.allSunk() === false
    );
    return winner;
  }
  static getEnemyPlayer() {
    const [enemyPlayer] = this.players.filter(
      (element) => element !== Game.getCurrentPlayer()
    );

    return enemyPlayer;
  }
  static getCurrentPlayer() {
    return Game.currentPlayer;
  }
  static getCurrentStage() {
    return Game.currentStage;
  }
  static switchPlayer() {
    let oldCurrPlayer = this.currentPlayer;
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
    console.log(
      `switched from ${oldCurrPlayer.name} to ${this.currentPlayer.name}`
    );
  }
  static populatePredetermined(player, coordArray) {
    console.log("populating player", player.name);
    player.gameboard.clearGameboard();
    const predeterminedCoord = [
      ["A", 1, 5, "horizontal"],
      ["D", 5, 3, "vertical"],
      ["A", 3, 4, "vertical"],
      ["A", 8, 3, "horizontal"],
      ["A", 10, 2, "horizontal"],
    ];
    for (const coord of predeterminedCoord) {
      Game.getCurrentPlayer().gameboard.placeShip(...coord);
    }
  }
  static populateGameboard(player) {
    player.gameboard.clearGameboard();
    const avaiableShips = Game.SHIPS_TYPES;
    for (let ship of avaiableShips) {
      let shipSize = ship.length;
      while (true) {
        let coordinates;
        let randomDirection;
        let column;
        let row;
        try {
          coordinates = Game.generateRandomCoordinate();
          randomDirection =
            Math.floor(Math.random() * 2) === 0 ? "vertical" : "horizontal";
          [column, row] = Gameboard.splitColumnRow(coordinates);
          player.gameboard.placeShip(column, row, shipSize, randomDirection);
          break;
        } catch (error) {
          if (
            error.message.includes("Coordinate already taken") ||
            error.message.includes("Invalid coordinate")
          ) {
            console.error(
              `tried to place at ${coordinates}, separated ${column},${row}, regenerating`
            );
          } else {
            throw error;
          }
        }
      }
    }
  }
  static isPlayerReady(player) {
    const uniqueShipsInstances = new Set(player.gameboard.coordinates.values());
    const cellsOccupied = this.SHIPS_TYPES.reduce((sum, curr) => {
      return curr.length + sum;
    }, 0);
    console.log(cellsOccupied);
    return (
      uniqueShipsInstances.size === this.MAX_SHIPS &&
      player.gameboard.coordinates.size === cellsOccupied
    );
  }
  static allPlayersReady() {
    return this.players.every((player) => this.isPlayerReady(player) === true);
  }
}
//TODO LET GAME HANDLE GAME PHASES
