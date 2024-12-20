import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; 

export const initSocket = () => {
  const options = {
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(SOCKET_SERVER_URL, options);
};
