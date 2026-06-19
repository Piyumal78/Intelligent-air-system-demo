"use client"

import { useState, useEffect } from "react"
import { User, Lock, ShieldCheck, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const { login, error: authError, currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' || currentUser.role === 'Admin') {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, navigate]);
  const [formData, setFormData] = useState({ email: "", password: "", deviceId: "" })
  const [localError, setLocalError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    setLoading(true)

    try {
      console.log("[v0] Login attempt:", formData.email)
      await login(formData.email, formData.password, !isAdmin ? formData.deviceId : null)
      // Navigation is handled by the useEffect
    } catch (error) {
      console.error("[v0] Login failed:", error)
      setLocalError(error.message || "Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome Back!</h1>
            <p className="text-slate-500">Sign in to access the {isAdmin ? "Admin Portal" : "Smart Monitor"}</p>
          </div>

          <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                !isAdmin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                isAdmin ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Admin Login
            </button>
          </div>

          {(localError || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={18} />
              <span>{localError || authError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address / Username"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all font-medium text-slate-700 ${
                  isAdmin ? "focus:ring-purple-500" : "focus:ring-blue-500"
                }`}
              />
            </div>

            {!isAdmin && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Device ID"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all font-medium text-slate-700 focus:ring-blue-500`}
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all font-medium text-slate-700 ${isAdmin ? "focus:ring-purple-500" : "focus:ring-blue-500"}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdmin
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/30"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/30"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-500">Admin: admin2@airpurify.com / admin123</p>
            <p className="text-xs text-slate-500">User: user2@airpurify.com / {`<Device ID>`} / user123</p>
          </div>
        </div>

        {/* Right Side - Image/Info */}
        <div
          className={`hidden md:flex w-1/2 p-12 flex-col justify-between relative transition-colors duration-500 ${isAdmin ? "bg-purple-900" : "bg-blue-900"}`}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
              <ShieldCheck size={16} />
              Secure System
            </div>
          </div>

          <div className="relative z-10 text-white">
            <h2 className="text-4xl font-bold mb-4 leading-tight">Smart Air Monitoring & Gas Detection</h2>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90">
              Real-time protection against harmful gases including LPG, CO, and more. Monitor your environment 24/7 with
              our intelligent IoT solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
