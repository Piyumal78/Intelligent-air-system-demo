"use client"

import { useState } from "react"
import { UserPlus, Trash2, Search, X } from "lucide-react"
import { useSystem } from "../../context/SystemContext"

const AdminUsers = () => {
  const { users, createUser, deleteUser } = useSystem()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", deviceId: "", role: "user" })
  const [statusMsg, setStatusMsg] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setStatusMsg("Creating...")
    setIsCreating(true)

    const result = await createUser(newUser)

    if (result.success) {
      setStatusMsg("User Created Successfully!")
      setTimeout(() => {
        setIsModalOpen(false)
        setStatusMsg("")
        setNewUser({ username: "", email: "", password: "", deviceId: "", role: "user" })
        setIsCreating(false)
      }, 1000)
    } else {
      setStatusMsg("Error: " + result.error)
      setIsCreating(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-lg shadow-blue-500/30"
        >
          <UserPlus size={18} />
          Create User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Device ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{user.deviceId || "-"}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Display Name"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Login ID)</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="******"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Device ID</label>
                  <input
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="DEVICE001"
                    value={newUser.deviceId}
                    onChange={(e) => setNewUser({ ...newUser, deviceId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {statusMsg && (
                <div
                  className={`p-3 rounded-lg text-sm text-center font-medium ${statusMsg.includes("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
