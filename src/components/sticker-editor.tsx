import { useEffect, useRef, useState, type FormEvent } from "react";

import { atom, useAtom } from "jotai";
import { adjustFullScreenAtom, stickerDetails } from "./canvas";
// declare var iro: any;
import iro from "@jaames/iro";
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
    document.addEventListener(
      "copy",
      (e: ClipboardEvent) => {
        // Stop default copy behavior
        e.preventDefault();

        const text = window.getSelection()?.toString() || "";

        // Optional: trim whitespace
        // const cleanText = text.replace(/\s+/g, " ").trim();

        // Put cleaned text into the clipboard
        e.clipboardData?.setData("text/plain", text);
      },
      true
    );

    const handleMouseDown = (event: MouseEvent) => {
      // const parentElement = document.querySelector(".dynamic-input");
      const parentElement = Array.from(
        document.querySelectorAll(".dynamic-input")
      );

      const target = event.target as HTMLElement;

      const isIncluded: boolean = parentElement?.some((entry) =>
        entry?.contains(target)
      );

      if (
        // parentElement?.contains(target) ||
        isIncluded ||
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
          inputRef.current?.focus();
        }, 200);
      }

      const data = {
        x: event.clientX,
        y: event.clientY,
        width: window.innerWidth,
        height: window.innerHeight,
        pageX: event.pageX,
        pageY: event.clientY,
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
    if (!input.trim()) return;

    const divEl = document.createElement("div");

    divEl.textContent = input;

    divEl.style.minWidth = "fit-content";
    divEl.style.maxWidth = "250px";
    divEl.style.minHeight = "fit-content";
    divEl.style.marginRight = "1rem";
    // divEl.style.minHeight = "50px";
    // divEl.style.maxHeight = "100px";
    divEl.style.resize = "both";
    // divEl.style.overflow = "auto";
    divEl.contentEditable = "true";
    divEl.setAttribute("placeholder", "Max 30 words");
    divEl.style.whiteSpace = "wrap";
    divEl.style.wordBreak = "break-word";
    divEl.style.cssText += "box-sizing: content-box !important;";
    divEl.style.overflowWrap = "break-word";
    divEl.style.border = "none";
    divEl.style.outline = "none";
    divEl.style.borderRadius = "10px";
    divEl.style.padding = "0.75rem 1.2rem 1.2rem 0.75rem";
    divEl.tabIndex = 1;

    divEl.style.backdropFilter = "blur(10px)";
    divEl.style.zIndex = "214748365";
    // divEl.style.fontSize = "16px";

    divEl.spellcheck = false;
    divEl.style.touchAction = "none";
    divEl.style.color = "#1b1919";
    // divEl.style.fontWeight = "1000";
    if (isAsciiArt(input)) {
      divEl.style.font = `16px 'Architects Daughter', cursive, 'Courier New', monospace, sans-serif`;
    } else {
      divEl.style.font = `1000 16px 'Architects Daughter', cursive, 'Courier New', monospace, sans-serif`;
    }

    divEl.style.letterSpacing = "1px";
    divEl.style.background = "rgba(37, 235, 221, 0.6)";
    divEl.style.cursor = "grab";
    divEl.style.border = `2px solid rgba(37, 235, 221, 0.6)`;
    divEl.style.position = adjustFullScreen.adjustScreen ? "fixed" : "absolute";
    divEl.style.left = `${
      adjustFullScreen.adjustScreen ? userCursor.x : userCursor.pageX
    }px`;

    divEl.style.top = `${
      adjustFullScreen.adjustScreen
        ? userCursor.y
        : userCursor.pageY + window.scrollY
    }px`;
    divEl.className = "dynamic-input";
    let date = Date.now();
    const triggerBtn = document.createElement("div");
    triggerBtn.id = `trigger-${date}`;
    // triggerBtn.textContent = "Click me";
    triggerBtn.style.fontSize = "0";
    triggerBtn.style.width = "fit-content";
    triggerBtn.style.aspectRatio = "1/1";
    triggerBtn.style.height = "fit-content";
    triggerBtn.style.position = "absolute";
    triggerBtn.style.background = "white";
    triggerBtn.style.left = "0";
    triggerBtn.style.padding = "0.08rem";
    triggerBtn.style.margin = "0 0 0.1rem 0.1rem";
    triggerBtn.style.bottom = "0";
    triggerBtn.style.border = "1.5px solid rgba(37, 235, 221, 0.6)";
    triggerBtn.style.borderTopRightRadius = "5px";
    triggerBtn.style.borderBottomLeftRadius = "5px";
    triggerBtn.style.userSelect = "none";
    triggerBtn.innerHTML = `<svg viewBox="0 0 26 26" width="11" height="11" style="display:block;">
  <g fill="none" stroke="#000" stroke-width="2.5">
    <circle cx="12" cy="12" r="3"/>
    <path d="M13.765 2.152C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7s-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453s.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.62 1.62 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z"/>
  </g>
</svg>`;
    // triggerBtn.style.zIndex = "1010";
    divEl.appendChild(triggerBtn);

    // 4️⃣ Create container that opens when button is clicked
    const container = document.createElement("div");
    container.className = `container-${date}`;
    container.style.position = "absolute";
    // container.style.left = "0px";
    container.style.margin = "4px";
    container.style.width = "fit-content";
    container.style.minHeight = "fit-content";
    container.style.top = "-5px"; // above the button
    // container.style.bottom = "100%"; // above the button
    container.style.left = "-170px";
    // container.style.right = "100%"; // above the button
    container.style.display = "none";
    container.style.background = "#ffffff";
    container.style.padding = "0.2rem";
    container.style.border = "1px solid #ccc";
    container.style.borderRadius = "5px";
    container.style.userSelect = "none";
    container.contentEditable = "false";
    container.style.fontSize = "0";
    // container.style.zIndex = "214748366";

    // inner content for color pickers
    const colorContainer = document.createElement("div");
    colorContainer.className = `color-container-${date}`;
    colorContainer.style.columnGap = "10px";
    colorContainer.style.display = "flex";
    colorContainer.style.justifyContent = "space-between";
    colorContainer.style.alignItems = "center";
    colorContainer.style.width = "auto";
    colorContainer.style.minHeight = "fit-content";
    colorContainer.contentEditable = "false";
    colorContainer.style.padding = "0.1rem";
    colorContainer.style.paddingBottom = "0.2rem";
    colorContainer.style.userSelect = "none";
    colorContainer.style.fontSize = "0";
    colorContainer.style.marginBottom = "0.3rem";

    const picker1 = document.createElement("div");
    picker1.className = `picker-1-${date}`;
    picker1.style.width = "fit-content";
    picker1.style.height = "fit-content";
    // picker1.style.display = "inline-block";
    // picker1.style.marginRight = "5px";

    const picker2 = document.createElement("div");
    picker2.className = `picker-2-${date}`;
    picker2.style.width = "fit-content";
    picker2.style.height = "fit-content";

    // picker2.style.display = "inline-block";

    colorContainer.appendChild(picker1);
    colorContainer.appendChild(picker2);

    const rangeInputDiv = document.createElement("div");
    rangeInputDiv.style.borderTop = "1.5px solid #aba3a3";
    rangeInputDiv.className = `input-div`;
    rangeInputDiv.style.backgroundColor = "#e5e2e2";
    rangeInputDiv.style.borderBottomLeftRadius = "5px";
    rangeInputDiv.style.borderBottomRightRadius = "5px";
    rangeInputDiv.style.width = "100%";

    const rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.className = `input-${date}`;
    rangeInput.style.width = "90%";
    // rangeInput.style.marginTop = "5px";
    rangeInput.contentEditable = "false";
    rangeInput.style.userSelect = "none";
    rangeInput.style.fontSize = "0";
    rangeInput.max = "100";
    rangeInput.min = "5";
    rangeInput.value = "16";

    container.appendChild(colorContainer);
    rangeInputDiv.appendChild(rangeInput);
    container.appendChild(rangeInputDiv);
    divEl.appendChild(container);

    const resizeHandle = document.createElement("div");
    resizeHandle.style.width = "fit-content";
    resizeHandle.style.height = "fit-content";
    resizeHandle.style.background = "white";
    resizeHandle.style.border = "1.5px solid rgba(37, 235, 221, 0.6)";
    resizeHandle.style.borderTopLeftRadius = "5px";
    resizeHandle.style.borderBottomRightRadius = "5px";
    resizeHandle.style.margin = "0 0.1rem 0.1rem 0";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.padding = "0.08rem";
    resizeHandle.style.cursor = "nwse-resize";
    // resizeHandle.className = "dynamic-input";
    resizeHandle.style.fontSize = "0";
    // resizeHandle.id = "resizer";
    resizeHandle.style.userSelect = "none"; // avoid text selection
    resizeHandle.innerHTML = `
  <svg viewBox="0 0 26 26" width="11" height="11" style="display:block;">
    <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m16 18l2-2m-7 2l7-7M6 18L18 6"/>
  </svg>
`;
    const removeNoteEl = document.createElement("div");
    removeNoteEl.style.width = "fit-content";
    removeNoteEl.style.height = "fit-content";
    removeNoteEl.style.background = "white";
    removeNoteEl.style.border = "1.5px solid rgba(37, 235, 221, 0.6)";
    removeNoteEl.style.borderTopRightRadius = "5px";
    removeNoteEl.style.borderBottomLeftRadius = "5px";
    // removeNoteEl.style.borderRadius = "10px";
    removeNoteEl.style.margin = "0.1rem 0.1rem 0 0";
    removeNoteEl.style.position = "absolute";
    removeNoteEl.style.right = "0";
    removeNoteEl.style.top = "0";
    removeNoteEl.style.padding = "0.08rem";
    // removeNoteEl.style.cursor = "nwse-resize";
    // removeNoteEl.className = "dynamic-input";
    removeNoteEl.style.fontSize = "0";
    // removeNoteEl.id = "resizer";
    removeNoteEl.style.userSelect = "none"; // avoid text selection
    removeNoteEl.innerHTML = `
 <svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 26 26"
     width="11"
     height="11"
     fill="none"
     stroke="#bc3a3a"
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-miterlimit="10"
     stroke-width="2.5">
  <path d="m7.757 16.243l8.486-8.486m0 8.486L7.757 7.757"/>
</svg>
`;
    // resizeHandle.contentEditable = "false";
    divEl.append(removeNoteEl);
    divEl.append(resizeHandle);

    document.body.append(divEl);

    removeNoteEl.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        divEl.remove();
      },
      true
    );
    removeNoteEl.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      removeNoteEl.style.backgroundColor = "#bdc2bdee";
      triggerBtn.style.transition = "background-color 0.1s ease-out";
    });
    removeNoteEl.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      removeNoteEl.style.backgroundColor = "white";
    });

    triggerBtn.addEventListener(
      "click",
      () => {
        container.style.display =
          container.style.display === "none" ? "block" : "none";
      },
      true
    );
    triggerBtn.addEventListener(
      "mouseenter",
      () => {
        triggerBtn.style.backgroundColor = "#bdc2bdee";
        triggerBtn.style.transition = "background-color 0.1s ease-out";
      },
      true
    );
    triggerBtn.addEventListener(
      "mouseleave",
      () => {
        triggerBtn.style.backgroundColor = "white";
      },
      true
    );

    var colorPicker1 = new (iro.ColorPicker as any)(`.picker-1-${date}`, {
      width: 70,
      sliderSize: 9,
      wheelLightness: true,
      color: "rgba(37, 235, 221, 0.6)",
      handleRadius: 5,
      layout: [
        { component: iro.ui.Wheel },
        {
          component: iro.ui.Slider,
          options: {
            // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
            sliderType: "value",
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
            sliderType: "saturation",
          },
        },
      ],
    });

    var colorPicker2 = new (iro.ColorPicker as any)(`.picker-2-${date}`, {
      width: 70,
      sliderSize: 9,
      wheelLightness: true,
      color: "rgba(37, 235, 221, 0.6)",
      handleRadius: 5,
      layout: [
        { component: iro.ui.Wheel },
        {
          component: iro.ui.Slider,
          options: {
            // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
            sliderType: "value",
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
            sliderType: "kelvin",
          },
        },
      ],
    });
    colorPicker1.on("color:change", function (color: any) {
      divEl.style.background = `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
      divEl.style.border = `2px solid rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
      resizeHandle.style.border = `1.5px solid ${color.rgbaString}`;
      triggerBtn.style.border = `1.5px solid ${color.rgbaString}`;
      removeNoteEl.style.border = `1.5px solid ${color.rgbaString}`;
    });
    colorPicker2.on("color:change", function (color: any) {
      divEl.style.color = `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
    });

    rangeInput.oninput = (event: any) => {
      const fontSize = event.target?.value;
      // divEl.style.font = `${divEl.style.fontWeight} ${fontSize}px 'Architects Daughter', cursive`;
      divEl.style.fontSize = `${fontSize}px`;
    };

    let isResizing = false;
    function checkNotesButton() {
      if (
        !divEl.contains(resizeHandle) ||
        !divEl.contains(container) ||
        !divEl.contains(triggerBtn) ||
        !divEl.contains(removeNoteEl)
      ) {
        divEl.appendChild(container);
        divEl.appendChild(triggerBtn);
        divEl.appendChild(resizeHandle);
        divEl.appendChild(removeNoteEl);
      }
    }
    function isAsciiArt(text: string): boolean {
      // Check if text contains block/box-drawing characters or braille patterns
      const asciiArtChars = /[\u2580-\u259F\u2500-\u257F\u2800-\u28FF]/;

      // Or check if it has a high density of spaces and symbols
      const spaceRatio =
        (text.match(/\s/g)?.length ?? 0) / Math.max(text.length, 1);

      return asciiArtChars.test(text) || spaceRatio > 0.3;
    }
    // Fail-safe incase divEl removes all the elemtns
    divEl.addEventListener("input", () => {
      divEl.style.width = "fit-content";

      checkNotesButton();
      if (divEl.textContent?.trim() === "") {
        divEl.style.width = "50px";
        divEl.textContent = "\u200B";
        checkNotesButton();
        // divEl.style.height = "auto";
      }
    });
    document.addEventListener(
      "scroll",
      () => {
        const react = divEl.getBoundingClientRect();
        const isContainerOpened =
          container.style.display === "none" ? false : true;

        if (
          !(react.top + window.innerHeight > window.innerHeight) &&
          isContainerOpened
        ) {
          container.style.top = "";
          container.style.bottom = "-4px";
        } else {
          container.style.bottom = "";
          container.style.top = "-4px";
        }
      },
      { passive: true, capture: true }
    );
    document.addEventListener(
      "mousemove",
      () => {
        const react = divEl.getBoundingClientRect();
        const isContainerOpened =
          container.style.display === "none" ? false : true;

        if (
          !(react.top + window.innerHeight > window.innerHeight) &&
          isContainerOpened
        ) {
          container.style.top = "";
          container.style.bottom = "-4px";
        } else {
          container.style.bottom = "";
          container.style.top = "-4px";
        }
      },
      { capture: true }
    );
    divEl.addEventListener(
      "paste",
      function (e) {
        e.preventDefault();

        const newFont = parseInt(divEl.style.fontSize);

        // Get plain text only
        if (e.clipboardData && e.clipboardData.getData) {
          const text = e.clipboardData.getData("text/plain");

          if (isAsciiArt(text)) {
            divEl.style.font = `${newFont}px 'Architects Daughter', cursive, 'Courier New', monospace, sans-serif`;
          }

          // Insert plain text at cursor position
          document.execCommand("insertText", false, text);
        }
      },
      true
    );
    divEl.addEventListener(
      "copy",
      function (e) {
        e.preventDefault();
        const sel = window.getSelection();
        if (!sel) return;
        let text = sel.toString();

        text = text.replace(/\u00A0/g, " ");

        e.clipboardData!.setData("text/plain", text);
      },
      true
    );

    resizeHandle.addEventListener(
      "touchstart",
      (e) => {
        // e.preventDefault();
        e.stopPropagation();

        isResizing = true;
      },
      { passive: true, capture: true }
    );

    resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
    });

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!isResizing) return;

        const touch = e.touches[0];
        const rect = divEl.getBoundingClientRect();
        let newHeight = touch.clientY - rect.top;

        const divElTextLength = divEl?.textContent?.trim()?.length
          ? divEl?.textContent?.trim()?.length
          : 0;
        const offsetX = touch.clientX - rect.left;
        let newWidth = divElTextLength < 210 ? offsetX : Math.max(offsetX, 150);

        divEl.style.width = newWidth + "px";
        divEl.style.maxWidth = newWidth + "px";
        // divEl.style.minWidth = "50px";
        // divEl.style.height = newHeight + "px";
        // divEl.style.maxHeight = newHeight + "px";
        divEl.style.minWidth = newWidth + "px";
        divEl.style.minHeight = Math.min(newHeight, divEl.scrollHeight) + "px";
      },
      { passive: true, capture: true }
    );

    window.addEventListener("touchend", () => {
      isResizing = false;
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!isResizing) return;
        e.stopPropagation();
        e.stopImmediatePropagation();

        // use clientX/clientY to sync with cursor movement
        const rect = divEl.getBoundingClientRect();
        let newHeight = e.clientY - rect.top;

        const divElTextLength = divEl?.textContent?.trim()?.length
          ? divEl?.textContent?.trim()?.length
          : 0;

        const offsetX = e.clientX - rect.left;
        let newWidth = divElTextLength < 210 ? offsetX : Math.max(offsetX, 150);

        divEl.style.width = newWidth + "px";
        divEl.style.maxWidth = newWidth + "px";
        // divEl.style.minWidth = "50px";
        // divEl.style.height = newHeight + "px";
        // console.log("newWidth", newWidth);
        divEl.style.minWidth = newWidth + "px";
        divEl.style.minHeight = Math.min(newHeight, divEl.scrollHeight) + "px";
      },
      true
    );

    window.addEventListener("mouseup", () => {
      isResizing = false;
    });

    document.body.appendChild(divEl);
    const range = document.createRange();
    range.selectNodeContents(divEl);
    range.collapse(false); // false → end of content
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    // divEl.focus();
    // inputEl.focus();

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // socketProvider.get("message")?.send(JSON.stringify(data));

    setInput("");
    setShowInput(false);

    setShowStickerDetails((prev) => ({ ...prev, sticketTextAtom: false }));

    divEl.addEventListener("mouseenter", () => {
      setShowStickerDetails((prev) => ({ ...prev, hidePen: true }));
    });
    divEl.addEventListener("mouseleave", () => {
      setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
    });

    divEl.addEventListener("mousedown", (e: MouseEvent) => {
      try {
        const childrenElement = (e?.target as HTMLElement)?.className?.split(
          " "
        );

        if (
          childrenElement.includes(`container-${date}`) ||
          childrenElement.includes(`picker-1-${date}`) ||
          childrenElement.includes(`picker-2-${date}`) ||
          childrenElement.includes(`IroWheelBorder`) ||
          childrenElement.includes(`IroSliderGradient`) ||
          childrenElement.includes(`IroColorPicker`) ||
          childrenElement.includes(`color-container-${date}`) ||
          childrenElement.includes(`input-div`) ||
          childrenElement.includes(`input-${date}`)
        )
          return;

        isDragging = true;
        offsetX = e.clientX - divEl.offsetLeft;
        offsetY = e.clientY - divEl.offsetTop;
      } catch (error) {}
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

    divEl.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        if (e.touches.length > 0) {
          setIsDragging(true);
          // const touch = e.touches[0];

          // offsetX = touch.clientX - react.left;
          // offsetY = touch.clientY - react.top;
          isDragging = true;
        }
      },
      { passive: true, capture: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (isDragging && e.touches.length > 0) {
          try {
            const touch = e.touches[0];

            const childrenElement = (
              e?.target as HTMLElement
            )?.className?.split(" ");

            if (
              childrenElement.includes(`container-${date}`) ||
              childrenElement.includes(`picker-1-${date}`) ||
              childrenElement.includes(`picker-2-${date}`) ||
              childrenElement.includes(`IroWheelBorder`) ||
              childrenElement.includes(`IroSliderGradient`) ||
              childrenElement.includes(`IroColorPicker`) ||
              childrenElement.includes(`color-container-${date}`) ||
              childrenElement.includes(`input-${date}`)
            )
              return;

            divEl.style.left = `${touch.clientX - divEl.clientWidth / 2}px`;
            divEl.style.top = adjustFullScreen.adjustScreen
              ? `${touch.clientY - divEl.clientHeight / 2}px`
              : `${touch.clientY - divEl.clientHeight / 2 + window.scrollY}px`;
          } catch (error) {}
        }
      },
      { passive: true, capture: true }
    );
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
        // divEl.style.minWidth = "fit-content";

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
        } else if ((e.shiftKey && e.key === "Enter") || e.key === "Enter") {
          // e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          // document.execCommand("insertLineBreak");
          // divEl.appendChild(document.createElement("br"));
        } else if (e.key === "Escape") {
          container.style.display = "none";
          divEl.blur(); // this should now fire correctly and remove focus from the notes element
          setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        }
        // else if (e.key === "Backspace" && divEl.textContent?.trim() === "") {
        //   setShowStickerDetails((prev) => ({ ...prev, hidePen: false }));
        //   divEl.remove();
        // }
      },
      true
    );
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node: any) => {
          if (node.nodeType === 1) {
            // element
            const font = window.getComputedStyle(node).fontFamily;
            if (!font.includes("Architects Daughter")) {
              node.style.fontFamily =
                "'Architects Daughter', cursive, 'Courier New', monospace, sans-serif"; // enforce
            }
          }
        });
      });
    });

    observer.observe(divEl, { childList: true, subtree: true });
  };

  return (
    showInput && (
      <form onSubmit={handleInput}>
        <input
          name="inpu"
          ref={inputRef}
          autoComplete="off"
          value={input}
          style={{
            width: "150px",
            height: "30px",
            position: "fixed",
            borderRadius: "3px",
            fontSize: "16px",
            // zIndex: 2147483647,
            zIndex: 214748365,
            transition: "transform 0.02s ease-in-out",
            transform: `translate(
        ${((userCursor.x - 55) / userCursor.width) * window.innerWidth}px,
        ${((userCursor.y - 15) / userCursor.height) * window.innerHeight}px
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
          type="text"
          className="sticker-editor"
        />
      </form>
    )
  );
}

export default StickerEditor;
