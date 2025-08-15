// import { io } from "socket.io-client";

// // const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
// const SOCKET_URL =  "http://localhost:5000";

// export const socket = io(SOCKET_URL, { autoConnect: false });

import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: Infinity, // Keep trying to reconnect
  reconnectionDelay: 1000, // Wait 1s between retries
});

socket.on("connect", () => {
  console.log("✅ Socket connected with ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});