console.log("hi");

import Game from "./game.js";
import "./style.css";
import { Board } from "./render.js";

const mainContainer = document.querySelector("body");
console.log(mainContainer);
const currentPlayerBoard = new Board();
const enemyPlayerBoard = new Board();
mainContainer.append(currentPlayerBoard.init(10, 10, "board-container"));
mainContainer.append(enemyPlayerBoard.init(10, 10, "board-container"));
