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
    const logHeader = document.createElement("div");
    const logContainer = document.createElement("div");
    // logHeader.classList.add("log-header");
    logContainer.classList.add("log-container");
    // logHeader.append(logContainer);
    return logContainer;
  }
  //   setAttackMessage(message="hit"){
  //     return message
  //   }
  //   setMissMessage(message)
  logMessage(message, type, playerName) {
    const spanEl = document.createElement("span");
    spanEl.classList.add("log-message");
    spanEl.classList.add(`log-${type}`);
    spanEl.dataset.playerName = playerName ? playerName : "";
    spanEl.textContent = message;
    this.getLogger().insertBefore(spanEl, this.getLogger().firstChild);
  }
  logAttack(currPlayer, targetPlayer, coordinates, boolHit, sunk = false) {
    // const messageEl = document.createElement("span");
    // messageEl.classList.add("log-message");
    let message = `${currPlayer} attacked coordinates ${coordinates} and `;
    if (boolHit === true) {
      message += `successfully ${this.#hitMessage} ${
        sunk === true ? "and sunk" : ""
      } ${targetPlayer}'s Ship`;
    } else {
      message += `${this.#missMessage} ${targetPlayer}'s Ships`;
    }
    this.logMessage(message, "attack", currPlayer);
    // messageEl.textContent = message;
    // this.getLogger().appendChild(messageEl);
  }
  //TODO
  logStatus(currPlayer, { enemyPlayer, sunkShips, dealtAttacks, missedHits }) {
    let message = `${currPlayer.name} Status: \n
    Enemy ships sunk: ${sunkShips} \n
    Attacks Dealt: ${dealtAttacks}\n
    Missed Hits: ${missedHits}\n
    `;
    this.logMessage(message, "status");
  }
}
