import { Server, Smartphone, Database, Shield, Zap, FileText } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
            <Zap className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">AirPurify</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">IoT-Based Gas & Environmental Monitoring System</p>
          <p className="text-sm text-slate-500 mt-2">Real-time air quality monitoring with Firebase integration</p>
        </div>

        {/* Alert Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Project Structure</h3>
              <p className="text-slate-700 mb-3">
                This is a full-stack IoT monitoring system. The React web application is located in the{" "}
                <code className="bg-white px-2 py-1 rounded font-mono text-sm border">smart-gas-monitoring</code>{" "}
                directory.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-mono text-sm text-slate-700 mb-2">To run the web application:</p>
                <code className="block bg-slate-900 text-green-400 p-3 rounded font-mono text-sm">
                  cd smart-gas-monitoring
                  <br />
                  npm install
                  <br />
                  npm run dev
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">System Architecture</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Smartphone size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Frontend App</h3>
            <p className="text-slate-600 text-sm mb-3">
              React + Vite web application with real-time dashboards for users and admins.
            </p>
            <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">smart-gas-monitoring/</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 transition-all">
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Server size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Backend API</h3>
            <p className="text-slate-600 text-sm mb-3">
              Node.js + Express server with Firebase Admin SDK for device data ingestion.
            </p>
            <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">Backend/</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-purple-300 transition-all">
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Database size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Firebase Cloud</h3>
            <p className="text-slate-600 text-sm mb-3">
              Firestore real-time database with Authentication and Cloud Functions.
            </p>
            <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">Cloud Services</p>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Shield className="text-blue-600" size={24} />
            Quick Start Guide
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">1. Configure Firebase</h4>
              <p className="text-slate-600 text-sm mb-2">
                Create a <code className="bg-slate-100 px-2 py-1 rounded text-xs">.env</code> file in the{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">smart-gas-monitoring</code> directory:
              </p>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                VITE_FIREBASE_API_KEY=your_api_key
                <br />
                VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
                <br />
                VITE_FIREBASE_PROJECT_ID=your_project_id
                <br />
                ...
              </div>
              <p className="text-slate-500 text-xs mt-2">
                See <code className="bg-slate-100 px-2 py-1 rounded">.env.example</code> for all required variables
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">2. Seed Demo Data</h4>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs">
                cd scripts
                <br />
                node 002-seed-firestore-data.js
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">3. Demo Credentials</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="font-bold text-purple-900 mb-1 text-sm">Admin Account</p>
                  <p className="text-xs text-purple-700 font-mono">admin@airpurify.com / admin123</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-bold text-blue-900 mb-1 text-sm">User Account</p>
                  <p className="text-xs text-blue-700 font-mono">user@airpurify.com / user123</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">4. Documentation</h4>
              <p className="text-slate-600 text-sm">
                For detailed setup instructions, Firebase configuration, and ESP32 integration, see{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">FIREBASE_SETUP.md</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>Developed as part of IoT-Based Gas & Environmental Monitoring System thesis</p>
          <p className="mt-2">
            Built with React, Firebase, Node.js, and ESP32 | Real-time monitoring for CO, LPG, H₂, NH₃
          </p>
        </div>
      </div>
    </div>
  )
}
