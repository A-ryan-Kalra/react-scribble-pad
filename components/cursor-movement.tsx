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

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setUserCursor({
        x: event.clientX,
        y: event.clientY,
      });
    }
    function handleTouchMove(event: TouchEvent) {
      const cursor = event.touches[0];
      setUserCursor({
        x: cursor.clientX,
        y: cursor.clientY,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <div
        style={{
          visibility: showStickerDetails?.isEraserOn ? "hidden" : "visible",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 99999999,
          transition: "transform 0.02s ease-in-out",
          backgroundColor: showStickerDetails.bgColor
            ? showStickerDetails.bgColor
            : "black",
          transform: `translate(${userCursor.x - 4}px, ${userCursor.y - 3}px)`,
        }}
      />
      <div
        style={{
          width: "50px",
          height: "50px",
          position: "fixed",
          borderRadius: "23px",
          pointerEvents: "none",
          zIndex: 99999999,
          cursor: "none",
          // transition: "transform 0.04s ease-in-out",
          transform: `translate(${userCursor.x}px, ${userCursor.y + 1}px)`,
        }}
      >
        <div
          style={{
            visibility: showStickerDetails?.isEraserOn ? "hidden" : "visible",
            WebkitMaskImage: "url('/pencil.svg')",
            WebkitMaskRepeat: "no-repeat",
            rotate: "90deg",
            WebkitMaskSize: "contain",
            WebkitMaskPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundColor: "black",
            width: "30px",
            height: "30px",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}

export default CursorMovement;
