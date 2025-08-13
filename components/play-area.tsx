import { useEffect, useRef, useState } from "react";
import CursorMovement from "./cursor-movement";
import UserCursorMovement from "./user-cursor-movement";
import { useSocket } from "../src/services/use-socket-provider";
import { useLocation, useParams } from "react-router-dom";
import StickerMovement from "./sticker-movement";
import Canvas from "./canvas";
import "./index.css";
import type { StickerDetailProps, UserDetailsProps } from "../types";

function PlayArea() {
  // const socketRef = useRef<WebSocket>(null);

  const roomId = 12;
  // const location = useLocation();
  const url = new URL(window.location.href);

  const searchParams = url.searchParams;
  // const name = searchParams.get("name");
  const name = "aryan" + Date.now();
  const { socketProvider } = useSocket();

  const [show, setShowInput] = useState<boolean>(false);
  const divRefs = useRef<HTMLDivElement[]>([]);
  const [userData, setUserData] = useState<UserDetailsProps[]>([]);
  const [stickerMovement, setStickerMovement] = useState<StickerDetailProps[]>(
    []
  );

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}://${
        import.meta.env.VITE_WEBSITE_URL
      }/ws/message/${roomId}?name=${name}`
      // `wss://8f0nnzr5-5173.inc1.devtunnels.ms/ws/message/${roomId}?name=${name}`
    );
    // const ws = new WebSocket(
    //   `wss://8f0nnzr5-5173.inc1.devtunnels.ms/ws/message/${roomId}?name=${name}`
    // );
    socketProvider.set("message", socket);
    // const socket = socketProvider.get("message");

    socket.onopen = () => {
      setShowInput(true);
      console.log(`Successfully established the connection.`);

      const data = {
        type: "greeting",
        name,
        message: `${name} entered the room.`,
      };
      socket?.send(JSON.stringify(data));
    };
    socket.addEventListener("message", (event: MessageEvent) => {
      const parsed = JSON.parse(event.data);

      if (parsed?.type === "greeting") {
        console.log(`${parsed.name} entered the canvas room`);
      }
    });
    if (socket) {
      socket!.onclose = () => {
        console.log(`${name} left the chat room.`);
      };
    }

    const socketCursor = new WebSocket(
      `${protocol}://${
        import.meta.env.VITE_WEBSITE_URL
      }/ws/cursor/${roomId}?name=${name}`
      // `wss://8f0nnzr5-5173.inc1.devtunnels.ms/ws/cursor/${roomId}?name=${name}`
    );

    socketProvider.set("cursor", socketCursor);
    // socketProvider.get("cursor");

    socketCursor.onclose = () => {
      console.log("SocketRef.current closed.");
      // Optionally: attempt reconnect
    };

    socketCursor.onerror = (err) => {
      console.error("SocketRef.current error:", err);
    };

    socketCursor.onopen = () => {
      console.log("Socket opened.");
    };
    let style: { [key: string]: string } = {};
    socketCursor.onmessage = (event: MessageEvent) => {
      const incomming = JSON.parse(event.data);
      // console.log(incomming);
      if (incomming.name === name) {
        return;
      }
      if (incomming.type === "delete") {
        setStickerMovement((prev) =>
          prev.filter((user) => user.stickerNo !== incomming.stickerNo)
        );

        return;
      }

      if (incomming.type === "sticker") {
        setStickerMovement((prev: StickerDetailProps[]) => {
          const existingIndex = prev.findIndex(
            (user) =>
              user.name === incomming.name &&
              user.stickerNo === incomming.stickerNo
          );

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = incomming;
            return updated;
          } else {
            return [...prev, incomming];
          }
        });
      } else {
        setUserData((prev: UserDetailsProps[]) => {
          if (incomming?.cursorStyle) {
            style[incomming?.name] = incomming.cursorStyle;
          }
          const existingIndex = prev.findIndex(
            (user) => user.name == incomming.name
          );

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...incomming,
              cursorStyle: style[incomming?.name] ?? "purple",
            };
            return updated;
          } else {
            return [...prev, incomming];
          }
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      // const now = Date.now();
      // if (now - lastSent < 10) return;

      const data = {
        x: event.clientX,
        y: event.clientY,
        width: window.innerWidth,
        height: window.innerHeight,
        name,
        type: "cursor",
      };
      //  setUserCursor(data);

      if (socketCursor && socketCursor.readyState === WebSocket.OPEN) {
        // console.log(data);

        socketCursor.send(JSON.stringify(data));
        // lastSent = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      socketCursor?.close();
      socket?.close();

      divRefs.current.forEach((div) => {
        if (document.body.contains(div)) {
          document.body.removeChild(div);
        }
      });
      divRefs.current = [];
    };
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const removePlayerSocket = new WebSocket(
      `${protocol}://${
        import.meta.env.VITE_WEBSITE_URL
      }/ws/remove/${roomId}?name=${name}`
      // `wss://8f0nnzr5-5173.inc1.devtunnels.ms/ws/remove/${roomId}?name=${name}`
    );

    socketProvider.set("remove", removePlayerSocket);

    removePlayerSocket.onopen = () => {
      console.log("Remove socket connection established");
    };

    removePlayerSocket.onclose = () => {
      console.log("Remove Move Socket connection closed");
    };

    removePlayerSocket.onerror = (err) => {
      console.error("Remove Socket error:", err);
    };

    removePlayerSocket.onmessage = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data);

      if (parsed?.name) {
        console.log(`${parsed.name} left the canvas room`);
        setStickerMovement((prev) =>
          prev.filter((user) => user.name !== parsed.name)
        );
        setUserData((prev) => prev.filter((user) => user.name !== parsed.name));
      }
    };

    function handleRemoveSocket(e: BeforeUnloadEvent) {
      e.preventDefault();
      // e.returnValue;
      if (removePlayerSocket.readyState === WebSocket.OPEN) {
        removePlayerSocket.send(
          JSON.stringify({ type: "LEAVE", name: "Aryan" })
        );
        removePlayerSocket.close();
      }
    }

    window.addEventListener("beforeunload", handleRemoveSocket);
    return () => {
      window.removeEventListener("beforeunload", handleRemoveSocket);

      if (
        removePlayerSocket &&
        removePlayerSocket.readyState === WebSocket.OPEN
      ) {
        removePlayerSocket.send(
          JSON.stringify({ type: "LEAVE", name: "Aryan" })
        );

        removePlayerSocket.close();
      }
    };
  }, []);

  let date = new Date().getMilliseconds();

  return (
    <section className="h-full w-full ">
      {userData.length > 0 &&
        userData.map((data: UserDetailsProps, index) => (
          <CursorMovement position={{ ...data }} key={index} />
        ))}
      {stickerMovement.length > 0 &&
        stickerMovement.map((data: StickerDetailProps, index) => (
          <StickerMovement position={{ ...data }} key={index} />
        ))}
      {show && (
        <UserCursorMovement divRefs={divRefs.current ?? []} name={name ?? ""} />
      )}
      <Canvas />
    </section>
  );
}

export default PlayArea;
