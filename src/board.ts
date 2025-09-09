export type Cell = number;
export type Coords = [number, number];

export class Board {
  readonly s: string;
  readonly ncols: number = 0;
  readonly nrows: number = 0;
  readonly celtas: {
    ArrowLeft: number;
    ArrowRight: number;
    ArrowUp: number;
    ArrowDown: number;
  }; // short for cell-deltas
  readonly initialPlayerCell: Cell = -1;
  readonly initialBoxCells: Cell[];
  readonly targetCells: Cell[];
  readonly targetCoords: Coords[];
  readonly wallCells: Cell[];
  readonly wallCoords: Coords[];

  constructor(s: string) {
    this.s = s;
    this.wallCells = [];
    this.targetCells = [];
    this.initialBoxCells = [];
    let cell = 0;
    for (const c of s.trim()) {
      if (c === "\n") {
        this.ncols = 0;
        this.nrows += 1;
        continue;
      } else if (c === "#") {
        this.wallCells.push(cell);
      } else if (c === "$") {
        this.initialBoxCells.push(cell);
      } else if (c === ".") {
        this.targetCells.push(cell);
      } else if (c === "@") {
        this.initialPlayerCell = cell;
      }
      cell += 1;
      this.ncols += 1;
    }
    this.nrows += 1;
    this.celtas = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -this.ncols,
      ArrowDown: this.ncols,
    };
    this.wallCoords = this.coords(this.wallCells);
    this.targetCoords = this.coords(this.targetCells);
  }

  coords(cell_or_cells: Cell): Coords;
  coords(cell_or_cells: Cell[]): Coords[];
  coords(cell_or_cells: Cell | Cell[]): Coords | Coords[] {
    if (typeof cell_or_cells == "number") {
      const col = cell_or_cells % this.ncols;
      const row = (cell_or_cells - col) / this.ncols;
      return [col, row];
    } else {
      return cell_or_cells.map((cell) => this.coords(cell));
    }
  }

  isWinner(boxCells: Cell[]): boolean {
    const A = new Set(boxCells);
    const B = new Set(this.targetCells);
    return A.size == B.size && A.isSubsetOf(B);
  }
}
