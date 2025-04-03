import { Loader2 } from "lucide-react"

export default function WaitingForResults({ responseCount, totalStudents }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center w-16 h-16 mb-6 text-purple-600 bg-purple-100 rounded-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-center">Thanks for your answer!</h2>
      <p className="mt-4 text-center text-gray-600">
        Waiting for other students to answer or for the timer to expire...
      </p>
      <div className="mt-4 text-center">
        <span className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
          {responseCount} of {totalStudents} students have responded
        </span>
      </div>
    </div>
  )
}

