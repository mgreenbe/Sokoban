import { useEffect, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Sprite } from "pixi.js";
import { GameState } from "./GameState";
import { SCALE, sprites } from "./loadSprites";
import "./App.css";
import { getNeighbor, computeHash } from "./Search";

const CELL_W = 16 * SCALE;
const CELL_H = 16 * SCALE;

// Extend tells @pixi/react what Pixi.js components are available.
// Apparently I don't need Container or Graphics.
extend({
  Sprite,
});

const levelString = `##########
##########
#######  #
### .# #.#
#     .  #
# #  $ $ #
# #####  #
##### $$.#
### @    #
##########`;

const [Box, BoxOnTarget, Player, PlayerOnTarget, Target, Wall] = sprites;

const initialState = GameState.fromString(levelString);

export default function App() {
  const [state, setState] = useState(initialState);
  const {
    board,
    playerCell,
    boxCells,
    boxCoords,
    playerCoords: [playerCol, playerRow],
    isWinner,
  } = state;
  const {
    ncols,
    nrows,
    celtas,
    targetCells,
    targetCoords,
    // wallCells,
    wallCoords,
  } = board;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        const celta = celtas[e.key];
        const neighbor = getNeighbor(board, { playerCell, boxCells }, celta);
        if (neighbor) {
          const newState = state.update(neighbor.playerCell, neighbor.boxCells);
          console.log(computeHash(newState));
          setState(newState);
        }
        // const playerDestCell = playerCell + celta;
        // const boxIndex = boxCells.indexOf(playerDestCell);
        // if (boxIndex > -1) {
        //   const boxDestCell = playerDestCell + celta;
        //   if (
        //     !wallCells.includes(boxDestCell) &&
        //     !boxCells.includes(boxDestCell)
        //   ) {
        //     setState(
        //       state.update(
        //         playerDestCell,
        //         boxCells.toSpliced(boxIndex, 1, boxDestCell)
        //       )
        //     );
        //   }
        // } else if (!wallCells.includes(playerDestCell)) {
        //   setState(state.update(playerDestCell, boxCells));
        // }
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  });

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Sokoban</h1>
        <img src="https://upload.wikimedia.org/wikipedia/en/0/0f/Official_Sokoban_website_banner.png" />
      </div>
      <div className="board">
        <Application
          background={"black"}
          width={CELL_W * ncols}
          height={CELL_H * nrows}
        >
          {wallCoords.map(([col, row], i) => (
            <Wall x={CELL_W * col} y={CELL_H * row} key={`Wall-${i}`} />
          ))}
          {targetCoords.map(([col, row], i) => (
            <Target x={CELL_W * col} y={CELL_H * row} key={`Target-${i}`} />
          ))}
          {boxCoords.map(([col, row], i) =>
            targetCells.includes(boxCells[i]) ? (
              <BoxOnTarget
                x={CELL_W * col}
                y={CELL_W * row}
                key={`BoxOnTarget-${i}`}
              />
            ) : (
              <Box x={CELL_W * col} y={CELL_H * row} key={`Box-${i}`} />
            )
          )}
          {targetCells.includes(playerCell) ? (
            <PlayerOnTarget
              x={CELL_W * playerCol}
              y={CELL_W * playerRow}
              key="PlayerOnTarget"
            />
          ) : (
            <Player
              x={CELL_W * playerCol}
              y={CELL_H * playerRow}
              key="Player"
            />
          )}
        </Application>
      </div>
      <div className="buttons">
        <button
          onClick={() =>
            setState(
              state.update(board.initialPlayerCell, board.initialBoxCells)
            )
          }
        >
          Reset
        </button>
        <button
          disabled={state.history.length === 0}
          onClick={() => {
            const history = [...state.history];
            const prevState = history.pop();
            if (prevState !== undefined) {
              setState(
                new GameState(
                  state.board,
                  prevState.playerCell,
                  prevState.boxCells,
                  history
                )
              );
            }
          }}
        >
          Undo
        </button>
        <button>Hint</button>
      </div>
      <div className="status">
        <span>{isWinner ? <b>You win!</b> : "In progress..."}</span>
      </div>
    </div>
  );
}
