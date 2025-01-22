// import Gameboard from "./gameboard";
import Player from "./player";

//this will serve as the mediator ?
export default class Game {
  static players = [];
  static stages = ["start", "playerSetup", "playerMove", "gameOver"];

  //first item will be the current player
  static player1;
  static player2;
  static currentPlayer;
  static currentStage;
  static MAX_SHIPS = 5;
  //shouldnt I manage the phases here ?
  static start() {
    //populate the gameboard with predetermined coordinates
    console.log("start game");
    this.currentStage = "start";
    // this.player1 = new Player("real", "p1");
    // this.player2 = new Player("real", "p2");
    Game.players.push(new Player("real", "p1"), new Player("real", "p2"));
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
  static playerMove(attackCoordinates) {
    const [column, row] = attackCoordinates;
    this.currentStage = "playerMove";

    enemyPlayer.gameboard.receiveAttack(attack);
    console.log(
      `${enemyPlayer.gameboard} attack received at ${attackCoordinates}`
    );
    //insert gameovercheck
    Game.switchPlayer();
  }
  static isGameover() {
    const enemyPlayer = Game.getEnemyPlayer();
    return enemyPlayer.gameboard.allSunk();
  }
  static getEnemyPlayer() {
    const [enemyPlayer] = this.players.filter(
      (element) => element !== Game.currentPlayer
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
