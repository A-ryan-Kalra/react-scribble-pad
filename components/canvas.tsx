import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  ALargeSmallIcon,
  Eraser,
  PaletteIcon,
  PenLine,
  StickerIcon,
} from "lucide-react";
import PickColor from "./pick-color";
import { atom, useAtom } from "jotai";
import { isDraggingAtom } from "./sticker-editor";

export const stickerDetails = atom<{
  sticketTextAtom: boolean;
  bgColor: string;
  fontSize: number;
  isEraserOn?: boolean;
}>({
  sticketTextAtom: false,
  bgColor: "",
  fontSize: 16,
});
function Canvas() {
  const [isDragAtom] = useAtom(isDraggingAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palleteRef = useRef<HTMLDivElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [eraserPosition, setEraserPosition] = useState({ x: 0, y: 0 });
  const [showCanvasText, setShowCanvasText] = useState({ x: -100, y: -100 });
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasMap = useRef<{ [key: string]: any }>({});
  const [showStickerDetails, setShowStickerDetails] = useAtom(stickerDetails);
  const [canvasConf, setCanvasConf] = useState<{ textSize: string }>({
    textSize: "",
  });
  const isDrawing = useRef<boolean>(false);
  // const { socketProvider } = useSocket();
  const toolsRef = useRef<{
    eraser: boolean;
    pickColor: boolean;
    showText: boolean;
    canvasText: boolean;
    moveSticker?: boolean;
  }>({
    eraser: false,
    pickColor: false,
    showText: false,
    canvasText: false,
    moveSticker: false,
  });
  const [tools, setTools] = useState<{
    eraser: boolean;
    pickColor: boolean;
    penSize: boolean;
    canvasText: boolean;
  }>({
    eraser: false,
    pickColor: false,
    penSize: false,
    canvasText: false,
  });

  useEffect(() => {
    toolsRef.current.moveSticker = isDragAtom;
  }, [isDragAtom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    // let lastSent = 0;

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
      // const now = Date.now();
      // if (now - lastSent < 10) return;
      if (toolsRef.current.eraser) {
        const touch = event.touches[0];
        setEraserPosition({ x: touch.clientX, y: touch.clientY });

        drawCanvas(touch.clientX, touch.clientY);
      } else {
        const { offSetX, offSetY } = touchStart(event);

        drawCanvas(offSetX, offSetY);
      }
      // lastSent = now;
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
      // sendDataToUser(name as string, "canvas", "stop");
    };
    const drawCanvas = (offsetX: number, offsetY: number) => {
      if (toolsRef.current.eraser) {
        ctx.globalCompositeOperation = "destination-out";
        const size = 100;
        ctx.rect(offsetX - size / 2, offsetY - size / 2, size, size);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        // sendDataToUser(name as string, "canvas", "erase", { offsetX, offsetY });
      } else if (toolsRef.current.showText) {
        // ctx.strokeStyle = "red";
        // ctx.lineWidth = 1;
        // ctx.strokeText("Hello, Canvas!", offsetX, offsetY);
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000"; // text color
        // ctx.fillText("Hello, Canvas!", offsetX, offsetY);
      } else {
        ctx.globalCompositeOperation = "source-over";
        // ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        // ctx.translate(offsetX, offsetY);
        // ctx.font = "20px Arial";
        // console.log(ctx.lineWidth);
        //Draw Reactangle
        // ctx.stroke();
        // ctx!.fillStyle = "blue"; // fill color
        // ctx!.strokeRect(offsetX, offsetY, 200, 150);

        //Draw Circle
        // ctx.beginPath();
        // ctx.arc(offsetX, offsetY, Math.PI, 0, Math.PI * 2); // full circle
        // ctx.fill(); // for filled
        // or
        // sendDataToUser(
        //   name as string,
        //   "canvas",
        //   "draw",
        //   { offsetX, offsetY },
        //   ctx?.strokeStyle as unknown as string,
        //   ctx?.lineWidth,
        //   ctx?.fillStyle as unknown as string
        // );
      }
    };
    const draw = (event: MouseEvent) => {
      // const now = Date.now();
      // if (now - lastSent < 20) return;
      if (!isDrawing.current) return;

      const { offsetX, offsetY } = getMousePosition(event);

      drawCanvas(offsetX, offsetY);

      // lastSent = now;
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
        setTools({
          canvasText: false,
          eraser: false,
          penSize: false,
          pickColor: false,
        });
        toolsRef.current.canvasText = false;
        toolsRef.current.eraser = false;
        toolsRef.current.pickColor = false;
        toolsRef.current.showText = false;
        toolsRef.current.showText = false;
        setShowStickerDetails((prev) => ({
          ...prev,
          sticketTextAtom: false,
          isEraserOn: false,
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
    toolsRef.current.canvasText = !toolsRef.current.canvasText;

    setTools(() => ({
      penSize: false,
      eraser: false,
      pickColor: false,
      canvasText: false,
    }));
  }

  return (
    <div
      style={{
        zIndex: 9999999,
        cursor: tools.canvasText ? "text" : "",
      }}
      className={` canvas-container `}
    >
      {tools.eraser && <div className="eraser-tool" />}

      <div ref={palleteRef} className="pallete-box">
        <ul className="pallete-tools">
          <li
            className={`li-box`}
            style={{
              borderRadius: tools.pickColor ? "0.375rem" : "",
              borderColor: tools.pickColor ? "#62748e" : "transparent",
            }}
            onClick={() => {
              // toolsRef.current.pickColor = true;

              toolsRef.current.canvasText = false;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setTools((prev) => ({
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
            <div onClick={(e) => e.stopPropagation()}>
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
              borderColor: tools.eraser ? "#62748e" : "transparent",
            }}
            onClick={() => {
              setShowStickerDetails((prev) => ({
                ...prev,
                sticketTextAtom: false,
                isEraserOn: !prev.isEraserOn,
              }));

              toolsRef.current.eraser = true;
              toolsRef.current.canvasText = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              setTools((prev) => ({
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
                penSize: !prev.penSize,
                eraser: false,
                pickColor: false,
                canvasText: false,
              }));
              setShowStickerDetails((prev) => ({
                ...prev,
                sticketTextAtom: false,
                isEraserOn: false,
              }));
            }}
            className={` li-box `}
            style={{
              borderRadius: tools.penSize ? "0.375rem" : "",
              borderColor: tools.penSize ? "#62748e" : "transparent",
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
                left: "2.5rem",
                top: 0,
                visibility: tools.penSize ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  background: "#cad5e2",
                  borderRadius: "0.375rem",
                  padding: "0.25rem",
                }}
              >
                <label htmlFor="sketch-pen" className="text-xs">
                  Sketch Pen
                </label>
                <input
                  type="range"
                  id="sketch-pen"
                  max={40}
                  defaultValue={5}
                  onChange={(e) => (ctx!.lineWidth = Number(e.target.value))}
                />
                <label htmlFor="text-size" className="text-xs">
                  Text Size
                </label>
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
                      isEraserOn: false,
                      fontSize:
                        1.2 * Number(e.target.value) > 10
                          ? 1.2 * Number(e.target.value)
                          : 10,
                    }));
                  }}
                />
              </div>
            </div>
          </li>
          <li
            onClick={() => {
              toolsRef.current.canvasText = true;
              toolsRef.current.eraser = false;
              toolsRef.current.pickColor = false;
              toolsRef.current.showText = false;
              ctx!.globalCompositeOperation = "source-over";
              // ctx!.fillStyle = ctx!.strokeStyle;
              setTools(() => ({
                penSize: false,
                eraser: false,
                pickColor: false,
                canvasText: true,
              }));
              setShowStickerDetails((prev) => ({
                ...prev,
                isEraserOn: false,
                sticketTextAtom: false,
              }));
            }}
            className={` li-box `}
            style={{
              borderRadius: tools.canvasText ? "0.375rem" : "",
              borderColor: tools.canvasText ? "#62748e" : "transparent",
            }}
          >
            <ALargeSmallIcon />
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
              setTools(() => ({
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
                ? "#62748e"
                : "transparent",
            }}
          >
            <StickerIcon />
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
          zIndex: 1,
          backgroundColor: "transparent",
        }}
        ref={canvasRef}
      />
    </div>
  );
}

export default Canvas;
