import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import { loadSprites } from "./makeSprite";
import "./App.css";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

const [Box, BoxOnTarget, Player, Target, Wall] = await loadSprites([
  "box",
  "box_on_target",
  "player",
  "target",
  "wall",
]);

const walls = [
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [6, 1],
  [0, 2],
  [6, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [6, 3],
  [0, 4],
  [2, 4],
  [3, 4],
  [6, 4],
  [0, 5],
  [2, 5],
  [6, 5],
  [7, 5],
  [0, 6],
  [7, 6],
  [0, 7],
  [7, 7],
  [0, 8],
  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 8],
  [7, 8],
];

const boxes = [
  [3, 2],
  [4, 3],
  [4, 4],
  [1, 6],
  [3, 6],
  [4, 6],
  [5, 6],
];

const targets = [
  [1, 2],
  [5, 3],
  [1, 4],
  [4, 5],
  [3, 6],
  [6, 6],
  [4, 7],
];

const player = [2, 2];

const targetCells = targets.map(([x, y]) => x + 8 * y);

export default function App() {
  return (
    <div className="container">
      <Application background={"black"} width={32 * 8} height={32 * 9}>
        {walls.map(([x, y], i) => (
          <Wall x={32 * x} y={32 * y} key={`Wall-${i}`} />
        ))}
        {targets.map(([x, y], i) => (
          <Target x={32 * x} y={32 * y} key={`Target-${i}`} />
        ))}
        {boxes.map(([x, y], i) =>
          targetCells.includes(x + 8 * y) ? (
            <BoxOnTarget x={32 * x} y={32 * y} key={`BoxOnTarget-${i}`} />
          ) : (
            <Box x={32 * x} y={32 * y} key={`Box-${i}`} />
          )
        )}
        <Player x={32 * player[0]} y={32 * player[1]} key="player" />
      </Application>
    </div>
  );
}
