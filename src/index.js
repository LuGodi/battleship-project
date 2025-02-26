console.log("hi");

import Game from "./game.js";
import "./style.css";
import { BoardRenderer, Render } from "./render.js";

const mainContainer = document.querySelector("body");

// mainContainer.append(currentPlayerBoard.init(10, 10, "board-container"));
// mainContainer.append(enemyPlayerBoard.init(10, 10, "board-container"));
console.log(Game.SHIP_MAX_SIZE);
Render.gameStartScreen();
