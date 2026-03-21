"use client"

import { useEffect, useState } from "react"
import { useSystem } from "../context/SystemContext"
import { useAuth } from "../context/AuthContext"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Thermometer, Droplets, Wind, Activity, Waves, AlertTriangle, ArrowDown, Cpu, Sparkles, FileText } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
// Constants
const THRESHOLDS = {
  CO: { warning: 30, danger: 50 },
  LPG: { warning: 100, danger: 150 },
  H2: { warning: 50, danger: 80 },
  NH3: { warning: 25, danger: 35 },
}

const Dashboard = ({ forceDeviceId }) => {
  const { devices, getLatestReading, sensorReadings } = useSystem()
  const { currentUser } = useAuth()
  const [currentReading, setCurrentReading] = useState(null)
  const [currentPostReading, setCurrentPostReading] = useState(null)
  const [timeFilter, setTimeFilter] = useState("1h")
  const [localDeviceId, setLocalDeviceId] = useState("")

  const targetId = forceDeviceId || localDeviceId || currentUser?.deviceId
  const realDevice = devices.find((d) => d.id === targetId)
  const myDevice = realDevice || (targetId ? { id: targetId, status: "Unknown" } : devices[0])

  useEffect(() => {
    if (myDevice) {
      const latest = getLatestReading(myDevice.id)
      if (latest) {
        setCurrentReading({
          co: latest.CO || 0,
          lpg: latest.LPG || 0,
          h2: latest.H2 || 0,
          nh3: latest.NH3 || 0,
          temp: latest.temperature || 0,
          hum: latest.humidity || 0,
          pressure: latest.pressure || 1013,
          timestamp: latest.timestamp || null,
        })
      } else {
        setCurrentReading(null)
      }
      
      const latestPost = getLatestReading(`${myDevice.id}_POST`)
      if (latestPost) {
        setCurrentPostReading({
          co: latestPost.CO || 0,
          lpg: latestPost.LPG || 0,
          h2: latestPost.H2 || 0,
          nh3: latestPost.NH3 || 0,
          temp: latestPost.temperature || 0,
          hum: latestPost.humidity || 0,
        })
      } else {
        setCurrentPostReading(null)
      }
    }
  }, [myDevice?.id, getLatestReading])

  if (!myDevice) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-2">No Device Assigned</h2>
        <p className="text-slate-500">Please contact your administrator to assign a monitoring device.</p>
      </div>
    )
  }

  const readings = currentReading || {
    co: 0,
    lpg: 0,
    h2: 0,
    nh3: 0,
    temp: 0,
    hum: 0,
    pressure: 1013,
    timestamp: null,
  }

  const postDefault = currentPostReading || {
    co: 0,
    lpg: 0,
    h2: 0,
    nh3: 0,
    temp: 0,
    hum: 0,
  }

  // Live Alerts (Dynamically checks latest reading)
  const activeAlerts = []
  Object.entries(THRESHOLDS).forEach(([gas, limits]) => {
    const val = readings[gas.toLowerCase()]
    if (val >= limits.danger) activeAlerts.push({ gas, level: "DANGER", msg: `${gas} level critical (> ${limits.danger} ppm)` })
    else if (val >= limits.warning) activeAlerts.push({ gas, level: "WARNING", msg: `${gas} levels elevated (> ${limits.warning} ppm)` })
  })

  // Gauge configurations
  const getGasColor = (value, max) => {
    const pct = (value / max) * 100
    if (pct > 80) return "#ef4444" // red-500
    if (pct > 50) return "#f59e0b" // amber-500
    return "#10b981" // emerald-500
  }

  const GaugeCard = ({ title, value, unit, max, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
      <h3 className="text-slate-500 font-bold mb-4">{title}</h3>
      <div style={{ width: 120, height: 120 }}>
        <CircularProgressbar
          value={value}
          maxValue={max}
          text={`${value.toFixed(1)}`}
          styles={buildStyles({
            textSize: "20px",
            pathColor: getGasColor(value, max),
            textColor: "#1e293b",
            trailColor: "#f1f5f9",
          })}
        />
      </div>
      <span className="mt-2 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{unit}</span>
    </div>
  )



  const postReadings = {
    co: Number(postDefault.co).toFixed(2),
    lpg: Number(postDefault.lpg).toFixed(2),
    h2: Number(postDefault.h2).toFixed(2),
    nh3: Number(postDefault.nh3).toFixed(1),
    temp: Number(postDefault.temp).toFixed(1),
    hum: Number(postDefault.hum).toFixed(0),
  }

  // Filter and smooth chart data
  const rawChartData = (sensorReadings || [])
    .filter((r) => r.deviceId === myDevice.id)
    .filter((r) => {
       if (!r.timestamp) return false
       const diffHours = (new Date() - new Date(r.timestamp)) / (1000 * 60 * 60)
       if (timeFilter === "1h") return diffHours <= 1
       if (timeFilter === "24h") return diffHours <= 24
       if (timeFilter === "7d") return diffHours <= 168
       if (timeFilter === "1m") return diffHours <= 720
       if (timeFilter === "3m") return diffHours <= 2160
       if (timeFilter === "1y") return diffHours <= 8760
       return true
    })
    .reverse()
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      co: r.CO || 0,
      lpg: r.LPG || 0,
      h2: r.H2 || 0,
      nh3: r.NH3 || 0,
    }))

  // Noise Reduction: Moving Average Smoothing (Window: 5 points)
  const chartData = rawChartData.map((point, index, arr) => {
    const window = arr.slice(Math.max(0, index - 4), index + 1)
    return {
      ...point,
      co: Number((window.reduce((acc, val) => acc + val.co, 0) / window.length).toFixed(2)),
      lpg: Number((window.reduce((acc, val) => acc + val.lpg, 0) / window.length).toFixed(2)),
      h2: Number((window.reduce((acc, val) => acc + val.h2, 0) / window.length).toFixed(2)),
      nh3: Number((window.reduce((acc, val) => acc + val.nh3, 0) / window.length).toFixed(2)),
    }
  })

  const rawPostChartData = (sensorReadings || [])
    .filter((r) => r.deviceId === `${myDevice.id}_POST`)
    .filter((r) => {
       if (!r.timestamp) return false
       const diffHours = (new Date() - new Date(r.timestamp)) / (1000 * 60 * 60)
       if (timeFilter === "1h") return diffHours <= 1
       if (timeFilter === "24h") return diffHours <= 24
       if (timeFilter === "7d") return diffHours <= 168
       if (timeFilter === "1m") return diffHours <= 720
       if (timeFilter === "3m") return diffHours <= 2160
       if (timeFilter === "1y") return diffHours <= 8760
       return true
    })
    .reverse()
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      co: r.CO || 0,
      lpg: r.LPG || 0,
      h2: r.H2 || 0,
      nh3: r.NH3 || 0,
    }))

  const postChartData = rawPostChartData.map((point, index, arr) => {
    const window = arr.slice(Math.max(0, index - 4), index + 1)
    return {
      ...point,
      co: Number((window.reduce((acc, val) => acc + val.co, 0) / window.length).toFixed(2)),
      lpg: Number((window.reduce((acc, val) => acc + val.lpg, 0) / window.length).toFixed(2)),
      h2: Number((window.reduce((acc, val) => acc + val.h2, 0) / window.length).toFixed(2)),
      nh3: Number((window.reduce((acc, val) => acc + val.nh3, 0) / window.length).toFixed(2)),
    }
  })

  // Report Generation Function (CSV)
  const handleGenerateReport = () => {
    if (!chartData || chartData.length === 0) {
      alert("No data available to generate a report.")
      return
    }

    const headers = ["Timestamp", "Stream Type", "CO (PPM)", "LPG (PPM)", "H2 (PPM)", "NH3 (PPM)"]
    const preRows = chartData.map(d => [d.time, "Pre-Filtration", d.co, d.lpg, d.h2, d.nh3])
    const postRows = postChartData.map(d => [d.time, "Post-Filtration", d.co, d.lpg, d.h2, d.nh3])

    const csvContent = [headers.join(","), ...preRows.map(r => r.join(",")), ...postRows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute("download", `${myDevice.id}_Monthly_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Alerts */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            IoT Dashboard
            {myDevice.status === 'online' ? (
               <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg animate-pulse font-bold">Live Data</span>
            ) : null}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500">Monitoring Device:</span> 
            {(!forceDeviceId && (currentUser?.role === 'Admin' || currentUser?.role === 'admin')) ? (
              <select 
                className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 outline-none cursor-pointer"
                value={myDevice?.id}
                onChange={(e) => setLocalDeviceId(e.target.value)}
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>{d.id}</option>
                ))}
              </select>
            ) : (
              <span className="font-mono font-bold text-blue-600">{myDevice.id}</span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Last Received: {readings.timestamp ? new Date(readings.timestamp).toLocaleString() : "No Data Yet"}
            </span>
          </div>
        </div>
        
        {activeAlerts.length > 0 && (
          <div className="flex flex-col gap-2">
            {activeAlerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold animate-pulse text-sm
                  ${alert.level === "DANGER" ? "bg-red-100 text-red-700 border border-red-200" : "bg-orange-100 text-orange-700 border border-orange-200"}`
                }
              >
                <AlertTriangle size={16} />
                {alert.msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 1: Pre-Filtration */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700 border-l-4 border-emerald-500 pl-3">Live Sensor Feed (Pre-Filtration)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GaugeCard title="CO" value={readings.co} unit="PPM" max={100} icon={Wind} color="slate" />
          <GaugeCard title="LPG" value={readings.lpg} unit="PPM" max={200} icon={Waves} color="orange" />
          <GaugeCard title="H2" value={readings.h2} unit="PPM" max={100} icon={Activity} color="purple" />
          <GaugeCard title="NH3" value={readings.nh3} unit="PPM" max={50} icon={Droplets} color="lime" />
          
          <div className="col-span-2 grid grid-rows-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-sm flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2 opacity-80 mb-1 text-sm"><Thermometer size={16}/> Temp</div>
                <div className="text-2xl font-bold">{readings.temp?.toFixed(1)}°C</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-2xl text-white shadow-sm flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2 opacity-80 mb-1 text-sm"><Droplets size={16}/> Humidity</div>
                <div className="text-2xl font-bold">{readings.hum?.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Component */}
      <div className="flex flex-col items-center justify-center py-4 relative group">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full border-r-2 border-dashed border-indigo-200"></div>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 z-10 transition-transform hover:scale-105 duration-300">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              HEPA + UV-C + Activated Carbon
            </h3>
            <p className="text-xs text-slate-500 font-medium">Purification System Active</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 ml-2 animate-bounce">
            <ArrowDown size={24} />
          </div>
        </div>
      </div>

      {/* Row 2: Post-Filtration */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700 border-l-4 border-indigo-500 pl-3">Filtered Sensor Feed (Post-Purification)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GaugeCard title="CO" value={Number(postReadings.co)} unit="PPM" max={100} icon={Wind} color="slate" />
          <GaugeCard title="LPG" value={Number(postReadings.lpg)} unit="PPM" max={200} icon={Waves} color="orange" />
          <GaugeCard title="H2" value={Number(postReadings.h2)} unit="PPM" max={100} icon={Activity} color="purple" />
          <GaugeCard title="NH3" value={Number(postReadings.nh3)} unit="PPM" max={50} icon={Droplets} color="lime" />
          
          <div className="col-span-2 grid grid-rows-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-sm flex items-center justify-between h-full opacity-90">
              <div>
                <div className="flex items-center gap-2 opacity-80 mb-1 text-sm"><Thermometer size={16}/> Temp</div>
                <div className="text-2xl font-bold">{postReadings.temp}°C</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-2xl text-white shadow-sm flex items-center justify-between h-full opacity-90">
              <div>
                <div className="flex items-center gap-2 opacity-80 mb-1 text-sm"><Droplets size={16}/> Humidity</div>
                <div className="text-2xl font-bold">{postReadings.hum}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Settings Header */}
      <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 opacity-5 scale-150 rotate-12 pointer-events-none">
          <Activity size={240} />
        </div>
        <div className="z-10 relative">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
             <div className="bg-blue-100 text-blue-600 p-2 rounded-xl border border-blue-200 shadow-inner">
               <Activity size={24} />
             </div>
             Advanced Purification Analytics
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-lg">
             Compare dynamic pre-filtration intakes against purified exhaust outputs using native historical smoothing algorithms.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 z-10 w-full xl:w-auto">
          <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl flex-wrap w-full sm:w-auto shadow-inner border border-slate-200/50">
            {["1h", "24h", "7d", "1m", "3m", "1y"].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border border-transparent flex-1 sm:flex-none ${timeFilter === tf ? 'bg-white text-blue-700 shadow border-slate-200/80 scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
             className="flex items-center justify-center w-full sm:w-auto gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 px-5 py-2.5 flex-shrink-0 rounded-xl font-bold transition-all hover:-translate-y-[1px] text-sm"
             onClick={handleGenerateReport}
          >
            <FileText size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Synchronized Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        
        {/* Pre-Filtration Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 bg-rose-50 text-rose-500 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl border-b border-l border-rose-100 shadow-sm z-10 transition-colors group-hover:bg-rose-100">
            Polluted Intake Stream
          </div>
          <h3 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-6">
            <Wind size={18} className="text-slate-400" />
            Raw Environmental Levels
          </h3>
          
          {chartData.length > 0 ? (
            <div className="h-80 w-full ml-[-15px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} minTickGap={40} />
                  <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tickMargin={10} width={40} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", padding: "12px" }} itemStyle={{ fontWeight: "bold" }} labelStyle={{ color: "#64748b", marginBottom: "8px", fontWeight: "bold", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: "bold" }} iconType="circle" />
                  <Line type="basis" dataKey="co" name="CO" stroke="#64748b" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="lpg" name="LPG" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="h2" name="H2" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="nh3" name="NH3" stroke="#84cc16" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400 italic bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
               <Activity size={32} className="mb-3 text-slate-300" />
               No raw intake data available
            </div>
          )}
        </div>

        {/* Post-Filtration Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl border-b border-l border-emerald-100 shadow-sm z-10 transition-colors group-hover:bg-emerald-100">
            Purified Output Stream
          </div>
          <h3 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-emerald-500" />
            Filtered Supply Analytics
          </h3>
          
          {postChartData.length > 0 ? (
            <div className="h-80 w-full ml-[-15px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={postChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} minTickGap={40} />
                  <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tickMargin={10} width={40} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", padding: "12px" }} itemStyle={{ fontWeight: "bold" }} labelStyle={{ color: "#64748b", marginBottom: "8px", fontWeight: "bold", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: "bold" }} iconType="circle" />
                  <Line type="basis" dataKey="co" name="CO" stroke="#64748b" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="lpg" name="LPG" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="h2" name="H2" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="basis" dataKey="nh3" name="NH3" stroke="#84cc16" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400 italic bg-emerald-50/30 rounded-2xl border-2 border-dashed border-emerald-100">
               <Sparkles size={32} className="mb-3 text-emerald-200" />
               No clean output data available
            </div>
          )}
        </div>
      </div>


    </div>
  )
}

export default Dashboard
