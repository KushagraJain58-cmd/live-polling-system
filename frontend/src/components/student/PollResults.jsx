import { CheckCircle, XCircle } from "lucide-react"

export default function PollResults({ poll, selectedOption, responseCount, totalStudents }) {
  if (!poll) return null

  const totalVotes = Object.values(poll.results || {}).reduce((sum, count) => sum + count, 0)
  const userAnsweredCorrectly = selectedOption === poll.correctOption

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Results</h2>

      <div className="p-4 mt-4 text-white bg-gray-800 rounded-lg">
        <p className="text-lg">{poll.question}</p>
      </div>

      {selectedOption !== null && poll.correctOption !== undefined && (
        <div
          className={`p-4 mt-4 rounded-lg ${
            userAnsweredCorrectly ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {userAnsweredCorrectly ? (
              <>
                <CheckCircle size={20} className="mr-2" />
                <span>Your answer is correct!</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="mr-2" />
                <span>Your answer is incorrect. The correct answer is: {poll.options[poll.correctOption]}</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {poll.options.map((option, index) => {
          const votes = poll.results?.[index] || 0
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
          const isSelected = selectedOption === index
          const isCorrect = poll.correctOption === index

          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full text-white ${
                      isCorrect ? "bg-green-600" : isSelected ? "bg-purple-600" : "bg-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`${isCorrect ? "font-bold" : ""}`}>{option}</span>
                  {isSelected && <span className="ml-2 text-xs font-medium text-purple-600">(Your answer)</span>}
                  {isCorrect && <span className="ml-2 text-xs font-medium text-green-600">(Correct answer)</span>}
                </div>
                <span className="font-bold">{percentage}%</span>
              </div>

              <div className="w-full h-12 overflow-hidden bg-gray-200 rounded-lg">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCorrect ? "bg-green-600" : isSelected ? "bg-purple-600" : "bg-gray-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="flex items-center h-full px-4">
                    <span className="font-medium text-white">{option}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center mt-6 space-x-2">
        <div className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
          {responseCount} of {totalStudents} students responded
        </div>
      </div>
    </div>
  )
}

