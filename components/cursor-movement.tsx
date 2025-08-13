import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../src/services/use-socket-provider";
import type { CursorMovementProps } from "../types";

function CursorMovement() {
  const url = new URL(window.location.href);

  const searchParams = url.searchParams;
  const name = searchParams.get("name");

  const [userCursor, setUserCursor] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      console.log(event);
      setUserCursor({
        x: event.clientX,
        y: event.clientY,
      });
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
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          position: "fixed",
          transition: "transform 0.02s ease-in-out",
          backgroundColor: "black",
          transform: `translate(${userCursor.x - 4}px, ${userCursor.y - 4}px)`,
        }}
      />
      <div
        style={{
          width: "50px",
          height: "50px",
          position: "fixed",
          borderRadius: "23px",
          pointerEvents: "none",
          zIndex: 999999,
          cursor: "none",
          // transition: "transform 0.04s ease-in-out",
          transform: `translate(${userCursor.x}px, ${userCursor.y}px)`,
        }}
      >
        <div
          style={{
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
          }}
        />
      </div>
    </>
  );
}

export default CursorMovement;
