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
    const gameboard = new Gameboard();
    gameboard.placeShip("J", 9, 1);
    expect(gameboard.coordinates).not.toStrictEqual(newGameboard.coordinates);
    gameboard.clearGameboard();
    console.log(gameboard.coordinates);
    expect(gameboard.coordinates).toStrictEqual(newGameboard.coordinates);
  });
  test("clearGameboard should clear missedShots", () => {
    gameboard.missedShots.push(["A", 9]);
    expect(gameboard.missedShots.length).toBe(1);
    gameboard.clearGameboard();
    expect(gameboard.missedShots.length).toBe(0);
  });
  test("clearGameboard should clear attacksReceived", () => {
    gameboard.attacksReceived.push("A1");
    expect(gameboard.attacksReceived.length).toBe(1);
    gameboard.clearGameboard();
    expect(gameboard.attacksReceived.length).toBe(0);
  });
  test("clearGameboard should return a new reference", () => {
    const old = gameboard.coordinates;
    console.log(old);
    gameboard.clearGameboard();
    expect(old).not.toBe(gameboard.coordinates);
    expect(gameboard.coordinates).toBe(gameboard.coordinates);
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
      gameboard.setCoordinate("C", 9, myObj);
      expect(gameboard.getCoordinate("C", 9)).toBe(myObj);
      expect(gameboard.getCoordinate("A", 1)).toBeUndefined();
      gameboard.setCoordinate("G", 3, "test");
      expect(gameboard.getCoordinate("G", 3)).toBe("test");
    });
    test("set coordinate should not allow to modify the values of that reference", () => {
      gameboard.setCoordinate("A", 2, "test");

      expect(gameboard.getCoordinate("A", 2)).toBe("test");
      expect(() => gameboard.setCoordinate("A", 2, null)).toThrow(
        "Coordinate already taken"
      );
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
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should call Ship constructor", () => {
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
      expect(gameboard.coordinates).toStrictEqual(
        new Map([["A9", shipInstance]])
      );
      expect(gameboard.coordinates.size).toBe(1);
    });
    test("when ship is length 1 should only place it once", () => {
      jest.spyOn(gameboard, "setCoordinate");
      gameboard.placeShip("A", 9, 1);
      const A9 = gameboard.getCoordinate("A", 9);
      expect(gameboard.setCoordinate).toHaveBeenCalledTimes(1);
      jest.clearAllMocks();
    });
    test("should spread ship based on its length through the cells", () => {
      gameboard.placeShip("A", 1, 2, "horizontal");
      console.log;
      const shipInstance = Ship.mock.instances[0];
      //Vou ter que substituir por has se for usar set
      //posso tb por aqui o get
      expect(gameboard.coordinates.has("A1")).toBe(true);
      expect(gameboard.coordinates.has("B1")).toBe(true);
      expect(gameboard.getCoordinate("A", 1)).toBe(shipInstance);
      expect(gameboard.getCoordinate("B", 1)).toBe(shipInstance);
      expect(gameboard.coordinates).toStrictEqual(
        new Map([
          ["A1", shipInstance],
          ["B1", shipInstance],
        ])
      );
    });
    test.each([
      {
        placeShip: {
          column: "A",
          row: 1,
          length: 2,
          direction: "horizontal",
        },
        expectedTimesCalled: 2,
      },
      {
        placeShip: {
          column: "C",
          row: 3,
          length: 4,
          direction: "vertical",
        },
        expectedTimesCalled: 4,
      },
    ])(
      "SetCoordinate should be called the same number of times that ship length has : $placeShip.length, expected times called: $expectedTimesCalled",
      //How could i demonstrate tthis relationship of number of calls = length in a better way?
      ({ placeShip, expectedTimesCalled }) => {
        const setCoord = jest.spyOn(gameboard, "setCoordinate");
        gameboard.placeShip(
          placeShip.column,
          placeShip.row,
          placeShip.length,
          placeShip.direction
        );
        const shipInstance = Ship.mock.instances[0];
        console.log(setCoord.mock.calls);
        expect(setCoord).toHaveBeenCalledTimes(expectedTimesCalled);
        setCoord.mockClear();
        Ship.mockClear();
        // expect(setCoord).toHaveBeenNthCalledWith(1, "A", 1, shipInstance);
        // expect(setCoord).toHaveBeenNthCalledWith(2, "B", 1, shipInstance);

        // expect(setCoord).toHaveBeenCalledWith(column,row,)
      }
    );
    test("should spread vertically as well", () => {
      gameboard.placeShip("B", 3, 2, "vertical");
      const shipInstance = Ship.mock.instances[0];
      expect(gameboard.coordinates.has("B3")).toBe(true);
      expect(gameboard.coordinates.has("B4")).toBe(true);
      expect(gameboard.getCoordinate("B", 3)).toBe(shipInstance);
      expect(gameboard.getCoordinate("B", 4)).toBe(shipInstance);
      expect(gameboard.coordinates).toStrictEqual(
        new Map([
          ["B3", shipInstance],
          ["B4", shipInstance],
        ])
      );
    });
    test("should throw error if spreading is beyond boundaries", () => {
      expect(() => {
        gameboard.placeShip("J", 1, 2, "horizontal");
      }).toThrow();
      //should clean up
      expect(gameboard.coordinates.has("J", 1)).toBe(false);
      expect(gameboard.coordinates.has("K", 1)).toBe(false);
    });
    test("should throw error if spreading beyond boundaries", () => {
      gameboard.placeShip("A", 1, 1);
      const shipInstance = Ship.mock.instances[0];
      const setCoord = jest.spyOn(gameboard, "setCoordinate");
      expect(() => {
        gameboard.placeShip("A", 8, 5, "vertical");
      }).toThrow("A11");
      //TODO implement test that tests all the calls were cleaned
      console.log(setCoord.mock.calls);
      const shipInstanceFailed = Ship.mock.instances[1];
      //should not delete ship at A1
      expect(gameboard.coordinates.has("A1")).toBe(true);
      expect(gameboard.getCoordinate("A", 1)).toBe(shipInstance);
      //should clean up
      expect(gameboard.coordinates.has("A8")).toBe(false);
      expect(gameboard.coordinates.has("A9")).toBe(false);
      expect(gameboard.coordinates.has("A10")).toBe(false);
      expect(gameboard.coordinates.has("A11")).toBe(false);
      console.log(Array.from(gameboard.coordinates.entries()));
    });
    test("should throw error if ship is placed in an invalid coordinate", () => {
      expect(() => gameboard.placeShip("L", 1)).toThrow("Invalid coordinate");
      expect(() => gameboard.placeShip("A", 1)).not.toThrow();
    });
    test("Should throw error if theres a ship already on the location", () => {
      gameboard.placeShip("A", 1);
      expect(() => gameboard.placeShip("A", 1)).toThrow();
    });
    test("Should throw error if ship spreads to a cell already occupied by another ship", () => {
      gameboard.placeShip("A", 3);
      expect(() => gameboard.placeShip("A", 1, 5, "vertical")).toThrow(
        "Coordinate already taken"
      );
    });
    test("After Error is thrown board should return to how it was", () => {
      gameboard.placeShip("A", 3);
      let board = gameboard.coordinates;
      gameboard.placeShip("F", 1);
      let board2 = gameboard.coordinates;
      expect(gameboard.coordinates).not.toBe(board);
      expect(() => gameboard.placeShip("A", 1, 5, "vertical")).toThrow();
      expect(gameboard.coordinates).toBe(board2);
    });
    test("After Error is thrown board should return to how it was", () => {
      gameboard.placeShip("A", 3);
      let board = gameboard.coordinates;
      try {
        gameboard.placeShip("A", 3);
      } catch (e) {
        expect(gameboard.coordinates).toBe(board);
      }
    });
    test.todo(
      "Should reverse the board to how it was before the attempted that threw the error"
    );
  });
  describe("testing utility static methods", () => {
    test("Should convert a coordinate string to a separate row and column", () => {
      expect(Gameboard.splitColumnRow("A1")).toStrictEqual(["A", "1"]);
      expect(Gameboard.splitColumnRow("B9")).toStrictEqual(["B", "9"]);
    });
    test("Should properly convert a two digit row", () => {
      expect(Gameboard.splitColumnRow("A10")).toStrictEqual(["A", "10"]);
    });
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

      expect(gameboard.getCoordinate("A", 8)).toBeUndefined();
      expect(gameboard.missedShots).toContainEqual("A8");
      expect(gameboard.missedShots).not.toContainEqual("B3");
    });
    test("should not call hit if the coordinate was already hit once", () => {
      gameboard.placeShip("A", 1);
      expect(() => gameboard.receiveAttack("A", 1)).not.toThrow();
      expect(Ship.mock.instances[0].hit).toHaveBeenCalledTimes(1);
      expect(() => gameboard.receiveAttack("A", 1)).toThrow(
        "Unable to attack: coordinate has already been hit"
      );
      expect(Ship.mock.instances[0].hit).toHaveBeenCalledTimes(1);
    });
    test("even if its a miss should not be able to attack twice", () => {
      gameboard.receiveAttack("A", 1);
      expect(gameboard.missedShots).toContainEqual("A1");
      expect(() => gameboard.receiveAttack("A", 1)).toThrow(
        "Unable to attack: coordinate has already been hit"
      );
    });
    describe("testing if all sunk", () => {
      beforeEach(() => {
        Ship.mockClear();
        gameboard.clearGameboard();
      });
      afterEach(() => {
        Ship.prototype.isSunk.mockReset();
      });
      test("All sunk should call isSunk on the ship instance, testing with one instance", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip("A", 1, 3);
        const shipInstance = Ship.mock.instances[0];
        expect(Ship).toHaveBeenCalled();
        expect(shipInstance.isSunk).not.toHaveBeenCalled();
        gameboard.allSunk();
        expect(shipInstance.isSunk).toHaveBeenCalled();
      });
      test("should return true if all ships are sunk, testing only one", () => {
        Ship.prototype.isSunk.mockReturnValue(true);
        gameboard.placeShip("A", 1, 2, "horizontal");
        const shipInstance = Ship.mock.instances[0];
        //just to check if mockreturnValue is workin
        // expect(gameboard.getCoordinate("A", 1).isSunk()).toBe(true);
        // expect(gameboard.getCoordinate("B", 1).isSunk()).toBe(true);
        expect(gameboard.allSunk()).toBe(true);
        //its going to get called for every time shipInstance appears on the array, this means will be called the ship`s length number of times
        //will not be called if an instance returns false
        expect(shipInstance.isSunk).toHaveBeenCalledTimes(2);
        expect(Ship.prototype.isSunk).toHaveBeenCalledTimes(2);
      });
      test("should return true if all ships are sunk, more than one ship", () => {
        Ship.prototype.isSunk.mockReturnValue(true);
        gameboard.placeShip("A", 1, 2, "vertical");
        gameboard.placeShip("D", 1, 3, "vertical");
        const shipInstance1 = Ship.mock.instances[0];
        const shipInstance2 = Ship.mock.instances[1];
        expect(Ship.prototype.isSunk).not.toHaveBeenCalled();
        expect(gameboard.allSunk()).toBe(true);
        //I am testing the implementation here, if allSunk changes its implementation
        //the number of times the method is called for each instance will differ
        expect(Ship.prototype.isSunk).toHaveBeenCalledTimes(5);
        expect(shipInstance1.isSunk).toHaveBeenCalledTimes(2);
        expect(shipInstance2.isSunk).toHaveBeenCalledTimes(3);
        console.log(Ship.prototype.isSunk.mock.calls);
        console.log(Ship.prototype.isSunk.mock.results);
        console.log(shipInstance1.isSunk.mock.calls);
        console.log(shipInstance2.isSunk.mock.calls);
      });

      test("should return false if no ships are sunk", () => {
        Ship.prototype.isSunk.mockReturnValue(false);
        gameboard.placeShip("B", 4, 3, "vertical");
        expect(gameboard.allSunk()).toBe(false);
        expect(Ship.prototype.isSunk).toHaveBeenCalledTimes(1);
        gameboard.placeShip("C", 1, 1);
        expect(gameboard.allSunk()).toBe(false);
      });
      test("should return false if only one ship is sunk", () => {
        Ship.prototype.isSunk
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        const gameboard = new Gameboard();
        gameboard.placeShip("A", 1, 5, "vertical");
        gameboard.placeShip("B", 1, 3, "vertical");
        gameboard.placeShip("D", 3, 2, "vertical");
        gameboard.placeShip("F", 3, 2, "vertical");
        expect(gameboard.allSunk()).toBe(false);
        expect(Ship.prototype.isSunk).toHaveBeenCalled();
        //remove this console.log
        console.log(gameboard.coordinates.keys());
        //remove later
        const instance1 = Ship.mock.instances[0];
        const instance2 = Ship.mock.instances[1];
        const instance3 = Ship.mock.instances[2];
        const instance4 = Ship.mock.instances[3];
        console.log(instance1.isSunk.mock.calls);
        console.log(instance2.isSunk.mock.calls);
        console.log(instance3.isSunk.mock.calls);
        console.log(instance4.isSunk.mock.calls);
        console.log(Ship.prototype.isSunk.mock.results);
      });
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
