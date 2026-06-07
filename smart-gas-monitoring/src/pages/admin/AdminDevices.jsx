"use client"

import { useState } from "react"
import { Server, Plus } from "lucide-react"
import { useSystem } from "../../context/SystemContext"

const AdminDevices = () => {
  const { devices, registerDevice, deleteDevice, updateDeviceStatus } = useSystem()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ id: "", assignedUser: null })
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setErrorMsg("")

    const result = await registerDevice(newDevice)

    if (result.success) {
      setIsModalOpen(false)
      setNewDevice({ id: "", assignedUser: null })
    } else {
      setErrorMsg(result.error)
    }
    setIsRegistering(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Device Registry</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm"
        >
          <Plus size={18} /> Register Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Server size={24} />
              </div>
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${device.status?.toLowerCase() === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {device.status?.toLowerCase() === "online" ? "Online" : "Offline"}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{device.id}</h3>

            <div className="flex flex-col gap-2 text-sm pt-4 border-t border-slate-50">
              <div className="flex justify-between text-slate-500">
                <span>Assigned User:</span>
                <span className="font-medium text-slate-700">{device.assignedTo}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Last Sync:</span>
                <span className="font-medium text-slate-700">
                  {device.lastUpdated ? new Date(device.lastUpdated).toLocaleTimeString() : "Never"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => updateDeviceStatus(device.id, device.status?.toLowerCase() === "online" ? "Offline" : "Online")}
                className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 text-xs"
              >
                {device.status?.toLowerCase() === "online" ? "Set Offline" : "Set Online"}
              </button>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this device?")) {
                    deleteDevice(device.id)
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Register New Device</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Device ID (e.g. DEVICE005)"
                value={newDevice.id}
                onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
                required
              />
              {errorMsg && <p className="text-red-500 text-sm font-medium text-center">{errorMsg}</p>}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? "Registering..." : "Register Device"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full text-slate-500 py-2 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDevices
