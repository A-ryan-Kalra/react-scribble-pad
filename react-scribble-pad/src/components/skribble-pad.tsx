import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import Canvas from "./canvas";
import "./index.css";

function SkribblePad() {
  return (
    <div
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
    </div>
  );
}

export default SkribblePad;
