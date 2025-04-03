import { useState, useEffect } from "react"
import { socket } from "../../lib/socket"
import CreatePoll from "./CreatePoll"
import PollResults from "./PollResults"
import PollHistory from "./PollHistory"
import StudentsList from "./StudentsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Sparkles } from "lucide-react"

export default function TeacherView() {
  const [activePoll, setActivePoll] = useState(null)
  const [pollHistory, setPollHistory] = useState([])
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState("create")

  useEffect(() => {
    // Listen for student connections
    socket.on("teacher:students-update", (connectedStudents) => {
      setStudents(connectedStudents)
    })

    // Listen for poll results updates
    socket.on("teacher:poll-results", (pollData) => {
      setActivePoll(pollData)
    })

    // Listen for poll ended event
    socket.on("teacher:poll-ended", (finalPollData) => {
      setActivePoll(null)
      setPollHistory((prev) => [finalPollData, ...prev])
      setActiveTab("results")
    })

    // Request current state when component mounts
    socket.emit("teacher:join")
    socket.emit("teacher:get-state")

    return () => {
      socket.off("teacher:students-update")
      socket.off("teacher:poll-results")
      socket.off("teacher:poll-ended")
    }
  }, [])

  const handleCreatePoll = (pollData) => {
    socket.emit("teacher:create-poll", pollData)
    setActivePoll({ ...pollData, results: {}, totalVotes: 0 })
    setActiveTab("results")
  }

  const handleEndPoll = () => {
    if (activePoll) {
      socket.emit("teacher:end-poll")
    }
  }

  const handleKickStudent = (studentId) => {
    socket.emit("teacher:kick-student", { studentId })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-purple-600" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Intervue Poll</h1>
          </div>
          {activePoll && (
            <button
              onClick={handleEndPoll}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              End Current Poll
            </button>
          )}
        </div>
      </header>

      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" disabled={activePoll !== null}>
              Create Poll
            </TabsTrigger>
            <TabsTrigger value="results">{activePoll ? "Live Results" : "Poll History"}</TabsTrigger>
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <CreatePoll onCreatePoll={handleCreatePoll} disabled={activePoll !== null} />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {activePoll ? <PollResults poll={activePoll} /> : <PollHistory polls={pollHistory} />}
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <StudentsList students={students} onKickStudent={handleKickStudent} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

