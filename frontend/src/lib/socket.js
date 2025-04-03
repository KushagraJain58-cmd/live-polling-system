import { io } from "socket.io-client"

// Initialize socket connection
export const socket = io( "https://live-polling-system-1.onrender.com", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

