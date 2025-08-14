import { useEffect, useRef, useState } from "react";
import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import Canvas from "./canvas";
import "./index.css";

function PlayArea() {
  return (
    <section
      style={{
        height: "100%",
        width: "100%",
        cursor: "none",
        overflow: "hidden",
      }}
      className=""
    >
      <CursorMovement />

      <StickerEditor />

      <Canvas />
    </section>
  );
}

export default PlayArea;
