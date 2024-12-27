import Gameboard from "../src/gameboard";
import Ship from "../src/ship";
jest.mock("../src/ship.js");
beforeEach(() => {
  Ship.mockClear();
});
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
      // with setCoord mock calls
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
  });
  describe.skip("testing private properties i know i should not but", () => {
    test.skip("increase Horizontal should ... increase column", () => {});
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
      expect(gameboard.missedShots).toContainEqual(["A", 8]);
      expect(gameboard.missedShots).not.toContainEqual(["B", 3]);
    });
    describe.only("should report if all ships sunk", () => {
      beforeAll(() => {
        Ship.mockImplementation(() => {
          return {
            isSunk: () => {
              return true;
            },
          };
        });
      });
      test("should be able to report if all ships have sunk", () => {
        // console.log(Ship.getMockImplementation());

        // console.log(Ship.getMockImplementation());
        // console.log(new Ship(2));
        // const myship = new Ship();
        // console.log(myship);
        // console.log(myship.isSunk());

        console.log(Ship.mock.instances);
        gameboard.placeShip("A", 1, 2, "horizontal");
        const shipInstance = gameboard.getCoordinate("A", 1);
        console.log(shipInstance);
        const shipInstance2 = Ship.mock.instances[0];
        console.log(shipInstance2);
        console.log(shipInstance.isSunk());
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
