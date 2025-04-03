import { io } from "socket.io-client"

// Initialize socket connection
export const socket = io( "http://localhost:3001", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

