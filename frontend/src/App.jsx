import { useState, useEffect } from "react"
import RoleSelection from "./components/RoleSelection"
import TeacherView from "./components/teacher/TeacherView"
import StudentView from "./components/student/StudentView"
import { socket } from "./lib/socket"

export default function App() {
  const [role, setRole] = useState(null)
  const [username, setUsername] = useState("")
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if username is stored in localStorage for student
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Connect to socket server
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
  }

  const handleUsernameSubmit = (name) => {
    setUsername(name)
    localStorage.setItem("username", name)

    // Register student with server
    socket.emit("student:register", { username: name })
  }

  if (!role) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />
  }

  if (role === "student") {
    if (!username) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Let's Get Started</h2>
              <p className="mt-2 text-gray-600">
                If you're a student, you'll be able to <span className="font-semibold">submit your answers</span>,
                participate in live polls, and see how your responses compare with your classmates
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const name = e.target.username.value
                if (name.trim()) {
                  handleUsernameSubmit(name)
                }
              }}
              className="mt-8 space-y-6"
            >
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Enter your Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
    return <StudentView username={username} />
  }

  return <TeacherView />
}

