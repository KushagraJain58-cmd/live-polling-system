const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Store state
let activePoll = null
let pollResults = {}
const pollHistory = []
let students = []
let pollIdCounter = 1

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Teacher handlers
  socket.on("teacher:join", () => {
    socket.join("teachers")
    // Send current state to the teacher
    io.to(socket.id).emit("teacher:students-update", students)
    if (activePoll) {
      io.to(socket.id).emit("teacher:poll-results", {
        ...activePoll,
        results: pollResults,
        totalVotes: Object.values(pollResults).reduce((sum, count) => sum + count, 0),
      })
    }
  })

  socket.on("teacher:get-state", () => {
    io.to(socket.id).emit("teacher:students-update", students)
    if (activePoll) {
      io.to(socket.id).emit("teacher:poll-results", {
        ...activePoll,
        results: pollResults,
        totalVotes: Object.values(pollResults).reduce((sum, count) => sum + count, 0),
      })
    }
  })

  socket.on("teacher:create-poll", (pollData) => {
    // Only allow creating a new poll if no active poll exists
    if (!activePoll) {
      activePoll = {
        ...pollData,
        id: pollIdCounter++,
        createdAt: new Date().toISOString(),
      }
      pollResults = {}

      // Notify all students about the new poll
      io.to("students").emit("student:new-poll", activePoll)

      // Set a timer to automatically end the poll
      setTimeout(() => {
        if (activePoll && activePoll.id === pollData.id) {
          endPoll()
        }
      }, pollData.timeLimit * 1000)
    }
  })

  socket.on("teacher:end-poll", () => {
    endPoll()
  })

  socket.on("teacher:kick-student", ({ studentId }) => {
    const studentSocket = io.sockets.sockets.get(studentId)
    if (studentSocket) {
      studentSocket.emit("student:kicked")
      studentSocket.disconnect(true)
    }

    // Remove student from the list
    students = students.filter((s) => s.id !== studentId)
    io.to("teachers").emit("teacher:students-update", students)
  })

  // Student handlers
  socket.on("student:register", ({ username }) => {
    socket.join("students")

    // Add student to the list
    const student = {
      id: socket.id,
      username,
      joinedAt: new Date().toISOString(),
    }

    students.push(student)

    // Notify teachers about the new student
    io.to("teachers").emit("teacher:students-update", students)

    // Send current poll to the student if exists
    if (activePoll) {
      socket.emit("student:new-poll", activePoll)
    }
  })

  socket.on("student:get-state", () => {
    if (activePoll) {
      socket.emit("student:new-poll", activePoll)
    }
  })

  socket.on("student:submit-answer", ({ pollId, optionIndex }) => {
    // Only accept answers for the active poll
    if (activePoll && activePoll.id === pollId) {
      // Update poll results
      pollResults[optionIndex] = (pollResults[optionIndex] || 0) + 1

      // Send updated results to teachers
      io.to("teachers").emit("teacher:poll-results", {
        ...activePoll,
        results: pollResults,
        totalVotes: Object.values(pollResults).reduce((sum, count) => sum + count, 0),
      })

      // Send results to the student who submitted
      socket.emit("student:poll-results", {
        ...activePoll,
        results: pollResults,
      })

      // Check if all students have answered
      const totalVotes = Object.values(pollResults).reduce((sum, count) => sum + count, 0)
      if (totalVotes >= students.length) {
        // End the poll if all students have answered
        endPoll()
      }
    }
  })

  socket.on("student:request-results", () => {
    if (activePoll) {
      socket.emit("student:poll-results", {
        ...activePoll,
        results: pollResults,
      })
    }
  })

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    // Remove student from the list if it was a student
    const studentIndex = students.findIndex((s) => s.id === socket.id)
    if (studentIndex !== -1) {
      students.splice(studentIndex, 1)
      io.to("teachers").emit("teacher:students-update", students)
    }
  })
})

// Helper function to end the current poll
function endPoll() {
  if (activePoll) {
    const finalPoll = {
      ...activePoll,
      results: pollResults,
      endedAt: new Date().toISOString(),
    }

    // Add to history
    pollHistory.unshift(finalPoll)

    // Notify teachers
    io.to("teachers").emit("teacher:poll-ended", finalPoll)

    // Notify students
    io.to("students").emit("student:poll-ended")

    // Reset active poll
    activePoll = null
    pollResults = {}
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Live Polling System Server is running")
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

