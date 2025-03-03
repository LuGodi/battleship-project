/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var a=e.g.document;if(!t&&a&&(a.currentScript&&"SCRIPT"===a.currentScript.tagName.toUpperCase()&&(t=a.currentScript.src),!t)){var r=a.getElementsByTagName("script");if(r.length)for(var s=r.length-1;s>-1&&(!t||!/^http(s?):/.test(t));)t=r[s--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})();class t{#e=0;#t=!1;#a;constructor(e){if(void 0===e||!1===Number.isInteger(e))throw new Error("Lenght must be provided");this.length=e}hit(){this.#e++}isSunk(){return this.#e>=this.length}setDirection(e){this.#a=e}getDirection(){return this.#a}}class a{missedShots=[];attacksReceived=[];coordinates;constructor(){this.coordinates=new Map}static splitColumnRow(e){const[t,a]=[e[0],e.substring(1)];return[t,a]}clearGameboard(){this.coordinates=this.#r(this.coordinates),this.missedShots=this.#r(this.missedShots),this.attacksReceived=this.#r(this.attacksReceived)}#r(e){let t;switch(e.constructor.name){case"Array":t=[];break;case"Object":t={};break;case"Map":t=new Map;break;default:throw new TypeError("Value should be an array or an object literal")}return t}#s(e,t){const a=this.#n(e,t);return this.coordinates.has(a)}getCoordinate(e,t){if(!1===this.#i(e,t))throw new Error(`Invalid coordinate at ${t}`);const a=this.#n(e,t);return this.coordinates.get(a)}updateCoordinate(e,t,a){throw new Error("Not implemented")}setCoordinate(e,t,a){if(!1===this.#i(e,t))throw new Error("Invalid coordinate",{cause:{column:e,row:t}});if(!0===this.#s(e,t))throw new Error("Coordinate already taken, to overwrite use updateCoordinate",{cause:{column:e,row:t}});const r=new Map(this.coordinates),s=this.#n(e,t);r.set(s,a),this.coordinates=r}#n(e,t){return e+t.toString()}placeShip(e,a,r,s="horizontal"){if("horizontal"!==s&&"vertical"!==s)throw new Error("Invalid direction: should be horizontal or vertical");const n=new t(r),i=this.coordinates;try{this.setCoordinate(e,a,n),n.setDirection(s),this.#o(e,a,n,s,r)}catch(e){throw"Invalid coordinate"!==e.message&&"Coordinate already taken"!==e.message||(this.coordinates=i),new Error(`${e.message} at ${e.cause.column}${e.cause.row}`)}}#o(e,t,a,r,s){let n=1;for(;n<s;)"horizontal"===r?e=this.#c(e):t=this.#d(t),n++,this.setCoordinate(e,t,a)}receiveAttack(e,a){const r=this.#n(e,a),s=this.getCoordinate(e,a);if(!0===this.attacksReceived.concat(this.missedShots).includes(r))throw new Error(`Unable to attack: coordinate has already been hit at ${e}${a}`);return s instanceof t?(s.hit(),this.#l(e,a),!0):(this.#h(e,a),!1)}allSunk(){return!(this.coordinates.size<1)&&Array.from(this.coordinates.values()).every((e=>!0===e.isSunk()))}static getRandomCoordinate(){}#h(e,t){const a=[...this.missedShots];a.push(this.#n(e,t)),this.missedShots=a}#l(e,t){const a=[...this.attacksReceived];a.push(this.#n(e,t)),this.attacksReceived=a}#i(e,t){return!0===this.#m(t)&&!0===this.#p(e)}#m(e){return!(e>10||e<1)}#p(e){return/[A-J]/.test(e)}#c(e){const t=e.charCodeAt(0);return String.fromCharCode(t+1)}#d(e){return Number.parseInt(e)+1}}class r{#u=null;name;gameboard;constructor(e,t){this.gameboard=new a,this.name=t,e&&(this.type=e)}set type(e){if("real"!==e&&"computer"!==e)throw new TypeError("Playertype should be computer or real");this.#u=e}get type(){return this.#u}}class s{#g="hit";#y="missed";#S="sunk";#v;constructor(){this.#v=this.buildLoggerEl()}getLogger(){return this.#v}buildLoggerEl(){document.createElement("div");const e=document.createElement("div");return e.classList.add("log-container"),e}logMessage(e,t,a){const r=document.createElement("span");r.classList.add("log-message"),r.classList.add(`log-${t}`),r.dataset.playerName=a||"",r.textContent=e,this.getLogger().insertBefore(r,this.getLogger().firstChild)}logAttack(e,t,a,r,s=!1){let n=`${e} attacked coordinates ${a} and `;n+=!0===r?`successfully ${this.#g} ${!0===s?"and sunk":""} ${t}'s Ship`:`${this.#y} ${t}'s Ships`,this.logMessage(n,"attack",e)}logStatus(e,{enemyPlayer:t,sunkShips:a,dealtAttacks:r,missedHits:s}){let n=`${e.name} Status: \n\n    Enemy ships sunk: ${a} \n\n    Attacks Dealt: ${r}\n\n    Missed Hits: ${s}\n\n    `;this.logMessage(n,"status")}}class n{static players=[];static stages=["start","playerSetup","playerMove","gameOver"];static gameover=!1;static logger=new s;static player1;static player2;static currentPlayer;static currentStage;static SHIPS_TYPES=[{name:"Carrier",length:5},{name:"Battleship",length:4},{name:"Destroyer",length:3},{name:"Submarine",length:3},{name:"Patrol Boat",length:2}];static MAX_SHIPS=this.SHIPS_TYPES.length;static get SHIP_MAX_SIZE(){let e=0;for(let{length:t}of n.SHIPS_TYPES)e=t>e?t:e;return e}static start(e=1){return this.currentStage="start",1===e?n.players.push(new r("real","Player"),new r("computer","Computer")):n.players.push(new r("real","Player 1"),new r("real","Player 2")),[this.player1,this.player2]=this.players,n.currentPlayer=this.player1,this.currentStage="playerSetup"}static playerSetup(e){if(this.currentStage="playerSetup",!0===n.allPlayersReady())return this.currentStage="playerMove",n.switchPlayer(),this.currentStage;const t=n.currentPlayer;if(!0===n.isPlayerReady(t))return n.switchPlayer(),this.currentStage;throw new Error("Player is not ready")}static playerMove(e,t=0){const[a,r]=[e[0],e.substring(1)];this.currentStage="playerMove";const s=this.getEnemyPlayer(),i=s.gameboard.receiveAttack(a,r),o=!1!==i&&s.gameboard.getCoordinate(a,r).isSunk();return this.logger.logAttack(this.getCurrentPlayer().name,this.getEnemyPlayer().name,e,i,o),this.isGameover()?(this.currentStage="gameOver",this.currentStage):(n.switchPlayer(),this.currentStage)}static computerPlayerMove(){let e;for(;;)try{return e=n.generateRandomCoordinate(),n.playerMove(e)}catch(e){if(!1===e.message.includes("coordinate has already been hit"))throw e}}static generateRandomCoordinate(){const e=Math.floor(10*Math.random()+1);return["A","B","C","D","E","F","G","H","I","J"][Math.floor(10*Math.random()+1)-1].concat(e)}static isGameover(){return this.gameover=this.players.some((e=>!0===e.gameboard.allSunk())),this.gameover}static finalStatus(e){const[t]=this.players.filter((t=>t!==e)),a=t.gameboard,r=Array.from(new Set(a.coordinates.values())).filter((e=>!0===e.isSunk())),s={player:e,attacksReceived:a.attacksReceived.length,missedShotsReceived:a.missedShots.length,sunkShips:r.length};this.logger.logStatus(e,{enemyPlayer:t,sunkShips:s.sunkShips,dealtAttacks:s.attacksReceived,missedHits:s.missedShotsReceived})}static getWinner(){if(!1===this.gameover)return;const[e]=this.players.filter((e=>!1===e.gameboard.allSunk()));return e}static getEnemyPlayer(){const[e]=this.players.filter((e=>e!==n.getCurrentPlayer()));return e}static getCurrentPlayer(){return n.currentPlayer}static getCurrentStage(){return n.currentStage}static switchPlayer(){this.currentPlayer,this.currentPlayer=this.currentPlayer===this.player1?this.player2:this.player1}static populatePredetermined(e,t){e.gameboard.clearGameboard();const a=[["A",1,5,"horizontal"],["D",5,3,"vertical"],["A",3,4,"vertical"],["A",8,3,"horizontal"],["A",10,2,"horizontal"]];for(const e of a)n.getCurrentPlayer().gameboard.placeShip(...e)}static populateGameboard(e){e.gameboard.clearGameboard();const t=n.SHIPS_TYPES;for(let r of t){let t=r.length;for(;;){let r,s,i,o;try{r=n.generateRandomCoordinate(),s=0===Math.floor(2*Math.random())?"vertical":"horizontal",[i,o]=a.splitColumnRow(r),e.gameboard.placeShip(i,o,t,s);break}catch(e){if(!e.message.includes("Coordinate already taken")&&!e.message.includes("Invalid coordinate"))throw e}}}}static isPlayerReady(e){const t=new Set(e.gameboard.coordinates.values()),a=this.SHIPS_TYPES.reduce(((e,t)=>t.length+e),0);return t.size===this.MAX_SHIPS&&e.gameboard.coordinates.size===a}static allPlayersReady(){return this.players.every((e=>!0===this.isPlayerReady(e)))}}class i{static#f="";static dragstartEvent(e,t){return i.#f="",function(a){a.dataTransfer.setData("shipName",e),a.dataTransfer.setData("shipLength",t),a.dataTransfer.setData("shipDirection",a.target.nextSibling.dataset.direction)}}static dragendHandler(e){"move"===e.dataTransfer.dropEffect&&"Success"===i.#f?(e.target.parentElement.remove(),console.log("dragend success")):console.log("dragend failed")}static dropEventHandler(e){e.preventDefault();const[t,a]=[e.target.dataset.coordinates[0],e.target.dataset.coordinates.substring(1)],r=Number.parseInt(e.dataTransfer.getData("shipLength")),s=(e.dataTransfer.getData("shipName"),e.dataTransfer.getData("shipDirection"));try{this.player.gameboard.placeShip(t,a,r,s),this.updateBoard()}catch(t){if(t.message.includes("Invalid coordinate")||t.message.includes("Coordinate already taken"))return i.#f="Fail",void(e.dataTransfer.dropEffect="none");throw t}i.#f="Success"}static dragoverEventHandler(e){void 0!==e.target.dataset.coordinates?(e.preventDefault(),e.dataTransfer.dropEffect="move"):console.log("dragover aborting")}}const o=e.p+"99cc491f1ba960794488.png",c=e.p+"3f2f5c67c0210e1d66cc.png",d=(e.p,e.p+"2e087eaee21503e9b7b1.png"),l=e.p+"923eb4443d081f19521e.png",h=e.p+"214862dd5368b2da7f3a.png",m=e.p+"f443bf206ccc4f176c05.png",p=e.p+"d4a559196644063265a2.png",u=e.p+"bf89cfa7e48c6dd8269b.png";class g{rows;columns;className;renderedBoard;player;grouped=null;static TIME_FOR_HIT_FEEDBACK=1200;static shipParts={verticalMiddle:u,verticalStart:m,verticalEnd:l,horizontalStart:h,horizontalEnd:d,horizontalMiddle:p};constructor(e,t=10,a=10,r="board-container"){this.rows=t,this.columns=a,this.className=r,this.player=e,this.init(t,a,r),g.preloadImgs()}static preloadImgs(){Object.values(this.shipParts).forEach((e=>{(new Image).src=e}))}init(){const e=this.rows,t=this.columns,a=this.className,r=[];for(let a=0;a<=e;a++)for(let e=0;e<=t;e++){const t=document.createElement("div");t.dataset.column=e,t.dataset.row=a,t.dataset.isLabel=!0,a>0&&e>0&&(t.dataset.isLabel=!1,t.dataset.coordinates=`${"ABCDEFGHIJ"[e-1]}${a}`),r.push(t)}const s=S.makeElement("div",a,...r);s.dataset.player=this.player.name,this.renderedBoard=s}highlightBoard(e){!0===e?this.renderedBoard.classList.add("highlight"):this.renderedBoard.classList.remove("highlight")}getRenderedBoard(){return this.renderedBoard}initListener(){this.getRenderedBoard().addEventListener("click",this)}amIEnemy(){return n.getEnemyPlayer()===this.player}updateBoard(){this.grouped=this.groupCoordinatesByInstance(),!0!==this.amIEnemy()?this.allyView():this.enemyView()}revealBoard(){this.allyView()}enemyView(e){this.renderedBoard.dataset.playerStatus="enemy",this.highlightBoard(!0);const t=this.player.gameboard.missedShots,a=this.player.gameboard.attacksReceived;this.loopBoard((e=>{if(t.includes(e.dataset.coordinates)){const t=new Image;t.src=c,e.replaceChildren(t)}else if(a.includes(e.dataset.coordinates)){const t=new Image;t.src=o,e.replaceChildren(t)}else e.replaceChildren()}))}allyView(e){this.renderedBoard.dataset.playerStatus="ally",this.highlightBoard(!1),this.loopBoard((e=>{if(this.player.gameboard.attacksReceived.includes(e.dataset.coordinates)){const t=new Image;t.src=o,e.replaceChildren(t)}else if(this.player.gameboard.missedShots.includes(e.dataset.coordinates)){const t=new Image;t.src=c,e.replaceChildren(t)}else this.player.gameboard.coordinates.has(e.dataset.coordinates)?e.replaceChildren(this.renderShip(e.dataset.coordinates)):e.replaceChildren()}))}clickBoardEvent(e){if(!0===this.amIEnemy())return e.target.dataset.coordinates}loopBoard(e){for(let t of this.renderedBoard.children)"true"!==t.dataset.isLabel&&e(t)}handleEvent(e){if(void 0!==e.target.dataset.coordinates&&("drop"===e.type&&this.dropEventHandler(e),"dragover"===e.type&&this.dragoverEventHandler(e),"click"===e.type&&"playerMove"===n.getCurrentStage()&&!0===this.amIEnemy())){const t=this.clickBoardEvent(e),a=n.playerMove(t);this.getRenderedBoard().removeEventListener("click",this),this.enemyView(),setTimeout((()=>{"computer"===this.player.type?y.nextScreen(y[a+"Screen"]):y.switchingPlayerScreen(y[a+"Screen"])}),g.TIME_FOR_HIT_FEEDBACK)}}dropEventHandler(e){"playerSetup"===n.getCurrentStage()&&i.dropEventHandler.call(this,e)}dragoverEventHandler(e){i.dragoverEventHandler.call(this,e)}groupCoordinatesByInstance(){const e=this.player.gameboard,t=new Map;for(let[a,r]of e.coordinates)!0===t.has(r)?t.get(r).push(a):t.set(r,[a]);return t}renderShip(e){const t=this.grouped,a=this.player.gameboard.coordinates;if(a.has(e)){const r=a.get(e),s=t.get(r),n=this.#E(s,r.getDirection(),e),i=new Image;return i.src=n,i}}#E(e,t,a){const r=e.indexOf(a),s=e.length-r;return 1===s?g.shipParts[t+"End"]:s===e.length?g.shipParts[t+"Start"]:g.shipParts[t+"Middle"]}}class y{static cachedDom={body:document.querySelector("body"),statusNav:document.querySelector(".header"),mainContainer:document.querySelector(".main-container"),domBoards:[],logger:null};static setHeader(e){this.cachedDom.statusNav.textContent=e}static pastMovesList(){}static gameStartScreen(){const e=document.createElement("button"),t=document.createElement("button");e.classList.add("one-player-button"),t.classList.add("two-player-button"),e.textContent="One player Mode",t.textContent="Two players Mode",e.addEventListener("click",(e=>{const t=n.start(1);y.cachedDom.mainContainer.classList.remove("game-start-phase"),y.nextScreen(y[t+"Screen"])})),t.addEventListener("click",(e=>{const t=n.start(2);y.cachedDom.mainContainer.classList.remove("game-start-phase"),y.nextScreen(y[t+"Screen"])})),y.cachedDom.mainContainer.replaceChildren(e,t),y.cachedDom.mainContainer.classList.add("game-start-phase"),this.cachedDom.statusNav.textContent="BattleShip"}static updateCachedBoards(){return this.cachedDom.domBoards.forEach((e=>e.updateBoard())),this.cachedDom.domBoards}static playerSetupScreen(e){this.cachedDom.mainContainer.classList.add("player-setup-phase");const t=new g(n.getCurrentPlayer());if("computer"===n.getCurrentPlayer().type)return n.populateGameboard(n.getCurrentPlayer()),void c();y.setHeader(`${n.getCurrentPlayer().name}'s Turn - Setup Phase`);const a=S.makeElement("div","ship-placement-container"),r=S.makeShipsMenu(n.SHIPS_TYPES),s=document.createElement("button"),i=document.createElement("button"),o=document.createElement("button");function c(e){const a=n.playerSetup();y.cachedDom.domBoards.push(t),y.cachedDom.mainContainer.classList.remove("player-setup-phase"),y.switchingPlayerScreen(y[a+"Screen"],500)}o.textContent="Reset",s.textContent=`Populate ${n.getCurrentPlayer().name} board`,i.textContent="Done",o.addEventListener("click",(e=>{n.currentPlayer.gameboard.clearGameboard(),t.updateBoard(),this.playerSetupScreen(n.getCurrentPlayer())})),s.addEventListener("click",(()=>{n.populateGameboard(n.getCurrentPlayer()),a.querySelectorAll(".ship-info-container").forEach((e=>e.remove())),t.updateBoard()})),i.addEventListener("click",c),a.append(r,o,s,i),t.getRenderedBoard().addEventListener("drop",t),t.getRenderedBoard().addEventListener("dragover",t),this.cachedDom.mainContainer.replaceChildren(a,t.getRenderedBoard())}static async nextScreen(e,t=0){return new Promise((a=>{setTimeout((()=>{e.call(this)}),t)}))}static async switchingPlayerScreen(e,t=500){const a=document.createElement("p");a.textContent="Switching players, please hold . . . ",this.cachedDom.statusNav.textContent=`Switching from ${n.getEnemyPlayer().name} to ${n.getCurrentPlayer().name}`,y.cachedDom.mainContainer.replaceChildren(a),await y.nextScreen(e,t)}static playerMoveScreen(){if(this.setHeader(`${n.getCurrentPlayer().name}'s Turn`),null===this.cachedDom.logger){const e=n.logger;this.cachedDom.logger=e,this.cachedDom.body.append(e.getLogger())}if(this.cachedDom.mainContainer.classList.add("player-move-phase"),"computer"===n.currentPlayer.type){let e,t;this.cachedDom.domBoards.forEach((a=>{"computer"===a.player.type?t=a:e=a})),e.highlightBoard(!0),t.getRenderedBoard().classList.add("dim");const a=n.computerPlayerMove();return void setTimeout((()=>{e.highlightBoard(!1),t.getRenderedBoard().classList.remove("dim"),y[a+"Screen"]()}),g.TIME_FOR_HIT_FEEDBACK)}const[e,t]=this.updateCachedBoards(),a=S.makeBoardContainers(e,t);this.cachedDom.mainContainer.replaceChildren(a);const[r]=this.cachedDom.domBoards.filter((e=>!0===e.amIEnemy()));r.getRenderedBoard().addEventListener("click",r)}static gameOverScreen(){this.cachedDom.mainContainer.classList.remove("player-move-phase");const[e,t]=this.cachedDom.domBoards;e.revealBoard(),t.revealBoard(),y.cachedDom.mainContainer.replaceChildren(e.getRenderedBoard(),t.getRenderedBoard()),n.finalStatus(n.getCurrentPlayer()),n.finalStatus(n.getEnemyPlayer()),y.setHeader(`${n.getWinner().name} is the winner`)}}class S{static makeElement(e,t,...a){const r=document.createElement(e);return r.classList.add(t),a&&r.append(...a),r}static makeBoardContainers(e,t){const a=S.makeElement("div","board-containers"),r=S.makeElement("span","board-header-info"),s=S.makeElement("span","board-header-info");r.textContent=e.player.name,s.textContent=t.player.name;const n=S.makeElement("div","board-information",r,e.getRenderedBoard()),i=S.makeElement("div","board-information",s,t.getRenderedBoard());return a.replaceChildren(n,i),a}static makeShipsMenu(e){const t=[];for(let{name:a,length:r}of e){let e="horizontal";const s=this.makeShipMenuImgs(r,e);s.draggable=!0;const n=this.makeElement("p","ship-name"),o=this.makeElement("p","ship-length"),c=this.makeElement("p","ship-direction");n.textContent=a,o.textContent=r,c.textContent=e,s.addEventListener("dragstart",i.dragstartEvent(a,r)),s.addEventListener("dragend",i.dragendHandler);const d=this.makeElement("div","ship-info",n,o,c);d.dataset.direction=e,d.addEventListener("click",(e=>{e.currentTarget.dataset.direction="horizontal"===e.currentTarget.dataset.direction?"vertical":"horizontal",e.currentTarget.lastElementChild.innerText=e.currentTarget.dataset.direction})),t.push(this.makeElement("div","ship-info-container",s,d))}return this.makeElement("div","ships-menu",...t)}static makeShipMenuImgs(e,t){document.documentElement.style.setProperty("--max-ship-size",n.SHIP_MAX_SIZE);const a=S.makeElement("div","ship-parts-view");for(let r=0;r<e;r++){const s=new Image;s.src=0===r?g.shipParts[t+"Start"]:r===e-1?g.shipParts[t+"End"]:g.shipParts[t+"Middle"],a.append(s)}return a}}document.querySelector("body"),y.gameStartScreen()})();
//# sourceMappingURL=main.js.map