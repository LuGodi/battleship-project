import Ship from "../src/ship.js";

describe("ship", () => {
  test("should not be undefined", () => {
    expect(new Ship()).toBeDefined();
  });
});
