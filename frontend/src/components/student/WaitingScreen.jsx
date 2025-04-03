import { Loader2 } from "lucide-react"

export default function WaitingScreen() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center w-16 h-16 mb-6 text-purple-600 bg-purple-100 rounded-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-center">Wait for the teacher to ask questions..</h2>
    </div>
  )
}

