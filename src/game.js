import Gameboard from "./gameboard";
import Player from "./player";

//this will serve as the mediator
export default class Game {
  static players = [];
  static start() {
    //populate the gameboard with predetermined coordinates
    const player1 = new Player("real");
    const player2 = new Player("real");
    Game.players.push(player1, player2);
    Game.populatePredetermined(player1);
    Game.populatePredetermined(player2);
  }

  static populatePredetermined(player) {
    player.gameboard.placeShip("A", 1, 2, "horizontal");
    player.gameboard.placeShip("D", 1, "vertical");
    player.gameboard.placeShip("A", 3, 4, "vertical");
    player.gameboard.placeShip("A", 8, 2, "horizontal");
  }
}
