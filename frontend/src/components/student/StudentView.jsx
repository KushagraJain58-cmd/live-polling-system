import { useState, useEffect, useRef } from "react"
// import { socket } from "../../lib/socket"
import WaitingScreen from "./WaitingScreen"
import PollQuestion from "./PollQuestion"
import PollResults from "./PollResults"
import { Sparkles } from "lucide-react"
import WaitingForResults from "./WaitingForResults"


// Dynamic import for socket
const getSocket = async () => {
  const { socket } = await import("../../lib/socket")
  return socket
}

export default function StudentView({ username }) {
  const [activePoll, setActivePoll] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [pollResults, setPollResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const setupSocket = async () => {
      const socket = await getSocket()
      socketRef.current = socket

      // Listen for new polls
      socket.on("student:new-poll", (pollData) => {
        setActivePoll(pollData)
        setSelectedOption(null)
        setHasVoted(false)
        setTimeLeft(pollData.timeLimit)
        setPollResults(null)
        setShowResults(false)
      })

      // Listen for poll results
      socket.on("student:poll-results", (results) => {
        setPollResults(results)
        setShowResults(true)
      })

      // Listen for poll ended
      socket.on("student:poll-ended", () => {
        setShowResults(true)
      })

      // Listen for kick event
      socket.on("student:kicked", () => {
        localStorage.removeItem("username")
        window.location.reload()
      })

      // Request current state when component mounts
      socket.emit("student:get-state")

      return () => {
        socket.off("student:new-poll")
        socket.off("student:poll-results")
        socket.off("student:poll-ended")
        socket.off("student:kicked")
      }
    }

    setupSocket()
  }, [])

  // Timer effect
  useEffect(() => {
    if (activePoll && timeLeft > 0 && !hasVoted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Auto-submit when time runs out
            if (!hasVoted && selectedOption !== null) {
              handleSubmitAnswer()
            } else if (!hasVoted) {
              setHasVoted(true)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [activePoll, timeLeft, hasVoted, selectedOption])

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = async () => {
    if (selectedOption !== null && !hasVoted) {
      const socket = await getSocket()
      socket.emit("student:submit-answer", {
        pollId: activePoll.id,
        optionIndex: selectedOption,
      })
      setHasVoted(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-purple-600" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Intervue Poll</h1>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Logged in as: <span className="font-semibold">{username}</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 mx-auto max-w-md sm:px-6 lg:px-8">
        {!activePoll && !pollResults && <WaitingScreen />}

        {activePoll && !hasVoted && (
          <PollQuestion
            poll={activePoll}
            selectedOption={selectedOption}
            onOptionSelect={handleOptionSelect}
            onSubmit={handleSubmitAnswer}
            timeLeft={timeLeft}
          />
        )}

        {hasVoted && !showResults && <WaitingForResults />}

        {showResults && (pollResults || activePoll) && (
          <PollResults poll={pollResults || activePoll} selectedOption={selectedOption} />
        )}
      </main>
    </div>
  )
}

