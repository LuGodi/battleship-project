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
    test("should have sunk property", () => {
      expect(myShip).toHaveProperty("sunk");
    });
    test("sunk property should be a boolean", () => {
      expect(typeof myShip.sunk).toBe("boolean");
    });
    test("should have timesHit property", () => {
      expect(myShip).toHaveProperty("timesHit");
    });
    test("should have hit method that increases number of times hit", () => {
      console.log(myShip);
      expect(myShip.timesHit).toBe(0);
      myShip.hit();
      expect(myShip.timesHit).toBe(1);
    });
    test("should be sunk if number of hits is equal or higher than timesHit", () => {
      myShip.timesHit = 4;
      expect(myShip.isSunk()).toBe(false);
      myShip.hit();
      expect(myShip.isSunk()).toBe(true);
    });
    test.todo("should be sealed");
  });
});
