"use client"

import { useState } from "react"
import { AlertTriangle, Clock, MapPin, CheckCircle } from "lucide-react"
import { useSystem } from "../context/SystemContext"
import { useAuth } from "../context/AuthContext"

const Alerts = () => {
  const { alerts, dismissAlert } = useSystem()
  const { currentUser } = useAuth()
  const [filter, setFilter] = useState("All")

  const userAlerts = alerts.filter((a) => {
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "Admin"
    const matchesUser = isAdmin || a.deviceId === currentUser?.deviceId
    return matchesUser
  })

  const filteredAlerts = userAlerts.filter((a) => filter === "All" || a.gasType === filter)

  const handleDismiss = async (alertId) => {
    const result = await dismissAlert(alertId)
    if (result.success) {
      console.log("[v0] Alert dismissed successfully")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alert History</h1>
          <p className="text-slate-500">Log of hazardous gas detections</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          {["All", "LPG", "CO", "H2", "NH3"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === type ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-xl shadow-sm border transition-all ${alert.status === "dismissed" ? "border-slate-200 opacity-60" : "border-slate-100 hover:border-red-100"} group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full transition-colors ${alert.status === "dismissed" ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600 group-hover:bg-red-100"}`}
                  >
                    {alert.status === "dismissed" ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {alert.gasType} Alert
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-mono ${alert.status === "dismissed" ? "bg-slate-100 text-slate-500" : "bg-red-100 text-red-700 border border-red-200"}`}
                      >
                        {alert.value?.toFixed ? alert.value.toFixed(1) : alert.value} PPM
                      </span>
                      {alert.status === "dismissed" && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                          Dismissed
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">{alert.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-slate-400">
                    <div className="flex items-center justify-end gap-1 mb-1">
                      <Clock size={14} />
                      <span>
                        {alert.timestamp?.toDate
                          ? alert.timestamp.toDate().toLocaleString()
                          : new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-slate-500 font-mono">
                      <MapPin size={14} />
                      <span>{alert.deviceId}</span>
                    </div>
                  </div>

                  {alert.status !== "dismissed" && (
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Dismiss Alert"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
            <AlertTriangle className="mx-auto mb-3 opacity-20" size={40} />
            No alerts found for this filter.
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
