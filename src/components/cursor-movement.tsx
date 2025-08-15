import { useEffect, useState } from "react";
import { stickerDetails } from "./canvas";
import { useAtom } from "jotai";
import { Pencil } from "lucide-react";
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
          visibility: showStickerDetails?.hidePen ? "hidden" : "visible",
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
            visibility: showStickerDetails?.hidePen ? "hidden" : "visible",
            // WebkitMaskImage: "url('/pencil.svg')",
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
            marginLeft: "-0.45rem",
          }}
        >
          <Pencil />
        </div>
      </div>
    </>
  );
}

export default CursorMovement;
