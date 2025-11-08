import { io } from "socket.io-client";
const URL = "http://localhost:5001";

// We create one socket instance and export it
export const socket = io(URL, {
// socket.connect() when we enter a whiteboard.
    autoConnect: false,
});