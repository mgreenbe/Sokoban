import { Board } from "./Board";
import type { Cell, Coords } from "./Board";

export class GameState {
  readonly board: Board;
  readonly playerCell: Cell;
  readonly boxCells: Cell[];
  readonly history: GameState[];

  constructor(
    board: Board,
    playerCell: Cell,
    boxCells: Cell[],
    history?: GameState[]
  ) {
    this.board = board;
    this.playerCell = playerCell;
    this.boxCells = boxCells;
    this.history = history ?? [];
  }

  static fromString(s: string): GameState {
    const board = new Board(s);
    return new GameState(board, board.initialPlayerCell, board.initialBoxCells);
  }

  update(playerCell: Cell, boxCells: Cell[]): GameState {
    return new GameState(this.board, playerCell, boxCells, [
      ...this.history,
      this,
    ]);
  }

  get playerCoords(): Coords {
    return this.board.coords(this.playerCell);
  }

  get boxCoords(): Coords[] {
    return this.board.coords(this.boxCells);
  }

  get isWinner() {
    const boxCells = new Set(this.boxCells);
    const targetCells = new Set(this.board.targetCells);
    return (
      boxCells.size == targetCells.size && boxCells.isSubsetOf(targetCells)
    );
  }
}
