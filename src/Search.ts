import type { Board, Cell } from "./Board";

type Neighbor = State | null;
type Neighbors = [Neighbor, Neighbor, Neighbor, Neighbor];

type State = {
  playerCell: Cell;
  boxCells: Cell[];
};

type Node = {
  state: State;
  parent: Node | null;
};

class Search {
  board: Board;
  stack: Node[];
  generated: Set<string>;
  celtas: number[];

  constructor(board: Board, state: State) {
    this.board = board;
    this.stack = [{ state, parent: null }];
    this.generated = new Set([computeHash(state)]);
    this.celtas = Object.values(board.celtas);
  }

  search() {
    const { board, stack, generated, celtas } = this;
    const node = stack.pop();
    if (node) {
      if (isWinner(board, node.state)) {
        return node;
      }
      const neighbors = celtas.map((celta) =>
        getNeighbor(board, node.state, celta)
      );
      for (const neighbor of neighbors) {
        if (neighbor) {
          const hash = computeHash(neighbor);
          if (!generated.has(hash)) {
            stack.push({ state: neighbor, parent: node });
          }
        }
      }
    } else {
      // stack empty
    }
  }
}

export function getNeighbor(
  board: Board,
  state: State,
  celta: number
): Neighbor {
  const { wallCells } = board;
  const { playerCell, boxCells } = state;
  const playerDestCell = playerCell + celta;
  const boxIndex = boxCells.indexOf(playerDestCell);
  if (boxIndex > -1) {
    const boxDestCell = playerDestCell + celta;
    if (!wallCells.includes(boxDestCell) && !boxCells.includes(boxDestCell)) {
      return {
        playerCell: playerDestCell,
        boxCells: boxCells.toSpliced(boxIndex, 1, boxDestCell),
      };
    }
  } else if (!wallCells.includes(playerDestCell)) {
    return { playerCell: playerDestCell, boxCells };
  }
  return null;
}

export function computeHash(state: State) {
  return `${state.playerCell}__${state.boxCells
    .toSorted((a, b) => a - b)
    .map(String)
    .join("_")}`;
}

function isWinner(board: Board, state: State) {
  const boxCells = new Set(state.boxCells);
  const targetCells = new Set(board.targetCells);
  return boxCells.size == targetCells.size && boxCells.isSubsetOf(targetCells);
}
