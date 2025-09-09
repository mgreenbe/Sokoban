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
const {
  ncols,
  nrows,
  boxes,
  boxCoords,
  playerCoords,
  targetCoords,
  targets,
  wallCoords,
} = board;

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
  const [pos, setPos] = useState(playerCoords);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log(e.key);
      const [col, row] = pos;
      if (e.key === "ArrowLeft") {
        setPos([col - 1, row]);
      } else if (e.key === "ArrowRight") {
        setPos([col + 1, row]);
      } else if (e.key === "ArrowUp") {
        setPos([col, row - 1]);
      } else if (e.key === "ArrowDown") {
        setPos([col, row + 1]);
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
        {wallCoords.map(([col, row], i) => (
          <Wall x={CELL_W * col} y={CELL_H * row} key={`Wall-${i}`} />
        ))}
        {targetCoords.map(([col, row], i) => (
          <Target x={CELL_W * col} y={CELL_H * row} key={`Target-${i}`} />
        ))}
        {boxCoords.map(([col, row], i) =>
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
        {targets.includes(board.cell(pos)) ? (
          <PlayerOnTarget
            x={CELL_W * pos[0]}
            y={CELL_W * pos[1]}
            key="player"
          />
        ) : (
          <Player x={CELL_W * pos[0]} y={CELL_H * pos[1]} key="player" />
        )}
      </Application>
    </div>
  );
}
