import { useState } from "react"
import { Plus, Trash2, Check } from "lucide-react"

export default function CreatePoll({ onCreatePoll, disabled }) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [timeLimit, setTimeLimit] = useState(60)
  const [correctOption, setCorrectOption] = useState(null)
  const [error, setError] = useState("")

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""])
    }
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      setOptions(newOptions)

      // Update correctOption if the removed option was marked as correct
      if (correctOption === index) {
        setCorrectOption(null)
      } else if (correctOption > index) {
        setCorrectOption(correctOption - 1)
      }
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSetCorrectOption = (index) => {
    setCorrectOption(index)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!question.trim()) {
      setError("Question is required")
      return
    }

    const filteredOptions = options.filter((opt) => opt.trim() !== "")
    if (filteredOptions.length < 2) {
      setError("At least two options are required")
      return
    }

    // Create poll
    onCreatePoll({
      question,
      options: filteredOptions,
      timeLimit,
      correctOption,
      createdAt: new Date().toISOString(),
    })

    // Reset form
    setQuestion("")
    setOptions(["", ""])
    setTimeLimit(60)
    setCorrectOption(null)
    setError("")
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Let's Get Started</h2>
      <p className="mt-2 text-gray-600">
        You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in
        real-time.
      </p>

      {error && <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Enter your question
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Type your question here"
              disabled={disabled}
            />
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="px-3 py-2 ml-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              disabled={disabled}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Edit Options (Click the checkmark to mark the correct answer)
          </label>
          <div className="mt-1 space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-2 text-white bg-purple-600 rounded-full">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={`Option ${index + 1}`}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => handleSetCorrectOption(index)}
                  className={`p-2 ml-2 rounded-full ${
                    correctOption === index
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50"
                  }`}
                  disabled={disabled}
                  title="Mark as correct answer"
                >
                  <Check size={18} />
                </button>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 ml-2 text-gray-400 hover:text-red-500"
                    disabled={disabled}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 10 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center px-4 py-2 mt-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
              disabled={disabled}
            >
              <Plus size={16} className="mr-1" />
              Add Option
            </button>
          )}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={disabled}
          >
            Create Poll
          </button>
        </div>
      </form>
    </div>
  )
}

