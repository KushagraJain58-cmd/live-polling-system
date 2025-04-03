import { Loader2 } from "lucide-react"

export default function WaitingForResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center w-16 h-16 mb-6 text-purple-600 bg-purple-100 rounded-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-center">Thanks for your answer!</h2>
      <p className="mt-4 text-center text-gray-600">
        Waiting for other students to answer or for the timer to expire...
      </p>
      <p className="mt-2 text-center text-gray-600">Results will be displayed soon.</p>
    </div>
  )
}

