import { io } from "socket.io-client";

const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,

  auth: (cb) => {
    cb({
      token: getToken(),
    });
  },
});