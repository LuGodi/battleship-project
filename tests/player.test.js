import Player from "../src/player";
import Gameboard from "../src/gameboard";

describe("Testing player class", () => {
  test("Should be defined", () => {
    const player = new Player();
    expect(player).toBeDefined();
  });
  test("Should be a real player or computer player", () => {
    const player = new Player();
    expect(player.type).toBeDefined();
    player.type = "computer";
    expect(player.type).toBe("computer");
    player.type = "real";
    expect(player.type).toBe("real");
    expect(() => (player.type = "something")).toThrow(TypeError);
  });

  test("Should have its own gameboard", () => {
    const player1 = new Player();

    expect(player1.gameboard).toBeInstanceOf(Gameboard);
    const player2 = new Player();
    expect(player2.gameboard).toBeInstanceOf(Gameboard);
    expect(player1.gameboard).not.toBe(player2.gameboard);
  });
});
