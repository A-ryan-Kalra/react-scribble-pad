import { useEffect, useState } from "react";
import { stickerDetails } from "./canvas";
import { useAtom } from "jotai";
function CursorMovement() {
  const [showStickerDetails] = useAtom(stickerDetails);

  const [userCursor, setUserCursor] = useState<{
    x: number;
    y: number;
  }>({
    x: -100,
    y: -100,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkPoint = () => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true);
      } else {
        setIsTouchDevice(false);
      }
    };
    checkPoint();
    window.addEventListener("resize", checkPoint);

    return () => {
      window.removeEventListener("resize", checkPoint);
    };
  }, []);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (window.innerWidth > 1024) {
        setUserCursor({
          x: event.clientX,
          y: event.clientY,
        });
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        style={{
          visibility:
            showStickerDetails?.hidePen || showStickerDetails.hidePenOnEraser
              ? "hidden"
              : "visible",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 2147483647,
          transition: "transform 0.02s ease-in",
          backgroundColor: showStickerDetails.bgColor
            ? showStickerDetails.bgColor
            : "black",
          transform: `translate(${userCursor.x}px, ${userCursor.y}px)`,
        }}
      />
      <div
        style={{
          width: "50px",
          height: "50px",
          position: "fixed",
          borderRadius: "23px",
          pointerEvents: "none",
          zIndex: 2147483647,
          cursor: "none",
          transform: `translate(${userCursor.x}px, ${userCursor.y + 1}px)`,
        }}
      >
        {!isTouchDevice && (
          <div
            style={{
              visibility:
                showStickerDetails?.hidePen ||
                showStickerDetails.hidePenOnEraser
                  ? "hidden"
                  : "visible",
              WebkitMaskRepeat: "no-repeat",
              rotate: "90deg",
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundColor: "transparent",
              color: showStickerDetails.customizeCursor
                ? showStickerDetails.bgColor
                : "black",
              width: "30px",
              height: "30px",
              pointerEvents: "none",
            }}
          >
            <span className="pencil"></span>
          </div>
        )}
      </div>
    </>
  );
}

export default CursorMovement;
