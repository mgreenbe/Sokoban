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
  readonly initialPlayerCell: number = -1;
  readonly initialBoxCells: number[];
  readonly targetCells: number[];
  readonly targetCoords: [number, number][];
  readonly wallCells: number[];
  readonly wallCoords: [number, number][];

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

  coords(cell: number): [number, number];
  coords(cell: number[]): [number, number][];
  coords(cell: number | number[]): [number, number] | [number, number][] {
    if (typeof cell == "number") {
      const col = cell % this.ncols;
      const row = (cell - col) / this.ncols;
      return [col, row];
    } else {
      return cell.map((c) => this.coords(c));
    }
  }

  isWinner(boxCells: number[]): boolean {
    const A = new Set(boxCells);
    const B = new Set(this.targetCells);
    return A.size == B.size && A.isSubsetOf(B);
  }
}
