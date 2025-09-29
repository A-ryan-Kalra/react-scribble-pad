import CursorMovement from "./cursor-movement";

import Canvas, { adjustFullScreenAtom } from "./canvas";
import "./index.css";
import { useAtom } from "jotai";
import type { ScribblePadProps } from "./type";

function ScribblePad({ openPad = true, setOpenPad }: ScribblePadProps) {
  const [adjustFullScreen] = useAtom(adjustFullScreenAtom);

  return (
    <section
      style={{
        display: openPad ? "block" : "none",
        height: "100%",
        width: "100%",
        cursor: "none",
        position: adjustFullScreen.adjustScreen ? "fixed" : "absolute",
        top: 0,
        pointerEvents: adjustFullScreen.isCanvasUnMounted ? "none" : "auto",
        left: 0,
        zIndex: 214748364,
      }}
    >
      {/* <CursorMovement /> */}
      {!adjustFullScreen.isCanvasUnMounted && <CursorMovement />}

      <Canvas openPad={openPad} setOpenPad={setOpenPad} />
    </section>
  );
}

export default ScribblePad;
