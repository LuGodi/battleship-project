export default class DragAndDrop {
  static #dropStatus = "";
  static dragstartEvent(shipName, shipLength) {
    DragAndDrop.#dropStatus = "";

    return function dragEventHandler(e) {
      e.dataTransfer.setData("shipName", shipName);
      e.dataTransfer.setData("shipLength", shipLength);
      e.dataTransfer.setData(
        "shipDirection",
        e.target.nextSibling.dataset.direction
      );

      // e.dataTransfer.setDragImage(e.target, 40, 40);
    };
  }
  static dragendHandler(e) {
    if (
      e.dataTransfer.dropEffect === "move" &&
      DragAndDrop.#dropStatus === "Success"
    ) {
      e.target.parentElement.remove();
      console.log("dragend success");
    } else {
      console.log("dragend failed");
    }
  }

  static dropEventHandler(event) {
    //TODO can I put the remove event listener here ?

    event.preventDefault();

    const [col, row] = [
      event.target.dataset.coordinates[0],
      event.target.dataset.coordinates.substring(1),
    ];
    const shipLen = Number.parseInt(event.dataTransfer.getData("shipLength"));
    const shipName = event.dataTransfer.getData("shipName");
    const shipDirection = event.dataTransfer.getData("shipDirection");
    //TOFIX: if ship was already placed, position should be updated instead of placing another copy
    //FIXED: WHEN PASSING A DIRECTION OTHER THAN HORIZONTAL A 1 GETS ADDED
    //TOFIX: When failing placing the ship, shouldnt interrupt the whole program anymore
    try {
      this.player.gameboard.placeShip(col, row, shipLen, shipDirection);
      this.updateBoard();
    } catch (err) {
      if (
        err.message.includes("Invalid coordinate") ||
        err.message.includes("Coordinate already taken")
      ) {
        //this is not going to work, dropEffect cant be changed on drop
        DragAndDrop.#dropStatus = "Fail";
        event.dataTransfer.dropEffect = "none";
        return;
      }
      throw err;
      //notify logger
    }
    DragAndDrop.#dropStatus = "Success";
    // event.dataTransfer.dropEffect = "move";

    //I can either make it unable to drag after placing or
    //implement something that removes the ship

    //Dragend fires an event at the object that was being dragged, i can use it to remove the drag
    //or I can make an array that controls
  }
  static dragoverEventHandler(event) {
    if (event.target.dataset.coordinates === undefined) {
      console.log("dragover aborting");
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
}
