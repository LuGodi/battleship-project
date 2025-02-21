import "./logger.css";
export default class Logger {
  #hitMessage = "hit";
  #missMessage = "missed";
  #sunkMessage = "sunk";
  #element;
  constructor() {
    this.#element = this.buildLoggerEl();
  }
  getLogger() {
    return this.#element;
  }
  buildLoggerEl() {
    const logContainer = document.createElement("div");
    logContainer.classList.add("log-container");
    return logContainer;
  }
  //   setAttackMessage(message="hit"){
  //     return message
  //   }
  //   setMissMessage(message)
  logAttack(currPlayer, targetPlayer, coordinates, boolHit, sunk = false) {
    const messageEl = document.createElement("span");
    messageEl.classList.add("log-message");
    let message;
    if (boolHit === true) {
      message = `${currPlayer} successfully ${
        this.#hitMessage
      } ${coordinates} ${
        sunk === true ? "and sunk" : ""
      } ${targetPlayer}'s Ship`;
    } else {
      message = `${currPlayer} ${this.#missMessage} ${targetPlayer}'s Ships`;
    }
    messageEl.textContent = message;
    this.getLogger().appendChild(messageEl);
  }
  //TODO
  logStatus(currPlayer, enemyPlayer) {
    currPlayer.name;
  }
}
