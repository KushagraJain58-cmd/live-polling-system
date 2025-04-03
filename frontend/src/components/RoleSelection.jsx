"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

export default function RoleSelection({ onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null)

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="flex justify-center">
          <div className="flex items-center px-4 py-2 space-x-2 text-white bg-purple-600 rounded-full">
            <Sparkles size={16} />
            <span className="font-medium">Intervue Poll</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome to the <span className="block">Live Polling System</span>
          </h1>
          <p className="mt-3 text-gray-600">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2">
          <div
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              selectedRole === "student"
                ? "border-purple-600 ring-2 ring-purple-600"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => setSelectedRole("student")}
          >
            <h3 className="text-xl font-bold">I'm a Student</h3>
            <p className="mt-2 text-sm text-gray-600">Submit answers and view live poll results in real-time.</p>
          </div>

          <div
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              selectedRole === "teacher"
                ? "border-purple-600 ring-2 ring-purple-600"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => setSelectedRole("teacher")}
          >
            <h3 className="text-xl font-bold">I'm a Teacher</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage polls, ask questions, and monitor your students' responses in real-time.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-3 text-white bg-purple-600 rounded-md transition-colors ${
              selectedRole ? "hover:bg-purple-700" : "opacity-50 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

