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
const studentVotes = new Set() // Track which students have voted
let pollIdCounter = 1
let pollTimer = null

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
        totalStudents: students.length,
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
        totalStudents: students.length,
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
        totalStudents: students.length,
      }
      pollResults = {}
      studentVotes.clear() // Reset student votes tracking

      // Notify all students about the new poll
      io.to("students").emit("student:new-poll", activePoll)

      // Set a timer to automatically end the poll
      if (pollTimer) {
        clearTimeout(pollTimer)
      }

      pollTimer = setTimeout(() => {
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

    // Update active poll with new student count
    if (activePoll) {
      activePoll.totalStudents = students.length

      // Send updated response counts to all students
      broadcastResponseCounts()

      // Check if all remaining students have voted
      if (students.length > 0 && studentVotes.size >= students.length) {
        endPoll()
      }
    }
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

    // Update active poll with new student count
    if (activePoll) {
      activePoll.totalStudents = students.length

      // Send updated response counts to all students
      broadcastResponseCounts()

      // Send current poll to the student
      socket.emit("student:new-poll", activePoll)
    }
  })

  socket.on("student:get-state", () => {
    if (activePoll) {
      socket.emit("student:new-poll", activePoll)

      // Send current response counts
      socket.emit("student:response-update", {
        responseCount: studentVotes.size,
        totalStudents: students.length,
      })
    }
  })

  socket.on("student:submit-answer", ({ pollId, optionIndex }) => {
    // Only accept answers for the active poll
    if (activePoll && activePoll.id === pollId) {
      // Update poll results
      pollResults[optionIndex] = (pollResults[optionIndex] || 0) + 1

      // Track that this student has voted
      studentVotes.add(socket.id)

      // Send updated results to teachers
      io.to("teachers").emit("teacher:poll-results", {
        ...activePoll,
        results: pollResults,
        totalVotes: Object.values(pollResults).reduce((sum, count) => sum + count, 0),
        totalStudents: students.length,
      })

      // Broadcast updated response counts to all students
      broadcastResponseCounts()

      // Check if all students have answered
      if (students.length > 0 && studentVotes.size >= students.length) {
        // End the poll if all students have answered
        endPoll()
      }
    }
  })

  socket.on("student:request-results", () => {
    // Only send results if poll has ended or all students have voted
    if (!activePoll) {
      const lastPoll = pollHistory[0]
      if (lastPoll) {
        socket.emit("student:poll-results", lastPoll)
      }
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

      // Remove from voted set if they had voted
      studentVotes.delete(socket.id)

      // Update active poll with new student count
      if (activePoll) {
        activePoll.totalStudents = students.length

        // Send updated response counts to all students
        broadcastResponseCounts()

        // Check if all remaining students have voted
        if (students.length > 0 && studentVotes.size >= students.length) {
          endPoll()
        }
      }
    }
  })
})

// Helper function to broadcast response counts to all students
function broadcastResponseCounts() {
  io.to("students").emit("student:response-update", {
    responseCount: studentVotes.size,
    totalStudents: students.length,
  })
}

// Helper function to end the current poll
function endPoll() {
  if (activePoll) {
    // Clear the timer if it's still running
    if (pollTimer) {
      clearTimeout(pollTimer)
      pollTimer = null
    }

    const finalPoll = {
      ...activePoll,
      results: pollResults,
      totalStudents: students.length,
      endedAt: new Date().toISOString(),
    }

    // Add to history
    pollHistory.unshift(finalPoll)

    // Notify teachers
    io.to("teachers").emit("teacher:poll-ended", finalPoll)

    // Notify students with results
    io.to("students").emit("student:poll-results", finalPoll)

    // Reset active poll
    activePoll = null
    pollResults = {}
    studentVotes.clear()
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

