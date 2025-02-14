import Ship from "../src/ship.js";

describe("ship", () => {
  const myShip = new Ship(5);
  test("should not be undefined", () => {
    expect(myShip).toBeDefined();
  });
  test("should be instance of ship", () => {
    expect(myShip).toBeInstanceOf(Ship);
  });
  describe("ships properties", () => {
    test("should have length attribute", () => {
      expect(myShip).toHaveProperty("length");
      expect(myShip.length).toBe(5);
    });

    test("should be sunk if number of hits is equal or higher than timesHit", () => {
      expect(myShip.isSunk()).toBe(false);
      for (let i = 0; i < myShip.length; i++) {
        myShip.hit();
      }
      expect(myShip.isSunk()).toBe(true);
    });
    test("should have a direction property", () => {
      myShip.setDirection("vertical");
      expect(myShip.getDirection()).toBe("vertical");
      myShip.setDirection("horizontal");
      expect(myShip.getDirection()).toBe("horizontal");
    });
    test.todo("should be sealed");
  });
  test("should throw error if length is not provided", () => {
    expect(() => new Ship()).toThrow();
  });
  test("should throw error if length is not a int", () => {
    expect(() => new Ship("a")).toThrow();
    expect(() => new Ship(4.5)).toThrow();
  });
});
