import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  auth: (cb) => {
    cb({
      token: getToken(),
    });
  },
});