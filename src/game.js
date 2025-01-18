// import Gameboard from "./gameboard";
import Player from "./player";

//this will serve as the mediator
export default class Game {
  static players = [];
  //first item will be the current player
  static player1;
  static player2;
  static currentPlayer;
  static MAX_SHIPS = 5;
  //shouldnt I manage the phases here ?
  static start() {
    //populate the gameboard with predetermined coordinates
    console.log("start game");
    // this.player1 = new Player("real", "p1");
    // this.player2 = new Player("real", "p2");
    Game.players.push(new Player("real", "p1"), new Player("real", "p2"));
    [this.player1, this.player2] = this.players;
    Game.currentPlayer = this.player1;
  }
  static getCurrentPlayer() {
    console.log(Game.currentPlayer.name);
    return Game.currentPlayer;
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
    player.gameboard.placeShip("A", 1, 2, "horizontal");
    player.gameboard.placeShip("D", 1, 1, "vertical");
    player.gameboard.placeShip("A", 3, 4, "vertical");
    player.gameboard.placeShip("A", 8, 2, "horizontal");
    player.gameboard.placeShip("A", 10, 2, "horizontal");
  }
  static isPlayerReady(player) {
    const uniqueShipsInstances = new Set(player.gameboard.coordinates.values());
    return uniqueShipsInstances.size === this.MAX_SHIPS;
  }
  static allPlayersReady() {
    return this.players.every((player) => this.isPlayerReady(player) === true);
  }
}
