export function makeBoard(s: string) {
  let x = 0;
  let y = 0;
  const walls = [];
  const boxes = [];
  const targets = [];
  const player = [];
  for (const c of s.trim()) {
    if (c === "\n") {
      y += 1;
      x = 0;
      continue;
    } else if (c === "#") {
      walls.push([x, y]);
    } else if (c === "$") {
      boxes.push([x, y]);
    } else if (c === ".") {
      targets.push([x, y]);
    } else if (c === "@") {
      player.push(x, y);
    }
    x += 1;
  }
  return { ncols: x, nrows: y + 1, walls, boxes, targets, player };
}

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
}
