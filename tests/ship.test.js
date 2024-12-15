import Ship from "../src/ship.js";

describe("ship", () => {
  test("should not be undefined", () => {
    expect(new Ship()).toBeDefined();
  });
  test("should be instance of ship", () => {
    expect(new Ship()).toBeInstanceOf(Ship);
  });
  describe("ships properties", () => {
    const myShip = new Ship(5);
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
    test.todo("should be sealed");
  });
});
