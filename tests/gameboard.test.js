import Gameboard from "../src/gameboard";
import Ship from "../src/ship";
jest.mock("../src/ship.js");
describe("gameboard", () => {
  const gameboard = new Gameboard();
  test("gameboard should be defined", () => {
    expect(gameboard).toBeDefined();
  });

  test("clearGameboard should empty the gameboard", () => {
    //is it unit testing if im calling other functions in the tests?
    const newGameboard = new Gameboard();
    gameboard.placeShip("J", 9, 1);
    expect(gameboard.coordinates).not.toStrictEqual(newGameboard.coordinates);
    gameboard.clearGameboard();
    expect(gameboard.coordinates).toStrictEqual(newGameboard.coordinates);
  });
  test("clearGameboard should clear missedShots", () => {
    gameboard.missedShots.push(["A", 9]);
    expect(gameboard.missedShots.length).toBe(1);
    gameboard.clearGameboard();
    expect(gameboard.missedShots.length).toBe(0);
  });
  describe("testing set and get methods for the board", () => {
    beforeEach(() => {
      Ship.mockClear();
      gameboard.clearGameboard();
    });
    test("should not allow beyond the tenth row nor before the 1 row", () => {
      expect(() => gameboard.setCoordinate("A", 11, 1)).toThrow(
        "Invalid coordinate"
      );
      expect(() => gameboard.getCoordinate("A", 11)).toThrow(
        "Invalid coordinate"
      );
      expect(() => gameboard.getCoordinate("A", 1)).not.toThrow();
    });
    test("should not allow beyond J nor before A", () => {
      //TODO refactor this to hold all the expectations on a loop
      expect(() => gameboard.getCoordinate("Z", 1)).toThrow(
        "Invalid coordinate"
      );
      expect(() => gameboard.getCoordinate("J", 2)).not.toThrow(
        "Invalid coordinate"
      );
      expect(() => gameboard.setCoordinate("J", 2, 1)).not.toThrow(
        "Invalid coordinate"
      );
      expect(() => gameboard.setCoordinate("K", 2)).toThrow(
        "Invalid coordinate"
      );
    });
    test("getter should return correct row", () => {
      const myObj = [1];
      gameboard.coordinates["C9"] = myObj;
      expect(gameboard.getCoordinate("C", 9)).toBe(myObj);
      expect(gameboard.getCoordinate("A", 1)).toBeUndefined();
      gameboard.coordinates["G3"] = "test";
      expect(gameboard.getCoordinate("G", 3)).toBe("test");
    });
    test("set coordinate should  allow to modify the values of that reference", () => {
      gameboard.setCoordinate("A", 2, "test");

      expect(gameboard.getCoordinate("A", 2)).toBe("test");
      gameboard.setCoordinate("A", 2, null);
      expect(gameboard.getCoordinate("A", 2)).toBeNull();
    });
    test("reference of the old gameboard and the new gameboard should be different", () => {
      const oldGameboard = gameboard.coordinates;
      gameboard.setCoordinate("B", 3, "test");
      expect(gameboard.coordinates).not.toBe(oldGameboard);
    });
  });

  describe("placing ships", () => {
    beforeEach(() => {
      Ship.mockClear();
      gameboard.clearGameboard();
    });
    test("should call Ship constructor", () => {
      //replace for a mock

      //check if placeship called the constructor

      gameboard.placeShip("A", 9, 1);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(Ship).toHaveBeenCalledWith(1);
    });
    test("should place ship instance at passed coordinates", () => {
      //this test is redudant ?
      //I need to be sure this side effect happens ! Gameboard should be modified
      gameboard.placeShip("A", 9, 1);
      const shipInstance = Ship.mock.instances[0];
      const A9 = gameboard.getCoordinate("A", 9);
      expect(A9).toBeInstanceOf(Ship);
      expect(A9).toBe(shipInstance);
    });
    test.todo("should spread ship based on its length through the cells");
  });

  ////
  describe("hitting ships", () => {
    beforeEach(() => {
      Ship.mockClear();
      gameboard.clearGameboard();
    });
    test("Receive attack method should determine if hit a ship", () => {
      //use a mock to determine if ship.hit() has been called
      gameboard.placeShip("J", 1, 1);
      const shipInstance = Ship.mock.instances[0];
      expect(gameboard.receiveAttack("J", 1)).toBe(true);
      expect(shipInstance.hit).toHaveBeenCalledTimes(1);
    });
    test("should return false if doesn't hit a ship and coordinates must be recorded", () => {
      expect(gameboard.receiveAttack("A", 8)).toBe(false);
    });
    test("ship and coordinates must be recorded if missed", () => {
      gameboard.receiveAttack("A", 8);
      expect(gameboard.getCoordinate("A", 8)).toBe("miss");
      expect(gameboard.missedShots).toContainEqual(["A", 8]);
      expect(gameboard.missedShots).not.toContainEqual(["B", 3]);
    });
  });
});

describe.skip("use case tests", () => {});

test.skip("testing against empty object ", () => {
  const myObj1 = { a: 5 };
  const myObj2 = { a: 5 };
  expect({ a: 2 }).not.toStrictEqual({});
  expect({}).toStrictEqual({});
  expect(myObj1).toStrictEqual(myObj2);
});
