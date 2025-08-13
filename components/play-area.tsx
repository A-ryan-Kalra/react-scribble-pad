import { useEffect, useRef, useState } from "react";
import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";

import Canvas from "./canvas";
import "./index.css";
import type { StickerDetailProps, UserDetailsProps } from "../types";

function PlayArea() {
  const [userData, setUserData] = useState<UserDetailsProps[]>([]);

  return (
    <section
      style={{
        height: "100%",
        width: "100%",
        cursor: "none",
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
