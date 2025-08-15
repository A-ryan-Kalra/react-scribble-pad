import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import Canvas from "./canvas";
import "./index.css";

function ScribblePad() {
  return (
    <section
      style={{
        height: "100%",
        width: "100%",
        cursor: "none",
        // overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
      }}
      className=""
    >
      <CursorMovement />

      <StickerEditor />

      <Canvas />
    </section>
  );
}

export default ScribblePad;
