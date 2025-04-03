export default function PollHistory({ polls }) {
  if (polls.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h2 className="text-xl font-medium text-gray-700">No polls created yet</h2>
        <p className="mt-2 text-gray-500">Create your first poll to see results here</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">View Poll History</h2>

      <div className="mt-6 space-y-10">
        {polls.map((poll, pollIndex) => {
          const totalVotes = Object.values(poll.results || {}).reduce((sum, count) => sum + count, 0)

          return (
            <div key={pollIndex} className="pb-6 border-b border-gray-200 last:border-0">
              <h3 className="text-xl font-bold">Question {pollIndex + 1}</h3>

              <div className="p-4 mt-2 text-white bg-gray-800 rounded-lg">
                <p>{poll.question}</p>
              </div>

              <div className="mt-4 space-y-4">
                {poll.options.map((option, optionIndex) => {
                  const votes = poll.results?.[optionIndex] || 0
                  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                  const isCorrect = poll.correctOption === optionIndex

                  return (
                    <div key={optionIndex} className="relative">
                      <div className="flex items-center mb-1">
                        <div
                          className={`flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full ${
                            isCorrect ? "bg-green-600" : "bg-purple-600"
                          }`}
                        >
                          {optionIndex + 1}
                        </div>
                        <span>{option}</span>
                        {isCorrect && <span className="ml-2 text-sm font-medium text-green-600">(Correct Answer)</span>}
                      </div>

                      <div className="w-full h-12 overflow-hidden bg-gray-200 rounded-lg">
                        <div
                          className={`h-full ${isCorrect ? "bg-green-600" : "bg-purple-600"}`}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

