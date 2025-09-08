import { Assets } from "pixi.js";
// import { useEffect, useRef, useState } from "react";
import "@pixi/react";

interface SpriteProps {
  x: number;
  y: number;
  scale?: number;
}

export async function loadSprites(names: string[], defaultScale = 2) {
  const textures = await Promise.all(
    names.map((name) => Assets.load(`public/${name}.png`))
  );
  const sprites = textures.map((texture) => ({ x, y, scale }: SpriteProps) => {
    return (
      <pixiSprite scale={scale ?? defaultScale} texture={texture} x={x} y={y} />
    );
  });
  return sprites;
}
