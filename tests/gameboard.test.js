import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

describe("gameboard", () => {
  const gameboard = new Gameboard();
  test("gameboard should be defined", () => {
    expect(gameboard).toBeDefined();
  });
  test("column should have 10 rows", () => {
    expect(gameboard.columns["A"].length).toBe(10);
  });
  test("board should have 100 cells", () => {
    let counter = 0;
    for (const key of Object.keys(gameboard.columns)) {
      for (const element of gameboard.columns[key]) {
        counter++;
      }
    }
    expect(counter).toBe(100);
  });
  describe("placing ships", () => {
    test("should place ship at specific coordinate", () => {
      const myShip = new Ship(1);
      gameboard.placeShip("A", 9, myShip);
      expect(gameboard.columns["A"][8]).toBe(myShip);
    });
    test.todo("should spread ship based on its length through the cells");
  });

  test("Receive attack method should determine if hit a ship", () => {
    expect(gameboard.receiveAttack("A", 9)).toBe(true);
  });
  test("should return false if doesn't hit a ship and coordinates must be recorded", () => {
    expect(gameboard.receiveAttack("A", 8)).toBe(false);
    expect(gameboard.columns["A"][7]).toBe("miss");
    expect(gameboard.missedShots).toContainEqual(["A", 8]);
  });
});
