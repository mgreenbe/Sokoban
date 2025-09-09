import { Assets } from "pixi.js";
import "@pixi/react";

interface SpriteProps {
  x: number;
  y: number;
}

export const SCALE = 3;

const names = [
  "box",
  "box_on_target",
  "player",
  "player_on_target",
  "target",
  "wall",
];

const textures = await Promise.all(
  names.map((name) => Assets.load(`public/${name}.png`))
);
export const sprites = textures.map((texture) => ({ x, y }: SpriteProps) => {
  return <pixiSprite scale={SCALE} texture={texture} x={x} y={y} />;
});
