import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import { loadSprites } from "./makeSprite";
import "./App.css";
import { Board } from "./board";
import { useEffect, useState } from "react";

const CELL_W = 32;
const CELL_H = 32;

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
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
const { ncols, nrows, boxes, player, targets } = board;

console.log({ ncols, nrows });

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
  const [playerCell, setPlayerCell] = useState(player);

  const [playerCol, playerRow] = board.coords(playerCell);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // let destCell = playerCell;
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        console.log(e.key);
        const celta = board.celtas[e.key];
        const destCell = playerCell + celta;
        const boxIndex = board.boxes.indexOf(destCell);
        if (boxIndex > -1) {
          const boxDestCell = destCell + celta;
          if (!board.isWall(boxDestCell) && !board.isBox(boxDestCell)) {
            console.log("Hi!");
            board.boxes[boxIndex] = boxDestCell;
            setPlayerCell(destCell);
          }
        } else if (!board.isWall(destCell)) {
          setPlayerCell(destCell);
        }
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  });

  return (
    <div className="container">
      <Application
        background={"black"}
        width={CELL_W * ncols}
        height={CELL_H * nrows}
      >
        {board.wallCoords.map(([col, row], i) => (
          <Wall x={CELL_W * col} y={CELL_H * row} key={`Wall-${i}`} />
        ))}
        {board.targetCoords.map(([col, row], i) => (
          <Target x={CELL_W * col} y={CELL_H * row} key={`Target-${i}`} />
        ))}
        {board.boxCoords.map(([col, row], i) =>
          targets.includes(boxes[i]) ? (
            <BoxOnTarget
              x={CELL_W * col}
              y={CELL_W * row}
              key={`BoxOnTarget-${i}`}
            />
          ) : (
            <Box x={CELL_W * col} y={CELL_H * row} key={`Box-${i}`} />
          )
        )}
        {board.targets.includes(playerCell) ? (
          <PlayerOnTarget
            x={CELL_W * playerCol}
            y={CELL_W * playerRow}
            key="player"
          />
        ) : (
          <Player x={CELL_W * playerCol} y={CELL_H * playerRow} key="player" />
        )}
      </Application>
    </div>
  );
}
