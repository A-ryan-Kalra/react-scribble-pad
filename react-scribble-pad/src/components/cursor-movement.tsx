import { useEffect, useState } from "react";
import { stickerDetails } from "./canvas";
import { useAtom } from "jotai";
import pencilSvg from "../../public/pencil.svg";

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
      if (window.innerWidth > 768) {
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
          visibility: showStickerDetails?.showPen ? "hidden" : "visible",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 99999999,
          transition: "transform 0.02s ease-in",
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
            width: 40,
            height: 40,
            backgroundColor: "red", // This is what you actually see through the mask
            WebkitMaskImage: `url(${pencilSvg})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: `url(${pencilSvg})`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        />
      </div>
    </>
  );
}

export default CursorMovement;
