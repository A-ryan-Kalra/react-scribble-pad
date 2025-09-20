import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent as MouseEventHandler,
  type TouchEvent as TouchEventHandler,
} from "react";
import html2canvas from "html2canvas";
import PickColor from "./pick-color";
import { atom, useAtom } from "jotai";
import StickerEditor, {
  isDraggingAtom,
  showStickerInputAtom,
} from "./sticker-editor";
import type {
  BgColorProps,
  StickerDetailsProps,
  ToolsProps,
  ToolsRefProps,
} from "./type";
import RangeIndex from "./range-index";

export const stickerDetails = atom<StickerDetailsProps>({
  sticketTextAtom: false,
  bgColor: "",
  fontSize: 16,
  customizeCursor: false,
  hidePenOnEraser: false,
  rgba: {
    r: 40,
    g: 41,
    b: 42,
    a: 100,
  },
});
export const adjustFullScreenAtom = atom<boolean>(false);

function Canvas() {
  const [isDragAtom] = useAtom(isDraggingAtom);
  const [, setAdjustFullScreen] = useAtom(adjustFullScreenAtom);
  const [bgColor, setBgColor] = useState<BgColorProps>({
    openPalette: false,
    color: "",
    rgba: {
      r: 40,
      g: 41,
      b: 42,
      a: 100,
    },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palleteRef = useRef<HTMLDivElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [chunkHeight, setChunkHeight] = useState(0);
  const [showCanvasText, setShowCanvasText] = useState({ x: -100, y: -100 });
  const inputRef = useRef<HTMLInputElement>(null);
  const trackCursorPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showStickerDetails, setShowStickerDetails] = useAtom(stickerDetails);
  const [canvasConf, setCanvasConf] = useState<{
    textSize: string;
    eraserSize: string;
  }>({
    textSize: "20",
    eraserSize: "100",
  });
  const isDrawing = useRef<boolean>(false);
  const [offset, setOffset] = useState(0);

  const [text, setText] = useState("");
  const [, setShowStickerInput] = useAtom(showStickerInputAtom);
  const toolsRef = useRef<ToolsRefProps>({
    eraser: false,
    pickColor: false,
    showText: false,
    canvasText: false,
    moveSticker: false,
    lockScroll: false,
    showScreen: false,
    adjustFullScreen: false,
    eraserSize: "",
  });
  const [tools, setTools] = useState<ToolsProps>({
    eraser: false,
    pickColor: false,
    penSize: false,
    canvasText: false,
    showScreen: true,
    lockScroll: false,
    adjustFullScreen: false,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (!toolsRef.current.adjustFullScreen) {
      const pageHeight = document.documentElement.scrollHeight;

      if (pageHeight < 6500) {
        setChunkHeight(pageHeight); // smaller pages = full height
      } else {
        setChunkHeight(6500); // bigger pages = 6500px chunks
      }
    }
  }, [tools.adjustFullScreen]);

  useEffect(() => {
    toolsRef.current.moveSticker = isDragAtom;
    const checkPoint = () => {
      updateScale();
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true);
      } else {
        setIsTouchDevice(false);
      }
    };

    function updateScale() {
      const width = window.innerWidth;
      let scale = 1;
      if (width <= 380) scale = 0.7;
      else if (width <= 440) scale = 0.8;
      document.documentElement.style.setProperty("--scale", scale.toString());
    }

    checkPoint();
    window.addEventListener("resize", checkPoint);

    return () => {
      window.removeEventListener("resize", checkPoint);
    };
  }, [isDragAtom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    setCtx(context);
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    let height = chunkHeight; // full page height
    canvas.style!.position = "relative";

    if (toolsRef.current.adjustFullScreen) {
      height = window.innerHeight;
      canvas.style!.position = "fixed";
      canvas.style!.top = "0px";
      canvas.style!.left = "0px";
    }

    // set backing resolution
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // set CSS display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // reset + apply scaling

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before scaling
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 5;
    ctx.strokeStyle = showStickerDetails.bgColor ?? "#000";
    ctx.fill();
    ctx.font = "20px 'Architects Daughter', cursive";
    // It will start loading from the first character
    document.fonts.ready.then(() => {
      ctx.font = "20px 'Architects Daughter', cursive";
      ctx.fillText("", 50, 50);
    });

    const getMousePosition = (event: MouseEvent) => {
      const react = canvas.getBoundingClientRect();
      const offsetX = event.clientX - react.left;
      const offsetY = event.clientY - react.top;

      return { offsetX, offsetY };
    };

    function touchStart(event: TouchEvent) {
      if (!toolsRef.current.lockScroll) {
        return;
      }
      let offSetX = 0;
      let offSetY = 0;
      isDrawing.current = true;
      if (event?.touches?.length > 0) {
        let touch = event?.touches[0];

        offSetX = touch.clientX;
        offSetY = !tools.adjustFullScreen
          ? window.scrollY + touch.clientY
          : touch.clientY;
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
        const offsetY = !tools.adjustFullScreen
          ? window.scrollY + touch.clientY
          : touch.clientY;

        drawCanvas(touch.clientX, offsetY);
        document.documentElement.style.setProperty(
          "--eraserPositionX",
          `${touch.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--eraserPositionY",
          `${touch.clientY}px`
        );
      } else {
        const isLockScreenDisabled = touchStart(event);
        if (isLockScreenDisabled) {
          const { offSetX, offSetY } = isLockScreenDisabled;

          drawCanvas(offSetX, offSetY);
        }
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
        const size = Number(toolsRef.current.eraserSize)
          ? Number(toolsRef.current.eraserSize)
          : 100;

        ctx.rect(offsetX - size / 2, offsetY - size / 2, size, size);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else if (toolsRef.current.showText) {
        ctx.font = "20px 'Architects Daughter', cursive";
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
      trackCursorPosRef.current.x = event.clientX;
      trackCursorPosRef.current.y = event.clientY;

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
          setShowCanvasText({
            x: event.clientX,
            y: event.clientY,
          });
        }
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAllTools();
      }
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    window.addEventListener("mousemove", handleEraser);
    window.addEventListener("mousedown", showCanvasTextPosition);
    window.addEventListener("keydown", handleEscapeKey, true);
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
      window.removeEventListener("keydown", handleEscapeKey, true);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", stopDrawing);
    };
  }, [ctx, tools.adjustFullScreen, chunkHeight]);

  function closeAllTools() {
    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      canvasText: false,
      eraser: false,
      penSize: false,
      pickColor: false,
      // lockScroll: false,
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
      hidePenOnEraser: false,
    }));
  }
  function handleInput(e: FormEvent) {
    e.preventDefault();
    setText("");
    // toolsRef.current.canvasText = !toolsRef.current.canvasText;
    inputRef.current!.value = "";
    ctx!.fillText("", showCanvasText.x, showCanvasText.y);
  }

  function showEraser(event: MouseEventHandler<HTMLLIElement>) {
    document.documentElement.style.setProperty(
      "--eraserPositionX",
      `${event.clientX}px`
    );
    document.documentElement.style.setProperty(
      "--eraserPositionY",
      `${event.clientY}px`
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
  const proxyImage = async (url: string) => {
    try {
      const res = await fetch(url, { mode: "cors" }); // may need <all_urls> in extension
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // base64 string
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Proxy failed for", url, e);
      return url; // fallback to original if proxy fails
    }
  };

  // Preload & replace external images
  const preloadImages = async () => {
    const imgs = Array.from(document.images);

    await Promise.all(
      imgs.map(async (img: any) => {
        // wait for normal load first
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }

        // If cross-origin, proxy it
        if (
          img.src.startsWith("http") &&
          !img.src.startsWith(window.location.origin)
        ) {
          const proxied = await proxyImage(img.src);
          img.src = proxied; // replace with data URI
        }
      })
    );
  };
  function handleScrollLock() {
    toolsRef.current.canvasText = false;
    toolsRef.current.eraser = false;
    toolsRef.current.pickColor = false;
    toolsRef.current.showText = false;
    toolsRef.current.lockScroll = !toolsRef.current.lockScroll;
    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      eraser: false,
      penSize: false,
      pickColor: false,
      canvasText: false,
      lockScroll: !prev.lockScroll,
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
    closeAllTools();
  };
  const handleScreenshot = async () => {
    await preloadImages();
    const element = document.documentElement;

    const canvas = await html2canvas(element, {
      ignoreElements: (el) =>
        el.tagName === "IFRAME" ||
        el.tagName === "SCRIPT" ||
        el.classList.contains("no-screenshot"),
      useCORS: true,
      allowTaint: false,
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      // windowWidth: document.documentElement.scrollWidth,
      // windowHeight: document.documentElement.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/webp");

    // download the screenshot
    const link = document.createElement("a");
    link.href = imgData;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    link.download = `scribble-pad-${year}-${month}-${day}-${minutes}-${seconds}-${date.getMilliseconds()}.webp`;
    link.click();
  };
  function handleAdjustFullScreen() {
    toolsRef.current.adjustFullScreen = !toolsRef.current.adjustFullScreen;
    setAdjustFullScreen((prev) => !prev);
    handleReset();
    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      eraser: false,
      penSize: false,
      pickColor: false,
      canvasText: false,
      // lockScroll: false,
      adjustFullScreen: !prev.adjustFullScreen,
    }));
  }
  function handlePaletteTools() {
    {
      // toolsRef.current.pickColor = true;

      toolsRef.current.canvasText = false;
      toolsRef.current.eraser = false;
      toolsRef.current.pickColor = false;
      toolsRef.current.showText = false;
      setText("");
      setShowStickerInput(false);
      setTools((prev) => ({
        ...prev,
        eraser: false,
        penSize: false,
        pickColor: !prev.pickColor,
        canvasText: false,
      }));
      setBgColor((prev) => ({
        ...prev,
        openPalette: false,
      }));
      setShowStickerDetails((prev) => ({
        ...prev,
        sticketTextAtom: false,
        // hidePen: !prev.hidePen,
        hidePenOnEraser: false,
      }));
    }
  }
  function handleEraserTool(event: MouseEventHandler<HTMLLIElement>) {
    // event.stopPropagation();
    showEraser(event);

    setShowStickerDetails((prev) => ({
      ...prev,
      sticketTextAtom: false,
      // hidePen: !prev.hidePen,
      hidePenOnEraser: !prev.hidePenOnEraser,
    }));

    toolsRef.current.eraser = !toolsRef.current.eraser;
    toolsRef.current.canvasText = false;
    toolsRef.current.pickColor = false;
    toolsRef.current.showText = false;
    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      penSize: false,
      pickColor: false,
      eraser: !prev.eraser,
      canvasText: false,
    }));
  }

  const handleSticketTool = () => {
    toolsRef.current.canvasText = false;
    toolsRef.current.eraser = false;
    toolsRef.current.pickColor = false;
    toolsRef.current.showText = false;
    setShowStickerDetails((prev) => ({
      ...prev,
      sticketTextAtom: !prev.sticketTextAtom,
      hidePenOnEraser: false,
    }));

    setText("");
    setTools((prev) => ({
      ...prev,
      penSize: false,
      eraser: false,
      pickColor: false,
      canvasText: false,
    }));
  };

  function handleCursorTool() {
    toolsRef.current.canvasText = false;
    toolsRef.current.eraser = false;
    toolsRef.current.pickColor = false;
    toolsRef.current.showText = false;

    setText("");
    setShowStickerInput(false);
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
      hidePenOnEraser: false,
    }));
  }

  const handleKeyboardTool = () => {
    toolsRef.current.canvasText = true;
    toolsRef.current.eraser = false;
    toolsRef.current.pickColor = false;
    toolsRef.current.showText = !toolsRef.current.showText;
    ctx!.globalCompositeOperation = "source-over";
    // ctx!.fillStyle = ctx!.strokeStyle;

    setText("");
    setShowStickerInput(false);
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
      hidePenOnEraser: false,
    }));
    inputRef.current?.focus();
  };
  function handleRollerIconTool() {
    setBgColor((prev) => ({
      ...prev,
      openPalette: !prev.openPalette,
    }));

    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      eraser: false,
      penSize: false,
      pickColor: false,
      canvasText: false,
    }));
    setShowStickerDetails((prev) => ({
      ...prev,
      sticketTextAtom: false,
      // hidePen: !prev.hidePen,
      hidePenOnEraser: false,
    }));
  }

  function handleSwitchScreenTool() {
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }

    setShowStickerDetails((prev) => ({
      ...prev,
      sticketTextAtom: false,
      // hidePen: !prev.hidePen,
      hidePenOnEraser: false,
    }));

    setText("");
    setShowStickerInput(false);
    setTools((prev) => ({
      ...prev,
      penSize: false,
      eraser: false,
      pickColor: false,
      canvasText: false,
      showScreen: !prev.showScreen,
    }));

    toolsRef.current.showScreen = !toolsRef.current.showScreen;
  }
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;

      // If typing in input, textarea, or contenteditable → ignore
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        e.key === "Escape"
      ) {
        return;
      }
      e.stopPropagation();
      e.stopImmediatePropagation();

      const num = Number(e.key);
      if (num >= 1 && num <= 8) {
        switch (num) {
          case 1:
            handlePaletteTools();
            setShowStickerDetails((prev) => ({
              ...prev,
              hidePen: false,
              hidePenOnEraser: false,
            }));
            break;
          case 2:
            const event = {
              clientX: trackCursorPosRef.current.x,
              clientY: trackCursorPosRef.current.y,
            };
            handleEraserTool(event as MouseEventHandler<HTMLLIElement>);

            break;
          case 3:
            handleCursorTool();
            break;
          case 4:
            handleKeyboardTool();
            break;
          case 5:
            handleSticketTool();
            break;
          case 6:
            handleSwitchScreenTool();
            break;
          case 7:
            if (!toolsRef.current.showScreen) return;
            handleRollerIconTool();
            break;
          case 8:
            handleReset();
            break;
        }
      }
    }

    function handleScrollCanvas() {
      if (toolsRef.current.adjustFullScreen) return;

      const scrollY = window.scrollY;

      const pageHeight = document.documentElement.scrollHeight;

      // Snap offset in multiples of chunkHeight
      let newOffset = Math.floor(scrollY / chunkHeight) * chunkHeight;

      // Clamp so canvas never overshoots beyond page bottom
      const maxOffset = Math.max(0, pageHeight - chunkHeight);
      if (newOffset > maxOffset) {
        newOffset = maxOffset;
      }

      if (newOffset !== offset) {
        ctx!.clearRect(
          0,
          0,
          Number(canvasRef!.current?.width),
          Number(canvasRef!.current?.height)
        );
        setOffset(newOffset);
      }
    }

    window.addEventListener("scroll", handleScrollCanvas);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", handleScrollCanvas);
    };
  }, [ctx, offset]);

  return (
    <div
      style={{
        zIndex: 214748367,
        cursor: tools.canvasText ? "text" : "",
      }}
      className={`canvas-container`}
    >
      {tools.eraser && <div className="eraser-tool"></div>}

      <div
        onMouseEnter={() => {
          setShowStickerDetails((prev) => ({ ...prev, hidePen: true }));
        }}
        onMouseLeave={() => {
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        }}
        className={`pallete-box no-screenshot`}
        style={{
          width: "fit-content",
          transition: "width 0.2s ease-in",
        }}
        ref={palleteRef}
      >
        <ul className="pallete-tools">
          <div className="ul-container">
            <ul
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "0.3rem",
                borderRight: "1px solid #949597",
                marginRight: "4px",
                paddingRight: "4px",
              }}
            >
              <li
                title="Screen lock for touch-users"
                className={`li-box  ${tools.lockScroll ? "show" : ""} ${
                  !isTouchDevice && "hover"
                }`}
                onClick={handleScrollLock}
              >
                <span className="lock"></span>
              </li>
              <li
                title="Screen Mode"
                className={`li-box  ${tools.adjustFullScreen ? "show" : ""} ${
                  !isTouchDevice && "hover"
                }`}
                onClick={handleAdjustFullScreen}
              >
                <span className="full-screen"></span>
              </li>
              <li
                title="Screenshot"
                className={`li-box hover`}
                onClick={handleScreenshot}
              >
                <span className="screenshot"></span>
              </li>
            </ul>
          </div>
          <ul
            style={{
              // width: "100%",
              display: "flex",
              justifyContent: "center",
              columnGap: "0.5rem",
            }}
          >
            <li
              title="Color Palette"
              className={`li-box  ${tools.pickColor ? "show" : ""} ${
                !isTouchDevice && "hover"
              }`}
              onClick={handlePaletteTools}
            >
              <span className={`palette-outline`} />
              <RangeIndex value="1" bottom="-1" right="-1" />
              <div onClick={(e) => e.stopPropagation()}>
                {tools.pickColor && (
                  <PickColor
                    position="-3rem"
                    colorState={showStickerDetails.rgba}
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
                        rgba: { ...rgba },
                      }));
                    }}
                  />
                )}
              </div>
            </li>
            <li
              title="Eraser"
              className={`li-box  ${tools.eraser ? "show" : ""} ${
                !isTouchDevice && "hover"
              }`}
              onTouchStart={showEraserOnTouch}
              onClick={handleEraserTool}
            >
              <span
                className="eraser-line"
                style={{ fill: tools.eraser ? "#cad5e2" : "" }}
              />
              <RangeIndex value="2" bottom="-1" right="-1" />
            </li>
            <li
              title="Customize Tools"
              onClick={handleCursorTool}
              className={`li-box ${tools.penSize ? "show" : ""} ${
                !isTouchDevice && "hover"
              }`}
            >
              <span className="pencil-tools" />
              <RangeIndex value="3" bottom="-1" right="-1" />

              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  left: "-2rem",
                  zIndex: "214748364",
                  bottom: 50,
                  visibility: tools.penSize ? "visible" : "hidden",
                }}
              >
                <div
                  style={{
                    background: "#cad5e2",
                    borderRadius: "0.375rem",
                    zIndex: "214748364",
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
                  <label htmlFor="text-size">
                    Text Size: {`${Math.floor(Number(canvasConf.textSize))}`}
                  </label>
                  <input
                    type="range"
                    id="text-size"
                    max={80}
                    defaultValue={20}
                    onChange={(e) => {
                      setCanvasConf((prev) => ({
                        ...prev,
                        textSize: (1.2 * Number(e.target.value) > 10
                          ? 1.2 * Number(e.target.value)
                          : 10
                        ).toString(),
                      }));
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
                  <label htmlFor="eraser-size">
                    Eraser Size:{" "}
                    {`${Math.floor(Number(canvasConf.eraserSize))}`}
                  </label>
                  <input
                    type="range"
                    id="eraser-size"
                    maxLength={100}
                    defaultValue={100}
                    onChange={(e) => {
                      let size =
                        Number(e.target.value) > 20
                          ? Number(e.target.value)
                          : 20;

                      setCanvasConf((prev) => ({
                        ...prev,
                        eraserSize: size.toString(),
                      }));

                      document.documentElement.style.setProperty(
                        "--eraserWidth",
                        `${size}px`
                      );
                      document.documentElement.style.setProperty(
                        "--eraserHeight",
                        `${size}px`
                      );

                      toolsRef.current.eraserSize = size.toString();
                    }}
                  />
                  <div>
                    <label style={{ fontSize: "14px" }}>
                      Display Cursor Color
                    </label>
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
              title="Keyboard"
              onClick={handleKeyboardTool}
              className={` li-box  ${tools.canvasText ? "show" : ""} ${
                !isTouchDevice && "hover"
              } `}
            >
              <span className="keyboard" />
              <RangeIndex value="4" bottom="-1" right="-1" />
            </li>
            <li
              title="Notes"
              onClick={handleSticketTool}
              className={`li-box ${
                showStickerDetails.sticketTextAtom ? "show" : ""
              } ${!isTouchDevice && "hover"}`}
            >
              <span className="sticker" />
              <RangeIndex value="5" bottom="-1" right="-1" />
            </li>
            <li
              title="Whiteboard"
              className={` li-box  ${!isTouchDevice && "hover"} `}
            >
              {tools.showScreen ? (
                <div onClick={handleSwitchScreenTool}>
                  <span className="screen" />
                </div>
              ) : (
                <div onClick={handleSwitchScreenTool}>
                  <span className="screen-off" />
                </div>
              )}
              <RangeIndex value="6" bottom="-1" right="-1" />
            </li>

            <li
              title="Paint Roller"
              className={` li-box ${bgColor.openPalette ? "show" : ""} ${
                !isTouchDevice && "hover"
              }`}
              style={{
                pointerEvents: tools.showScreen ? "none" : "auto",
                // backgroundColor: tools.showScreen ? "#efefef" : "",
                transition:
                  "backgroundColor 0.2s 0.1s ease-in,opacity 0.1s ease-out",
                opacity: tools.showScreen ? 0.5 : 1,
              }}
              onClick={handleRollerIconTool}
            >
              <span className="paint-roller" />
              <div onClick={(e) => e.stopPropagation()}>
                {bgColor.openPalette && !tools.showScreen && (
                  <PickColor
                    colorState={bgColor.rgba}
                    position="-11rem"
                    pick={(rgba: {
                      r: number;
                      g: number;
                      b: number;
                      a: number;
                    }) => {
                      setBgColor((prev) => ({
                        ...prev,
                        color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
                        rgba: { ...rgba },
                      }));
                    }}
                  />
                )}
              </div>
              <RangeIndex value="7" bottom="-1" right="-1" />
            </li>
            <li
              title="Reset Tools"
              style={{
                cursor: "pointer",
              }}
              className={`li-box ${!isTouchDevice && "hover"}`}
              onClick={handleReset}
            >
              <span className="reset" />
              <RangeIndex value="8" bottom="-1" right="-1" />
            </li>
          </ul>
        </ul>
      </div>
      <div
        id="canvas-container"
        className=""
        style={{ pointerEvents: "none", position: "relative" }}
      ></div>
      <StickerEditor />
      <canvas
        style={{
          touchAction: tools.lockScroll ? "none" : "auto",
          // width: "100%",
          // height: "100%",
          // touchAction: "none"
          height: `${chunkHeight}px`,
          top: offset + "px",
          position: "relative",
          zIndex: 214748364,
          transition: "background-color 0.02s ease-in",
          backgroundColor: tools.showScreen
            ? "transparent"
            : bgColor.color
            ? bgColor.color
            : "white",
        }}
        height={chunkHeight}
        ref={canvasRef}
      />

      {tools.canvasText && (
        <form onClick={(e) => e.stopPropagation()} onSubmit={handleInput}>
          <input
            ref={inputRef}
            onMouseDown={() => {
              setTimeout(() => {
                inputRef?.current?.focus();
              }, 0);
            }}
            // maxLength={30}
            placeholder=""
            style={{
              width: "150px",
              height: "30px",
              position: "fixed",
              borderRadius: "3px",
              // pointerEvents: "none",
              zIndex: 214748365,

              left: `${showCanvasText.x}px`,
              top: `${showCanvasText.y}px`,
            }}
            value={text}
            onChange={(e) => {
              const newText = e.target.value;
              const fontSize = canvasConf.textSize || "20";

              const adjustSize =
                Number(fontSize) <= 20 ? 8 : Number(fontSize) >= 50 ? 25 : 20;

              if (ctx) {
                ctx!.font = `${fontSize}px 'Architects Daughter', cursive`;
                ctx.fillStyle = showStickerDetails.bgColor;
                // if text got shorter (deletion happened)

                if (newText.length < text.length) {
                  ctx.clearRect(
                    showCanvasText.x - 2,
                    showCanvasText.y + window.scrollY - Number(fontSize), // go up by font size
                    ctx.measureText(text + "M").width, // width of text + buffer
                    Number(fontSize) + adjustSize
                  );
                }

                // redraw whatever is in the input
                ctx.fillText(
                  newText,
                  showCanvasText.x,
                  showCanvasText.y +
                    (!tools.adjustFullScreen ? window.scrollY : 0)
                );
              }

              setText(newText);
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
