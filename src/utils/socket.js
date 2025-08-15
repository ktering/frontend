import { io } from "socket.io-client";
import {API_BASE} from "../../config";

const API_URL =
  import.meta.env.MODE === "production"
    ?  `${API_BASE}` // Replace with your real backend domain
    : "http://localhost:5000";

export const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
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
