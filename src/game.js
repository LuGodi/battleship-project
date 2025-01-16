// import Gameboard from "./gameboard";
import Player from "./player";

//this will serve as the mediator
export default class Game {
  static players = [];
  static currentPlayer;
  static start() {
    //populate the gameboard with predetermined coordinates
    console.log("start game");
    const player1 = new Player("real", "p1");
    const player2 = new Player("real", "p2");
    Game.players.push(player1, player2);

    Game.currentPlayer = player1;
  }
  static getCurrentPlayer() {
    console.log(Game.currentPlayer);
    return Game.currentPlayer.name;
  }

  static populatePredetermined(player) {
    console.log("populating player", player.name);
    player.gameboard.placeShip("A", 1, 2, "horizontal");
    player.gameboard.placeShip("D", 1, 1, "vertical");
    player.gameboard.placeShip("A", 3, 4, "vertical");
    player.gameboard.placeShip("A", 8, 2, "horizontal");
  }
}
