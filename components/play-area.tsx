import { useRef } from "react";
import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import StickerMovement from "./sticker-movement";
import Canvas from "./canvas";
import "./index.css";

function PlayArea() {
  // const socketRef = useRef<WebSocket>(null);

  const divRefs = useRef<HTMLDivElement[]>([]);

  return (
    <section className="h-full w-full ">
      {/* <CursorMovement position={{ ...data }} key={index} /> */}

      {/* <StickerMovement position={{ ...data }} key={index} /> */}

      <StickerEditor divRefs={divRefs.current ?? []} name={name ?? ""} />

      <Canvas />
    </section>
  );
}

export default PlayArea;
