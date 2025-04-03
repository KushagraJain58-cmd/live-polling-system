import { useState, useEffect } from "react"
import { Clock, CheckCircle } from "lucide-react"

export default function PollResults({ poll }) {
  const [timeLeft, setTimeLeft] = useState(poll.timeLimit)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    // Calculate total votes
    const votes = Object.values(poll.results || {}).reduce((sum, count) => sum + count, 0)
    setTotalVotes(votes)

    // Set up timer if poll has a timeLimit
    if (poll.timeLimit) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [poll])

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question</h2>
        {timeLeft > 0 && (
          <div className="flex items-center px-3 py-1 text-red-700 bg-red-100 rounded-full">
            <Clock size={16} className="mr-1" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      <div className="p-4 mt-4 text-white bg-gray-800 rounded-lg">
        <p className="text-lg">{poll.question}</p>
      </div>

      <div className="mt-6 space-y-4">
        {poll.options.map((option, index) => {
          const votes = poll.results?.[index] || 0
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
          const isCorrect = poll.correctOption === index

          return (
            <div key={index} className="relative">
              <div className="flex items-center mb-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full ${
                    isCorrect ? "bg-green-600" : "bg-purple-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span>{option}</span>
                {isCorrect && (
                  <div className="flex items-center ml-2 text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm font-medium">Correct Answer</span>
                  </div>
                )}
              </div>

              <div className="w-full h-12 overflow-hidden bg-gray-200 rounded-lg">
                <div
                  className={`h-full transition-all duration-500 ${isCorrect ? "bg-green-600" : "bg-purple-600"}`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="flex items-center justify-between h-full px-4">
                    <span className="font-medium text-white">{option}</span>
                    <span className="font-bold text-white">{percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {totalVotes} {totalVotes === 1 ? "response" : "responses"} received
        </p>
      </div>
    </div>
  )
}

