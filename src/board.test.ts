import { expect, test } from "vitest";
import { Board } from "./board";

test("width 1, height 1", () => {
  const s = "#";
  const board = new Board(s);
  expect(board.ncols).toBe(1);
  expect(board.nrows).toBe(1);
  expect(board.coords(0)).toEqual([0, 0]);
});

test("width 2, height 1", () => {
  const s = "##";
  const board = new Board(s);
  expect(board.ncols).toBe(2);
  expect(board.nrows).toBe(1);
  expect(board.coords(1)).toEqual([1, 0]);
});

test("width 1, height 2", () => {
  const s = "#\n#";
  const board = new Board(s);
  expect(board.ncols).toBe(1);
  expect(board.nrows).toBe(2);
  expect(board.coords(1)).toEqual([0, 1]);
});

test("width 2, height 2", () => {
  const s = "##\n##";
  const board = new Board(s);
  expect(board.ncols).toBe(2);
  expect(board.nrows).toBe(2);
  expect(board.coords(0)).toEqual([0, 0]);
  expect(board.coords(1)).toEqual([1, 0]);
  expect(board.coords(2)).toEqual([0, 1]);
  expect(board.coords(3)).toEqual([1, 1]);
});

test("width 5, height 3", () => {
  const s = "#####\n#   #\n#####";
  const board = new Board(s);
  expect(board.ncols).toBe(5);
  expect(board.nrows).toBe(3);
});

test("2 targets, 1 player", () => {
  const s = "#####\n#.@.#\n#####";
  const board = new Board(s);
  expect(board.ncols).toBe(5);
  expect(board.nrows).toBe(3);
  expect(board.initialPlayerCell).toBe(7);
  expect(board.coords(board.initialPlayerCell)).toEqual([2, 1]);
  expect(board.targetCells).toEqual([6, 8]);
  expect(board.allCoords(board.targetCells)).toEqual([
    [1, 1],
    [3, 1],
  ]);
});

test("2 targets, 3 boxes, 1 player", () => {
  const s = "#####\n#.@.#\n#$$$#\n#####";
  const board = new Board(s);
  expect(board.ncols).toBe(5);
  expect(board.nrows).toBe(4);
  expect(board.initialPlayerCell).toBe(7);
  expect(board.coords(board.initialPlayerCell)).toEqual([2, 1]);
  expect(board.targetCells).toEqual([6, 8]);
  expect(board.initialBoxCells).toEqual([11, 12, 13]);
  expect(board.allCoords(board.initialBoxCells)).toEqual([
    [1, 2],
    [2, 2],
    [3, 2],
  ]);
  expect(board.boxCoords).toEqual([
    [1, 2],
    [2, 2],
    [3, 2],
  ]);
});

test("fancy board", () => {
  const s = `
##########
##########
#######  #
### .# #.#
#     .  #
# #  $ $ #
# #####  #
##### $$.#
### @    #
##########`;
  const board = new Board(s);
  expect(board.initialPlayerCell).toBe(84);
  expect(board.coords(board.initialPlayerCell)).toEqual([4, 8]);
  expect(board.initialBoxCells).toEqual([55, 57, 76, 77]);
  expect(board.allCoords(board.initialBoxCells)).toEqual([
    [5, 5],
    [7, 5],
    [6, 7],
    [7, 7],
  ]);
  expect(board.boxCoords).toEqual([
    [5, 5],
    [7, 5],
    [6, 7],
    [7, 7],
  ]);
  expect(board.targetCells).toEqual([34, 38, 46, 78]);
  expect(board.allCoords(board.targetCells)).toEqual([
    [4, 3],
    [8, 3],
    [6, 4],
    [8, 7],
  ]);
  expect(board.targetCoords).toEqual([
    [4, 3],
    [8, 3],
    [6, 4],
    [8, 7],
  ]);
});
