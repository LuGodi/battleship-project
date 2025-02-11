// import Gameboard from "./gameboard";
import Player from "./player";

//this will serve as the mediator ?
export default class Game {
  static players = [];
  static stages = ["start", "playerSetup", "playerMove", "gameOver"];
  static gameover = false;

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
  static start() {
    //populate the gameboard with predetermined coordinates
    console.log("start game");
    this.currentStage = "start";
    // this.player1 = new Player("real", "p1");
    // this.player2 = new Player("real", "p2");
    Game.players.push(new Player("real", "p1"), new Player("computer", "p2"));
    [this.player1, this.player2] = this.players;
    Game.currentPlayer = this.player1;
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
    }
  }

  //I should decide if it gets column,row or coordinates
  static playerMove(attackCoordinates, waitTime = 0) {
    const [column, row] = [
      attackCoordinates[0],
      attackCoordinates.substring(1),
    ];
    this.currentStage = "playerMove";
    const enemyPlayer = this.getEnemyPlayer();
    const hit = enemyPlayer.gameboard.receiveAttack(column, row);
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
  static populatePredetermined(player) {
    console.log("populating player", player.name);

    const predeterminedCoord = [
      ["A", 1, 2, "horizontal"],
      ["D", 1, 1, "vertical"],
      ["A", 3, 4, "vertical"],
      ["A", 8, 2, "horizontal"],
      ["A", 10, 2, "horizontal"],
    ];
    for (const coord of predeterminedCoord) {
      Game.getCurrentPlayer().gameboard.placeShip(...coord);
    }
  }
  static populateGameboard() {}
  static isPlayerReady(player) {
    const uniqueShipsInstances = new Set(player.gameboard.coordinates.values());
    return uniqueShipsInstances.size === this.MAX_SHIPS;
  }
  static allPlayersReady() {
    return this.players.every((player) => this.isPlayerReady(player) === true);
  }
}
//TODO LET GAME HANDLE GAME PHASES
