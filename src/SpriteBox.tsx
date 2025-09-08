import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import "@pixi/react";

export function SpriteBox() {
  // The Pixi.js `Sprite`
  const spriteRef = useRef(null);

  const [texture, setTexture] = useState(Texture.EMPTY);
  const [isActive, setIsActive] = useState(false);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("public/box.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  console.log(isActive);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={"static"}
      onClick={() => setIsActive(!isActive)}
      scale={isActive ? 2 : 1}
      texture={texture}
      x={200}
      y={200}
    />
  );
}
