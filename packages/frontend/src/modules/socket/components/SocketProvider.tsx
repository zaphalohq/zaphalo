import { ReactNode, useEffect, useState } from "react";
import { SocketContext } from "@src/modules/socket/contexts/SocketContext";
import { createSocket } from "@src/modules/socket/utils/socket";


interface Props {
  namespace?: string; // default "main"
  children: ReactNode;
}

export const SocketProvider = ({ namespace = "main", children }: Props) => {
  const [socket] = useState(() => createSocket(namespace));

  useEffect(() => {
    console.log("🔌 Connecting socket…");

    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("disconnect", reason => {
      console.warn("🔴 Disconnected:", reason);
    });

    socket.on("connect_error", err => {
      console.error("⚠️ Connection Error:", err.message);
    });

    return () => {
      console.log("🔌 Closing socket…");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
