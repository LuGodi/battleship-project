import Gameboard from "../src/gameboard.js";
import Ship from "../src/ship.js";
const mockFn = jest.fn(console.log("hit was called"));
jest.mock("../src/ship.js", () => {
  return jest.fn().mockImplementation(() => {
    console.log("automocked");
    return { hit: mockFn };
  });
});

test("mock vs automock, no mock implementation version", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip("A", 1, 1); //why is hit being called automatically?
  //why are these two still different ?
  console.log(gameboard.getCoordinate("A", 1)); //returns hit:mockConstructor
  console.log(Ship.mock.instances); //returns mockConstructor {}
  console.log(mockFn.mock.instances);
});

test("should be cleared", () => {
  Ship.mockClear();
  const gameboard = new Gameboard();
  gameboard.placeShip("B", 1, 1);
  console.log(gameboard.getCoordinate("B", 1));
  console.log(Ship.mock.instances);
});
