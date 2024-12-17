import Gameboard from "../src/gameboard";
import Ship from "../src/ship";
jest.mock("../src/ship.js");
describe("gameboard", () => {
  const gameboard = new Gameboard();
  test("gameboard should be defined", () => {
    expect(gameboard).toBeDefined();
  });
  test("column should have 10 rows", () => {
    expect(gameboard.coordinates["A"].length).toBe(10);
  });
  test("board should have 100 cells", () => {
    let counter = 0;
    for (const key of Object.keys(gameboard.coordinates)) {
      for (const element of gameboard.coordinates[key]) {
        counter++;
      }
    }
    expect(counter).toBe(100);
  });
  test("should add an object to the coordinate", () => {
    gameboard.coordinates["A"][0] = { type: "miss", player: "2" };
  });
  test.only("clearGameboard should make all keys hold only null values", () => {
    const checkIfNull = jest.fn((value) => value === null);
    const isGameboardClean = function () {
      for (const key of Object.keys(gameboard.coordinates)) {
        const rows = gameboard.coordinates[key];
        if (rows.every(checkIfNull) === false) {
          return false;
        }
      }
      return true;
    };
    gameboard.coordinates.J[9] = "different";
    expect(isGameboardClean()).toBeFalsy();
    gameboard.clearGameboard();
    expect(isGameboardClean()).toBeTruthy();
  });
  describe("testing set and get methods for the board", () => {
    test("getter should return correct row which is row -1 becuase arrays are zero indexed", () => {
      console.log(gameboard.getCoordinate("A", 1));
      expect(gameboard.getCoordinate("A", 1)).toBe(
        gameboard.coordinates["A"][0]
      );
      expect(gameboard.getCoordinate("A", 1)).toBeNull();
    });
    test("set coordinate should  allow to modify the values of that reference", () => {
      gameboard.setCoordinate("A", 2, "test");

      expect(gameboard.getCoordinate("A", 2)).toBe("test");
      gameboard.setCoordinate("A", 2, null);
      expect(gameboard.getCoordinate("A", 2)).toBeNull();
    });
  });

  describe("placing ships", () => {
    beforeEach(() => {
      Ship.mockClear();
    });
    test("should call Ship constructor", () => {
      //replace for a mock

      //check if placeship called the constructor

      gameboard.placeShip("A", 9, 1);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(Ship).toHaveBeenCalledWith(1);
    });
    test("should place ship instance at passed coordinates", () => {
      const shipInstance = Ship.mock.instances[0];
      console.log(shipInstance);
      const A9 = gameboard.getCoordinate("A", 9);
      expect(A9).toBeInstanceOf(Ship);
      expect(A9).toBe(shipInstance);
    });
    test.skip("should spread ship based on its length through the cells", () => {});
  });

  describe("hitting ships", () => {
    test("Receive attack method should determine if hit a ship", () => {
      expect(gameboard.receiveAttack("A", 9)).toBe(true);
      //use a mock to determine if ship.hit() has been called
    });
    test("should return false if doesn't hit a ship and coordinates must be recorded", () => {
      expect(gameboard.receiveAttack("A", 8)).toBe(false);
      expect(gameboard.coordinates["A"][7]).toBe("miss");
      expect(gameboard.missedShots).toContainEqual(["A", 8]);
      expect(gameboard.missedShots).not.toContainEqual(["B", 3]);
    });
  });
});
