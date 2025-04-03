import { UserX } from "lucide-react"

export default function StudentsList({ students, onKickStudent }) {
  if (students.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h2 className="text-xl font-medium text-gray-700">No students connected</h2>
        <p className="mt-2 text-gray-500">Students will appear here when they join the session</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Connected Students</h2>
      <p className="mt-2 text-gray-600">
        {students.length} {students.length === 1 ? "student" : "students"} currently connected
      </p>

      <div className="mt-6">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <button onClick={() => onKickStudent(student.id)} className="text-red-600 hover:text-red-900">
                      <UserX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

