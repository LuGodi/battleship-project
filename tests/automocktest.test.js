import Gameboard from "../src/gameboard.js";
import Ship from "../src/ship.js";
const mockFn = jest.fn(() => console.log("hit was called"));
jest.mock("../src/ship.js");
// beforeEach(()=>{
//   Ship.mockClear()
// })
test("mock vs automock, no mock implementation version", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip("A", 1, 1); //why is hit being called automatically?
  //why are these two still different ?
  console.log(gameboard.getCoordinate("A", 1)); //returns hit:mockConstructor
  console.log(Ship.mock.instances); //returns mockConstructor {}

  // Ship.mockImplementation(() => {
  //   return {
  //     Ship,
  //     isSunk: () => false,
  //   };
  // });

  gameboard.placeShip("B", 1, 1);
  console.log(gameboard.getCoordinate("B", 1));
  console.log(Ship.mock.instances[1]);

  console.log(Ship.prototype.isSunk);
  console.log(jest.isMockFunction(Ship.prototype.isSunk));
  Ship.prototype.isSunk.mockReturnValue(false); // this is what I want, it keeps the implementation of the automock but replaces just for one function
  console.log(Ship.mock.instances[0].isSunk());
});

test.skip("should be cleared", () => {
  Ship.mockClear();
  jest.clearAllMocks();
  jest.resetAllMocks();
  const gameboard = new Gameboard();
  gameboard.placeShip("B", 1, 1);
  console.log(gameboard.getCoordinate("B", 1));
  console.log(Ship.mock.instances);
});

test("ship prototype is Sunk should go back to normal", () => {
  Ship.mockClear();
  jest.clearAllMocks();
  jest.resetAllMocks(); // this is the one that resets the implementation
  const gameboard = new Gameboard();
  gameboard.placeShip("C", 1, 1);
  console.log(Ship.mock.instances.length);
  const shipInstance = Ship.mock.instances[0];
  console.log(shipInstance.isSunk());
});
