import { Clock } from "lucide-react"

export default function PollQuestion({ poll, selectedOption, onOptionSelect, onSubmit, timeLeft }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Question {poll.id || 1}</h2>
        <div className="flex items-center px-3 py-1 text-red-700 bg-red-100 rounded-full">
          <Clock size={16} className="mr-1" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="p-4 mt-4 text-white bg-gray-800 rounded-lg">
        <p className="text-lg">{poll.question}</p>
      </div>

      <div className="mt-6 space-y-3">
        {poll.options.map((option, index) => (
          <div
            key={index}
            onClick={() => onOptionSelect(index)}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === index ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full ${
                selectedOption === index ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-lg">{option}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={selectedOption === null}
          className={`w-full py-3 text-white bg-purple-600 rounded-md transition-colors ${
            selectedOption !== null ? "hover:bg-purple-700" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

