import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import Canvas, { adjustFullScreenAtom } from "./canvas";
import "./index.css";
import { useAtom } from "jotai";

function ScribblePad() {
  const [adjustFullScreen] = useAtom(adjustFullScreenAtom);
  return (
    <section
      style={{
        height: "100%",
        width: "100%",
        cursor: "none",
        position: adjustFullScreen ? "fixed" : "absolute",
        top: 0,
        left: 0,
        zIndex: 214748364,
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
