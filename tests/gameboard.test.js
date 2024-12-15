import Gameboard from "../src/gameboard";

describe("gameboard", () => {
  test("gameboard should not be undefined", () => {
    const gameboard = new Gameboard();
    expect(gameboard).toBeDefined();
  });
});
