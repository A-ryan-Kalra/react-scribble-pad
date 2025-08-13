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
        transform: `translate(${userCursor.x - 10}px, ${userCursor.y - 30}px)`,
      }}
    >
      <div
        style={{
          width: "25px",
          height: "25px",
          // color: position?.cursorStyle,
        }}
        className=" relative top-0 left-0 mx-auto"
      >
        {/* <div
          className={`absolute -top-11 min-w-[150px] bg-lime-300/90 ${
            messages.message && "p-1"
          } text-black rounded-[5px] text-sm`}
        >
          {messages.name !== name && messages.message && "Typing..."}
        </div> */}
      </div>
      <div
        style={{
          WebkitMaskImage: "url('/pointer.svg')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundColor: "purple",
          width: "25px",
          height: "25px",
        }}
        className="relative top-0 left-0 mx-auto"
      ></div>
    </div>
  );
}

export default CursorMovement;
