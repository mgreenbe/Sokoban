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
  readonly player: number = -1;
  readonly ncols: number = 0;
  readonly nrows: number = 0;
  readonly walls: number[];
  readonly targets: number[];
  readonly celtas: {
    ArrowLeft: number;
    ArrowRight: number;
    ArrowUp: number;
    ArrowDown: number;
  };
  boxes: number[];

  constructor(s: string) {
    this.s = s;
    this.walls = [];
    this.targets = [];
    this.boxes = [];
    let cell = 0;
    for (const c of s.trim()) {
      if (c === "\n") {
        this.ncols = 0;
        this.nrows += 1;
        continue;
      } else if (c === "#") {
        this.walls.push(cell);
      } else if (c === "$") {
        this.boxes.push(cell);
      } else if (c === ".") {
        this.targets.push(cell);
      } else if (c === "@") {
        this.player = cell;
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
  }

  isWall(cell: number) {
    return this.walls.includes(cell);
  }

  isBox(cell: number) {
    return this.boxes.includes(cell);
  }

  cell([col, row]: [number, number]) {
    return row * this.ncols + col;
  }

  coords(cell: number): [number, number] {
    const col = cell % this.ncols;
    const row = (cell - col) / this.ncols;
    return [col, row];
  }

  allCoords(cells: number[]) {
    return cells.map((cell) => this.coords(cell));
  }

  get playerCoords() {
    return this.coords(this.player);
  }

  get targetCoords() {
    return this.allCoords(this.targets);
  }

  get wallCoords() {
    return this.allCoords(this.walls);
  }

  get boxCoords() {
    return this.allCoords(this.boxes);
  }
}
