import { useEffect, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Sprite } from "pixi.js";
import { Board } from "./Board";
import { loadSprites } from "./makeSprite";
import "./App.css";

const CELL_W = 32;
const CELL_H = 32;

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

const board = new Board(levelString);
const {
  ncols,
  nrows,
  celtas,
  initialBoxCells,
  initialPlayerCell,
  targetCells,
  targetCoords,
  wallCells,
  wallCoords,
} = board;

const [Box, BoxOnTarget, Player, PlayerOnTarget, Target, Wall] =
  await loadSprites([
    "box",
    "box_on_target",
    "player",
    "player_on_target",
    "target",
    "wall",
  ]);

export default function App() {
  const [playerCell, setPlayerCell] = useState(initialPlayerCell);
  const [boxCells, setBoxCells] = useState(initialBoxCells);

  const [playerCol, playerRow] = board.coords(playerCell);
  const boxCoords = board.coords(boxCells);

  const isWinner = board.isWinner(boxCells);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        const celta = celtas[e.key];
        const playerDestCell = playerCell + celta;
        const boxIndex = boxCells.indexOf(playerDestCell);
        if (boxIndex > -1) {
          const boxDestCell = playerDestCell + celta;
          if (
            !wallCells.includes(boxDestCell) &&
            !boxCells.includes(boxDestCell)
          ) {
            setBoxCells(boxCells.toSpliced(boxIndex, 1, boxDestCell));
            setPlayerCell(playerDestCell);
          }
        } else if (!wallCells.includes(playerDestCell)) {
          setPlayerCell(playerDestCell);
        }
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  });

  return (
    <div className="container">
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
      <div className="message">
        <span>{isWinner ? <b>You win!</b> : "In progress..."}</span>
      </div>
    </div>
  );
}
