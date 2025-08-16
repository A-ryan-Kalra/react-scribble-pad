import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent as MouseEventHandler,
  type TouchEvent as TouchEventHandler,
} from "react";

import {
  Eraser,
  Keyboard,
  MonitorCheck,
  MonitorX,
  PaintRollerIcon,
  PaletteIcon,
  PenLine,
  Power,
  StickerIcon,
} from "lucide-react";
import PickColor from "./pick-color";
import { atom, useAtom } from "jotai";
import { isDraggingAtom } from "./sticker-editor";
import type { StickerDetailsProps, ToolsProps, ToolsRefProps } from "./type";

export const stickerDetails = atom<StickerDetailsProps>({
  sticketTextAtom: false,
  bgColor: "",
  fontSize: 16,
  customizeCursor: false,
});
function Canvas() {
  const [isDragAtom] = useAtom(isDraggingAtom);
  const [bgColor, setBgColor] = useState<{
    openPalette: boolean;
    color: string;
  }>({ openPalette: false, color: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palleteRef = useRef<HTMLDivElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const [showCanvasText, setShowCanvasText] = useState({ x: -100, y: -100 });
  const inputRef = useRef<HTMLInputElement>(null);

  const [showStickerDetails, setShowStickerDetails] = useAtom(stickerDetails);
  const [canvasConf, setCanvasConf] = useState<{ textSize: string }>({
    textSize: "",
  });
  const isDrawing = useRef<boolean>(false);

  const toolsRef = useRef<ToolsRefProps>({
    eraser: false,
    pickColor: false,
    showText: false,
    canvasText: false,
    moveSticker: false,
  });
  const [tools, setTools] = useState<ToolsProps>({
    eraser: false,
    pickColor: false,
    penSize: false,
    canvasText: false,
    showScreen: true,
  });

  useEffect(() => {
    toolsRef.current.moveSticker = isDragAtom;
  }, [isDragAtom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    setCtx(context);
    if (!ctx) return;
    let dpr;
    // const dpr = window.devicePixelRatio || 1;
    if (window.innerWidth < 1200) {
      dpr = 1;
    } else {
      dpr = window.devicePixelRatio || 1;
    }

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.font = "20px Arial";

    const getMousePosition = (event: MouseEvent) => {
      const react = canvas.getBoundingClientRect();
      const offsetX = event.clientX - react.left;
      const offsetY = event.clientY - react.top;

      return { offsetX, offsetY };
    };

    function touchStart(event: TouchEvent) {
      let offSetX = 0;
      let offSetY = 0;
      isDrawing.current = true;
      if (event?.touches?.length > 0) {
        let touch = event?.touches[0];
        (offSetX = touch.clientX), (offSetY = touch.clientY);
        // ctx?.beginPath();
        // ctx?.moveTo(offSetX, offSetY);
      }

      return { offSetX, offSetY };
    }

    function touchMove(event: TouchEvent) {
      if (toolsRef.current.moveSticker) {
        return;
      }

      if (toolsRef.current.eraser) {
        const touch = event.touches[0];

        drawCanvas(touch.clientX, touch.clientY);
        document.documentElement.style.setProperty(
          "--eraserPositionX",
          `${touch.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--eraserPositionY",
          `${touch.clientY}px`
        );
      } else {
        const { offSetX, offSetY } = touchStart(event);

        drawCanvas(offSetX, offSetY);
      }
    }

    const startDrawing = (event: MouseEvent) => {
      isDrawing.current = true;
      const { offsetX, offsetY } = getMousePosition(event);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    };
    const stopDrawing = () => {
      isDrawing.current = false;
      ctx.beginPath();
    };
    const drawCanvas = (offsetX: number, offsetY: number) => {
      if (toolsRef.current.eraser) {
        ctx.globalCompositeOperation = "destination-out";
        const size = 100;
        ctx.rect(offsetX - size / 2, offsetY - size / 2, size, size);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else if (toolsRef.current.showText) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000"; // text color
      } else {
        ctx.globalCompositeOperation = "source-over";

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    };
    const draw = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const { offsetX, offsetY } = getMousePosition(event);

      drawCanvas(offsetX, offsetY);
    };

    function handleEraser(event: MouseEvent) {
      if (toolsRef.current.eraser) {
        document.documentElement.style.setProperty(
          "--eraserPositionX",
          `${event.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--eraserPositionY",
          `${event.clientY}px`
        );
      }
    }
    function showCanvasTextPosition(event: MouseEvent) {
      if (palleteRef.current?.contains(event.target as Node)) {
        setShowCanvasText({ x: -100, y: -100 });
        return;
      }

      if (toolsRef.current.canvasText) {
        if (!inputRef.current?.contains(event.target as Node)) {
          setShowCanvasText({ x: event.clientX, y: event.clientY });
        }
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
    function closeAllTools(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setTools((prev) => ({
          ...prev,
          canvasText: false,
          eraser: false,
          penSize: false,
          pickColor: false,
        }));
        setBgColor((prev) => ({
          ...prev,
          openPalette: false,
        }));
        toolsRef.current.canvasText = false;
        toolsRef.current.eraser = false;
        toolsRef.current.pickColor = false;
        toolsRef.current.showText = false;
        toolsRef.current.showText = false;
        setShowStickerDetails((prev) => ({
          ...prev,
          sticketTextAtom: false,
          hidePen: false,
        }));
      }
    }
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      //  Save the current drawing as an image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // const dpr = window.devicePixelRatio || 1;
      let dpr;
      if (window.innerWidth < 1200) {
        dpr = 1;
      } else {
        dpr = window.devicePixelRatio || 1;
      }
      // dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.lineWidth = 5;

      ctx.scale(dpr, dpr);

      //  Restore the saved image
      ctx.putImageData(imageData, 0, 0);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    window.addEventListener("mousemove", handleEraser);
    window.addEventListener("mousedown", showCanvasTextPosition);
    window.addEventListener("keydown", closeAllTools);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", stopDrawing);

    return () => {
      window.removeEventListener("mousemove", handleEraser);
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      window.removeEventListener("mousedown", showCanvasTextPosition);
      window.removeEventListener("keydown", closeAllTools);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", stopDrawing);
    };
  }, [ctx]);

  function handleInput(e: FormEvent) {
    e.preventDefault();
    // toolsRef.current.canvasText = !toolsRef.current.canvasText;
    inputRef.current!.value = "";
    ctx!.fillText("", showCanvasText.x, showCanvasText.y);
  }

  function showEraser(event: MouseEventHandler<HTMLLIElement>) {
    const touches = event;

    document.documentElement.style.setProperty(
      "--eraserPositionX",
      `${touches.clientX}px`
    );
    document.documentElement.style.setProperty(
      "--eraserPositionY",
      `${touches.clientY}px`
    );
  }

  function showEraserOnTouch(event: TouchEventHandler<HTMLElement>) {
    const touch = event.touches[0];
    document.documentElement.style.setProperty(
      "--eraserPositionX",
      `${touch.clientX}px`
    );
    document.documentElement.style.setProperty(
      "--eraserPositionY",
      `${touch.clientY}px`
    );
  }

  function customCursorColor(event: ChangeEvent<HTMLInputElement>) {
    setShowStickerDetails((prev) => ({
      ...prev,
      customizeCursor: event.target.value === "on" ? true : false,
    }));
  }
  const handleReset = () => {
    const allStickers = document.querySelectorAll(".dynamic-input");
    allStickers.forEach((sticker) => {
      if (document.body.contains(sticker)) {
        document.body.removeChild(sticker);
      }
    });

    if (canvasRef.current) {
      ctx!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  return (
    <div
      style={{
        zIndex: 999999,
        cursor: tools.canvasText ? "text" : "",
      }}
      className={` canvas-container `}
    >
      {tools.eraser && <div className="eraser-tool"></div>}

      <div
        onMouseEnter={() => {
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        }}
        style={{
          transition: "width 0.2s ease-in",

          width: tools.showScreen ? "300px" : "350px",
        }}
        ref={palleteRef}
        className="pallete-box"
      >
        <ul className="pallete-tools">
          <li
            className={`li-box`}
            style={{
              borderRadius: tools.pickColor ? "0.375rem" : "",
              borderColor: tools.pickColor ? "#464c54" : "transparent",
            }}
            onClick={() => {
              // toolsRef.current.pickColor = true;

              toolsRef.current.canvasText = false;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setTools((prev) => ({
                ...prev,
                eraser: false,
                penSize: false,
                pickColor: !prev.pickColor,
                canvasText: false,
              }));
            }}
          >
            <PaletteIcon
              style={{
                fill: tools.pickColor ? "oklch(82.7% 0.119 306.383)" : "",
              }}
              className={``}
            />
            <div
              onMouseEnter={() => {
                if (!showStickerDetails.customizeCursor)
                  setShowStickerDetails((prev) => ({ ...prev, hidePen: true }));
              }}
              onMouseLeave={() => {
                setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {tools.pickColor && (
                <PickColor
                  pick={(rgba: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                  }) => {
                    ctx!.strokeStyle = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
                    setShowStickerDetails((prev) => ({
                      ...prev,
                      bgColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
                      sticketTextAtom: false,
                    }));
                  }}
                />
              )}
            </div>
          </li>
          <li
            className={`li-box`}
            style={{
              borderRadius: tools.eraser ? "0.375rem" : "",
              borderColor: tools.eraser ? "#464c54" : "transparent",
            }}
            onTouchStart={showEraserOnTouch}
            onClick={(event: MouseEventHandler<HTMLLIElement>) => {
              showEraser(event);

              setShowStickerDetails((prev) => ({
                ...prev,
                sticketTextAtom: false,
                // hidePen: !prev.hidePen,
              }));

              toolsRef.current.eraser = !toolsRef.current.eraser;
              toolsRef.current.canvasText = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setTools((prev) => ({
                ...prev,
                penSize: false,
                pickColor: false,
                eraser: !prev.eraser,
                canvasText: false,
              }));
            }}
          >
            <Eraser style={{ fill: tools.eraser ? "#cad5e2" : "" }} />
          </li>
          <li
            onClick={() => {
              toolsRef.current.canvasText = false;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setTools((prev) => ({
                ...prev,
                penSize: !prev.penSize,
                eraser: false,
                pickColor: false,
                canvasText: false,
              }));
              setShowStickerDetails((prev) => ({
                ...prev,
                sticketTextAtom: false,
                hidePen: false,
              }));
            }}
            className={` li-box `}
            style={{
              borderRadius: tools.penSize ? "0.375rem" : "",
              borderColor: tools.penSize ? "#464c54" : "transparent",
            }}
          >
            <PenLine
              style={{
                fill: tools.penSize ? "oklch(82.7% 0.119 306.383)" : "",
              }}
            />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                left: "-2rem",
                bottom: 50,
                visibility: tools.penSize ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  background: "#cad5e2",
                  borderRadius: "0.375rem",
                  padding: "0.25rem",
                  fontSize: "15px",
                }}
              >
                <label htmlFor="sketch-pen">Sketch Pen</label>
                <input
                  type="range"
                  id="sketch-pen"
                  max={40}
                  defaultValue={5}
                  onChange={(e) => (ctx!.lineWidth = Number(e.target.value))}
                />
                <label htmlFor="text-size">Text Size</label>
                <input
                  type="range"
                  id="text-size"
                  max={80}
                  defaultValue={5}
                  onChange={(e) => {
                    setCanvasConf({
                      textSize: (1.2 * Number(e.target.value) > 10
                        ? 1.2 * Number(e.target.value)
                        : 10
                      ).toString(),
                    });
                    setShowStickerDetails((prev) => ({
                      ...prev,
                      hidePen: false,
                      fontSize:
                        1.2 * Number(e.target.value) > 10
                          ? 1.2 * Number(e.target.value)
                          : 10,
                    }));
                  }}
                />
                <div>
                  <label>Customize Cursor</label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      fontSize: "15px",
                      alignItems: "center",
                      columnGap: "0.5rem",
                    }}
                  >
                    <label htmlFor="on" className="center">
                      On
                      <input
                        type="radio"
                        id="on"
                        name="cursorGroup"
                        value={"on"}
                        max={40}
                        onChange={customCursorColor}
                      />
                    </label>
                    <label htmlFor="off" className="center">
                      Off
                      <input
                        id="off"
                        type="radio"
                        defaultChecked
                        name="cursorGroup"
                        value={"off"}
                        max={40}
                        onChange={customCursorColor}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li
            style={{
              cursor: "pointer",
            }}
            onClick={handleReset}
          >
            <Power />
          </li>
          <li
            onClick={() => {
              toolsRef.current.canvasText = true;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = !toolsRef.current.showText;
              ctx!.globalCompositeOperation = "source-over";
              // ctx!.fillStyle = ctx!.strokeStyle;
              setTools((prev) => ({
                ...prev,
                penSize: false,
                eraser: false,
                pickColor: false,
                canvasText: !prev.canvasText,
              }));
              setShowStickerDetails((prev) => ({
                ...prev,
                hidePen: false,
                sticketTextAtom: false,
              }));
            }}
            className={` li-box `}
            style={{
              borderRadius: tools.canvasText ? "0.375rem" : "",
              borderColor: tools.canvasText ? "#464c54" : "transparent",
            }}
          >
            <Keyboard />
          </li>
          <li
            onClick={() => {
              toolsRef.current.canvasText = false;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setShowStickerDetails((prev) => ({
                ...prev,
                sticketTextAtom: !prev.sticketTextAtom,
              }));
              setTools((prev) => ({
                ...prev,
                penSize: false,
                eraser: false,
                pickColor: false,
                canvasText: false,
              }));
            }}
            className={` li-box `}
            style={{
              borderRadius: showStickerDetails.sticketTextAtom
                ? "0.375rem"
                : "",
              borderColor: showStickerDetails.sticketTextAtom
                ? "#464c54"
                : "transparent",
            }}
          >
            <StickerIcon />
          </li>
          <li className={` li-box `}>
            {tools.showScreen ? (
              <div
                onClick={() => {
                  setTools((prev) => ({
                    ...prev,
                    showScreen: false,
                  }));
                }}
              >
                <MonitorCheck />
              </div>
            ) : (
              <div
                onClick={() => {
                  setTools((prev) => ({
                    ...prev,
                    showScreen: true,
                  }));
                }}
              >
                <MonitorX />
              </div>
            )}
          </li>

          <li
            className={` li-box `}
            style={{
              borderRadius: bgColor.openPalette ? "0.375rem" : "",
              borderColor: bgColor.openPalette ? "#464c54" : "transparent",
              display: tools.showScreen ? "none" : "inline",
            }}
            onClick={() => {
              setBgColor((prev) => ({
                ...prev,
                openPalette: !prev.openPalette,
              }));
            }}
          >
            <PaintRollerIcon />
            <div
              onMouseEnter={() => {
                setShowStickerDetails((prev) => ({ ...prev, hidePen: true }));
              }}
              onMouseLeave={() => {
                setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {bgColor.openPalette && (
                <PickColor
                  pick={(rgba: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                  }) => {
                    setBgColor((prev) => ({
                      ...prev,
                      color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
                    }));
                  }}
                />
              )}
            </div>
          </li>
        </ul>
      </div>
      <div
        id="canvas-container"
        className=""
        style={{ pointerEvents: "none", position: "relative" }}
      ></div>

      <canvas
        style={{
          // width: "100%",
          // height: "100%",

          // position: "relative",
          zIndex: 999999,
          transition: "backgroundColor 0.2s ease-in",
          backgroundColor: tools.showScreen
            ? "transparent"
            : bgColor.color
            ? bgColor.color
            : "white",
        }}
        ref={canvasRef}
      />
      {tools.canvasText && (
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleInput}
          className=""
        >
          <input
            ref={inputRef}
            // maxLength={30}
            placeholder=""
            style={{
              width: "150px",
              height: "30px",
              position: "fixed",
              borderRadius: "3px",
              // pointerEvents: "none",
              zIndex: 99999,

              left: `${showCanvasText.x}px`,
              top: `${showCanvasText.y}px`,
            }}
            onChange={(e) => {
              if (ctx) {
                // ctx.fillStyle = ctx.strokeStyle;
                ctx!.font = `${canvasConf.textSize}px Arial`;
                ctx.fillStyle = showStickerDetails.bgColor;
                ctx.fillText(
                  e.target.value,
                  // showStickerDetails.bgColor,
                  showCanvasText.x,
                  showCanvasText.y
                );
              }
            }}
            type="text"
            className="editor-input"
          />
        </form>
      )}
    </div>
  );
}

export default Canvas;
