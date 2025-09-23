import { useEffect, useRef, useState, type FormEvent } from "react";

import { atom, useAtom } from "jotai";
import { adjustFullScreenAtom, stickerDetails } from "./canvas";
export const isDraggingAtom = atom(false);
export const showStickerInputAtom = atom(false);

function StickerEditor() {
  const [, setIsDragging] = useAtom(isDraggingAtom);

  const [input, setInput] = useState("");
  const [stopMessageSocket, setStopMessageSocket] = useState(false);
  const [adjustFullScreen] = useAtom(adjustFullScreenAtom);
  const [showInput, setShowInput] = useAtom(showStickerInputAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showStickerDetails, setShowStickerDetails] = useAtom(stickerDetails);

  const [userCursor, setUserCursor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  useEffect(() => {
    // socket.readyState === WebSocket.OPEN;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // if (showStickerDetails.sticketTextAtom)
      if (
        target.classList.contains("dynamic-input") ||
        (target?.parentNode as HTMLElement)?.classList.contains("li-box") ||
        !showStickerDetails.sticketTextAtom
      ) {
        setShowInput(false);
        return;
      }

      if (
        inputRef.current &&
        inputRef?.current!.contains(event.target as Node)
      ) {
        setShowInput(false);
        return;
      } else {
        setInput("");
        setShowInput(true);

        setTimeout(() => {
          inputRef?.current?.focus();
        }, 0);
      }

      const data = {
        x: event.clientX,
        y: event.clientY,
        width: window.innerWidth,
        height: window.innerHeight,
        pageX: event.pageX,
        pageY: event.pageY,
        // height: window.innerHeight,
      };

      setUserCursor(data);

      // else if (currentXPosition === Number.NEGATIVE_INFINITY) {
      //   setShowInput(true);
      // }
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showStickerDetails.sticketTextAtom]);

  const handleInput = (event: FormEvent) => {
    event.preventDefault();
    const divEl = document.createElement("div");

    divEl.textContent = input;

    divEl.style.minWidth = "150px";
    divEl.style.maxWidth = "250px";
    divEl.style.minHeight = "fit-content";
    // divEl.style.minHeight = "50px";
    // divEl.style.maxHeight = "100px";
    divEl.style.resize = "both";
    // divEl.style.overflow = "auto";
    divEl.contentEditable = "true";
    divEl.setAttribute("placeholder", "Max 30 words");
    divEl.style.whiteSpace = "wrap";
    divEl.style.wordBreak = "break-word";
    divEl.style.overflowWrap = "break-word";
    divEl.style.border = "none";
    divEl.style.outline = "none";
    divEl.style.borderRadius = "10px";
    divEl.style.padding = "0.55rem";
    divEl.style.paddingRight = "1.2rem";
    divEl.style.backdropFilter = "blur(10px)";
    divEl.style.zIndex = "214748365";
    divEl.spellcheck = false;
    divEl.style.touchAction = "none";
    divEl.style.font = `${showStickerDetails.fontSize}px 'Architects Daughter', cursive`;
    divEl.style.color = "#1b1919";
    divEl.style.fontWeight = "1000";
    divEl.style.letterSpacing = "1px";
    divEl.style.background = "rgba(37, 235, 221, 0.6)";
    divEl.style.cursor = "grab";
    divEl.style.position = adjustFullScreen ? "fixed" : "absolute";
    divEl.style.left = `${
      adjustFullScreen ? userCursor.x : userCursor.pageX
    }px`;
    divEl.style.top = `${adjustFullScreen ? userCursor.y : userCursor.pageY}px`;
    divEl.className = "dynamic-input";

    const resizeHandle = document.createElement("div");
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "white";
    resizeHandle.style.border = "1px solid rgba(37, 235, 221, 0.6)";
    resizeHandle.style.borderTopLeftRadius = "5px";

    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.cursor = "nwse-resize";
    resizeHandle.className = "dynamic-input";
    resizeHandle.style.fontSize = "0";
    // resizeHandle.id = "resizer";
    resizeHandle.innerHTML = `
  <svg viewBox="0 0 24 24" width="15" height="15" style="display:block;">
    <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16 18l2-2m-7 2l7-7M6 18L18 6"/>
  </svg>
`;
    resizeHandle.style.userSelect = "none"; // avoid text selection
    // resizeHandle.contentEditable = "false";
    divEl.append(resizeHandle);

    document.body.append(divEl);

    let isResizing = false;

    // Fail-safe incase divEl removes all the elemtns
    divEl.addEventListener("input", () => {
      if (!divEl.contains(resizeHandle)) {
        divEl.append(resizeHandle);
      }
    });

    resizeHandle.addEventListener("touchstart", (e) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
    });

    resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
    });

    window.addEventListener("touchmove", (e) => {
      if (!isResizing) return;
      const touch = e.touches[0];
      const rect = divEl.getBoundingClientRect();
      let newWidth = touch.clientX - rect.left;
      let newHeight = touch.clientY - rect.top;

      divEl.style.width = newWidth + "px";
      divEl.style.maxWidth = newWidth + "px";
      divEl.style.minWidth = "200px";
      divEl.style.height = newHeight + "px";
      divEl.style.maxHeight = newHeight + "px";
    });

    window.addEventListener("touchend", () => {
      isResizing = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      // use clientX/clientY to sync with cursor movement
      const rect = divEl.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;
      let newHeight = e.clientY - rect.top;

      divEl.style.width = newWidth + "px";
      divEl.style.maxWidth = newWidth + "px";
      divEl.style.minWidth = "200px";
      divEl.style.height = newHeight + "px";
      divEl.style.maxHeight = newHeight + "px";
    });

    window.addEventListener("mouseup", () => {
      isResizing = false;
    });

    document.body.appendChild(divEl);
    // inputEl.focus();

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // socketProvider.get("message")?.send(JSON.stringify(data));

    setInput("");
    setShowInput(false);

    divEl.addEventListener("mouseenter", () => {
      setShowStickerDetails((prev) => ({ ...prev, hidePen: true }));
    });
    divEl.addEventListener("mouseleave", () => {
      setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
    });

    divEl.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - divEl.offsetLeft;
      offsetY = e.clientY - divEl.offsetTop;
    });
    let clearMessageSocketTimer: any = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        // const now = Date.now();
        // if (now - lastSent < 20) return;
        divEl.style.left = `${event.clientX - offsetX}px`;
        divEl.style.top = `${event.clientY - offsetY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    divEl.addEventListener("touchstart", (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsDragging(true);
        // const touch = e.touches[0];

        // offsetX = touch.clientX - react.left;
        // offsetY = touch.clientY - react.top;
        isDragging = true;
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        divEl.style.left = `${touch.clientX - divEl.clientWidth / 2}px`;
        divEl.style.top = adjustFullScreen
          ? `${touch.clientY - divEl.clientHeight / 2}px`
          : `${touch.clientY - divEl.clientHeight / 2 + window.scrollY}px`;
      }
    });
    document.addEventListener("touchend", () => {
      isDragging = false;
      setIsDragging(false);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    divEl.addEventListener(
      "keydown",
      (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        setStopMessageSocket(true);
        if (clearMessageSocketTimer) {
          clearTimeout(clearMessageSocketTimer);
        }
        clearMessageSocketTimer = setTimeout(() => {
          setStopMessageSocket(false);
        }, 500);
        if (e.key === "Delete") {
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
          divEl.remove();
        } else if (e.key === "Enter" && e.shiftKey) {
          divEl.appendChild(document.createElement("br"));
        } else if (e.key === "Escape" || e.key === "Enter") {
          divEl.blur(); // this should now fire correctly
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        } else if (e.key === "Backspace" && divEl.textContent?.trim() === "") {
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
          divEl.remove();
        }
      },
      true
    );
  };

  return (
    showInput && (
      <form onSubmit={handleInput}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          className="sticker-editor"
          style={{
            width: "150px",
            height: "30px",
            position: "fixed",
            borderRadius: "3px",
            // zIndex: 2147483647,
            zIndex: 214748368,
            transition: "transform 0.02s ease-in-out",
            transform: `translate(
        ${((userCursor.x - 75) / userCursor.width) * window.innerWidth}px,
        ${((userCursor.y - 25) / userCursor.height) * window.innerHeight}px
      )`,
          }}
          onKeyDownCapture={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            // Handle Escape to close
            if (e.key === "Escape") {
              setShowInput(false);
              setInput("");
            }
          }}
          onChange={(e) => {
            // Now just update your state
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (!stopMessageSocket) {
              setInput(e.target.value);
            }
          }}
        />
      </form>
    )
  );
}

export default StickerEditor;
