import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Landing.css"

const Landing = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [aqiValue, setAqiValue] = useState(42)
  const heroDeviceRef = useRef(null)
  const ctaParticlesRef = useRef(null)

  // Navigate helper
  const handleGoToDashboard = (e) => {
    e.preventDefault()
    if (currentUser) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  // Effect for live AQI fluctuation & Device bars
  useEffect(() => {
    const timer = setInterval(() => {
      // Small fluctuation around 38-45
      setAqiValue((prev) => {
        const diff = Math.random() > 0.5 ? 1 : -1
        const next = prev + diff
        return next >= 35 && next <= 45 ? next : prev
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Effect for Scroll Reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal")
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    revealElements.forEach((el) => revealObserver.observe(el))
    return () => revealObserver.disconnect()
  }, [])

  // Effect for Hero device floating particles
  useEffect(() => {
    const deviceWrap = heroDeviceRef.current
    if (!deviceWrap) return

    const particleInterval = setInterval(() => {
      const p = document.createElement("div")
      p.classList.add("particle")
      const size = Math.random() * 4 + 2
      const tx = (Math.random() - 0.5) * 200
      const ty = -100 - Math.random() * 150
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.background = Math.random() > 0.5 ? "var(--cyan)" : "var(--green)"
      p.style.left = "50%"
      p.style.bottom = "40%"
      p.style.setProperty("--tx", `${tx}px`)
      p.style.setProperty("--ty", `${ty}px`)
      p.style.animationDuration = `${Math.random() * 2 + 2}s`
      deviceWrap.appendChild(p)

      setTimeout(() => {
        if (deviceWrap.contains(p)) {
          p.remove()
        }
      }, 4000)
    }, 400)

    return () => clearInterval(particleInterval)
  }, [])

  // Effect for CTA section background particles
  useEffect(() => {
    const ctaParticles = ctaParticlesRef.current
    if (!ctaParticles) return

    const particleCount = 15
    const activeParticles = []

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div")
      p.classList.add("cp")
      const size = Math.random() * 3 + 2
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.background = "var(--cyan)"
      p.style.left = `${Math.random() * 100}%`
      p.style.bottom = "0"
      p.style.opacity = Math.random().toString()
      p.style.animationDuration = `${Math.random() * 8 + 5}s`
      p.style.animationDelay = `${Math.random() * 5}s`
      ctaParticles.appendChild(p)
      activeParticles.push(p)
    }

    return () => {
      activeParticles.forEach((p) => {
        if (ctaParticles.contains(p)) {
          p.remove()
        }
      })
    }
  }, [])

  return (
    <div className="landing-page-container">
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="nav-logo-dot"></div>
          AirSense AI
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#ai-section">AI Engine</a>
          <a href="#monitoring">Monitoring</a>
          <a href="#specs">Specs</a>
        </div>
        <a href="#dashboard" onClick={handleGoToDashboard} className="nav-cta">
          View Dashboard
        </a>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="hero-grid"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Breathe Smarter.
            <br />
            Live Healthier.
          </h1>
          <p className="hero-sub">
            AI-Powered Air Quality Monitoring, Prediction, and Purification System for intelligent indoor environments.
          </p>
          <div className="hero-btns">
            <a href="#dashboard" onClick={handleGoToDashboard} className="btn-primary">
              View Dashboard
            </a>
            <a href="#features" className="btn-secondary">
              Explore Features
            </a>
          </div>

          {/* Device Mock */}
          <div className="device-wrap" id="device-wrap" ref={heroDeviceRef}>
            <div className="device-ring ring-1"></div>
            <div className="device-ring ring-2"></div>
            <div className="device-ring ring-3"></div>

            <div className="device-body">
              <div className="device-screen">
                <div className="device-aqi">AQI INDEX</div>
                <div className="device-aqi-num" id="hero-aqi">
                  {aqiValue}
                </div>
                <div className="device-aqi-label">GOOD</div>
                <div className="device-bars" id="hero-bars">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const height = 8 + Math.floor(Math.sin((idx + aqiValue) * 0.8) * 6) + ((idx * 3) % 4)
                    return (
                      <div
                        key={idx}
                        className="d-bar"
                        style={{
                          height: `${Math.max(4, Math.min(24, height))}px`,
                          background: "var(--cyan)",
                          opacity: 0.3 + (idx / 12) * 0.7,
                        }}
                      ></div>
                    )
                  })}
                </div>
              </div>
              <div className="device-leds">
                <div className="device-led led-g"></div>
                <div className="device-led led-c"></div>
                <div className="device-led led-b"></div>
              </div>
              <div className="device-fan">
                <div className="device-fan-inner"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="inner">
          <div className="centered reveal">
            <div className="section-label">Capabilities</div>
            <h2 className="section-title">Everything your air needs.</h2>
            <p className="section-sub" style={{ textAlign: "center" }}>
              A complete multi-sensor, multi-stage purification and intelligence platform in a single compact device.
            </p>
          </div>
          <div className="features-grid reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="feature-item">
              <div className="feature-icon">🌬️</div>
              <div className="feature-name">Real-time AQI</div>
              <div className="feature-desc">Continuous air quality index monitoring with instant alerts and trend analysis.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔬</div>
              <div className="feature-name">PM2.5 Detection</div>
              <div className="feature-desc">Laser particle counter detects fine particulate matter down to 2.5 micrometers.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚗️</div>
              <div className="feature-name">Gas Detection</div>
              <div className="feature-desc">MQ135 sensor identifies CO, LPG, smoke and volatile organic compounds.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌡️</div>
              <div className="feature-name">Temp & Humidity</div>
              <div className="feature-desc">DHT22 sensor delivers precise temperature and relative humidity readings.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔵</div>
              <div className="feature-name">HEPA Filtration</div>
              <div className="feature-desc">H13 HEPA filter captures 99.97% of particles ≥0.3μm including bacteria and pollen.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🟢</div>
              <div className="feature-name">Activated Carbon</div>
              <div className="feature-desc">Eliminates odors, gases, VOCs, and chemical pollutants at the molecular level.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">☀️</div>
              <div className="feature-name">UV-C Sterilization</div>
              <div className="feature-desc">Germicidal UV-C lamp destroys bacteria, viruses, and mold spores passing through.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <div className="feature-name">AI Prediction</div>
              <div className="feature-desc">Machine learning forecasts pollution 4+ hours ahead using historical and live data.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-name">Smart Fan Control</div>
              <div className="feature-desc">Adaptive fan speed auto-adjusts based on predicted and real-time air quality.</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div className="feature-name">Mobile & Web App</div>
              <div className="feature-desc">Monitor and control from anywhere via responsive web dashboard and mobile app.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard">
        <div className="inner">
          <div className="reveal">
            <div className="section-label">Visualization</div>
            <h2 class="section-title">Data that tells the whole story.</h2>
            <p className="section-sub">Beautiful, real-time analytics dashboards for air quality, predictions, and system performance.</p>
          </div>

          <div className="dash-layout reveal" style={{ transitionDelay: "0.1s" }}>
            {/* AQI Gauge */}
            <div className="dash-card">
              <div className="dash-card-title">AIR QUALITY INDEX</div>
              <div className="gauge-wrap">
                <svg className="gauge-svg" width="120" height="80" viewBox="0 0 120 80">
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00ff88" />
                      <stop offset="50%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#ff4466" />
                    </linearGradient>
                  </defs>
                  <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="url(#gauge-grad)" strokeWidth="8" strokeLinecap="round" strokeDasharray="157" strokeDashoffset="94" />
                  <text x="60" y="65" textAnchor="middle" fill="#00d4ff" fontSize="22" fontWeight="700" fontFamily="Inter">
                    {aqiValue}
                  </text>
                </svg>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>Current AQI</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#00ff88" }}>Good</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>Safe for all groups</div>
                </div>
              </div>

              <div className="sensors-row" style={{ marginTop: "20px" }}>
                <div className="sensor-cell">
                  <div className="sc-label">PM2.5</div>
                  <div className="sc-val" style={{ color: "#00d4ff" }}>
                    12.4 <span className="sc-unit">μg/m³</span>
                  </div>
                  <div className="sc-bar">
                    <div className="sc-bar-fill" style={{ width: "25%", background: "#00d4ff" }}></div>
                  </div>
                </div>
                <div className="sensor-cell">
                  <div className="sc-label">TEMPERATURE</div>
                  <div className="sc-val" style={{ color: "#ff9944" }}>
                    24.1 <span className="sc-unit">°C</span>
                  </div>
                  <div className="sc-bar">
                    <div className="sc-bar-fill" style={{ width: "55%", background: "#ff9944" }}></div>
                  </div>
                </div>
                <div className="sensor-cell">
                  <div className="sc-label">HUMIDITY</div>
                  <div className="sc-val" style={{ color: "#00ff88" }}>
                    58 <span className="sc-unit">%</span>
                  </div>
                  <div className="sc-bar">
                    <div className="sc-bar-fill" style={{ width: "58%", background: "#00ff88" }}></div>
                  </div>
                </div>
                <div className="sensor-cell">
                  <div className="sc-label">TVOC</div>
                  <div className="sc-val" style={{ color: "#aa88ff" }}>
                    0.18 <span className="sc-unit">ppm</span>
                  </div>
                  <div className="sc-bar">
                    <div className="sc-bar-fill" style={{ width: "18%", background: "#aa88ff" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 24h Trend Chart */}
            <div className="dash-card">
              <div className="dash-card-title">PM2.5 · 24-HOUR TREND</div>
              <svg width="100%" height="160" viewBox="0 0 380 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,212,255,0.25)" />
                    <stop offset="100%" stopColor="rgba(0,212,255,0)" />
                  </linearGradient>
                  <linearGradient id="pred-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,255,136,0.15)" />
                    <stop offset="100%" stopColor="rgba(0,255,136,0)" />
                  </linearGradient>
                </defs>
                {/* Area fills */}
                <path d="M0,110 C20,105 40,90 60,95 S100,115 120,108 S160,70 180,65 S220,80 240,75 S280,85 300,80 S340,95 380,100 L380,160 L0,160Z" fill="url(#area-grad)" />
                <path d="M240,75 S270,55 300,50 S340,45 380,40 L380,160 L240,160Z" fill="url(#pred-grad)" opacity="0.5" />
                {/* Lines */}
                <path d="M0,110 C20,105 40,90 60,95 S100,115 120,108 S160,70 180,65 S220,80 240,75" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                <path d="M240,75 S270,55 300,50 S340,45 380,40" fill="none" stroke="#00ff88" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                {/* Threshold */}
                <line x1="0" y1="50" x2="380" y2="50" stroke="rgba(255,80,80,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="4" y="46" fill="rgba(255,80,80,0.6)" fontSize="9" fontFamily="Inter">
                  Threshold 35μg/m³
                </text>
                {/* Labels */}
                <text x="0" y="155" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">12a</text>
                <text x="90" y="155" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">6a</text>
                <text x="185" y="155" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">12p</text>
                <text x="280" y="155" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">6p</text>
                <text x="350" y="155" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Now</text>
                {/* Legend */}
                <circle cx="240" cy="20" r="3" fill="#00d4ff" />
                <text x="248" y="24" fill="rgba(180,195,230,0.7)" fontSize="9" fontFamily="Inter">Measured</text>
                <line x1="295" y1="20" x2="310" y2="20" stroke="#00ff88" strokeWidth="2" strokeDasharray="4 3" />
                <text x="314" y="24" fill="rgba(180,195,230,0.7)" fontSize="9" fontFamily="Inter">Predicted</text>
              </svg>
            </div>

            {/* Purification Status */}
            <div className="dash-card">
              <div className="dash-card-title">PURIFICATION SYSTEM STATUS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "var(--muted)" }}>HEPA Filter efficiency</span>
                    <span style={{ color: "#00ff88", fontWeight: "600" }}>87%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "87%", background: "linear-gradient(90deg,#00ff88,#00d4ff)", borderRadius: "4px" }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "var(--muted)" }}>Activated Carbon capacity</span>
                    <span style={{ color: "#EF9F27", fontWeight: "600" }}>62%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "62%", background: "linear-gradient(90deg,#EF9F27,#ffcc44)", borderRadius: "4px" }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "var(--muted)" }}>UV-C Sterilization intensity</span>
                    <span style={{ color: "#aa88ff", fontWeight: "600" }}>Active</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "78%", background: "linear-gradient(90deg,#aa88ff,#6644ff)", borderRadius: "4px" }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "var(--muted)" }}>Fan speed</span>
                    <span style={{ color: "#00d4ff", fontWeight: "600" }}>1,200 RPM</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "40%", background: "linear-gradient(90deg,#00d4ff,#0066ff)", borderRadius: "4px" }}></div>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                <div style={{ background: "rgba(0,255,136,0.06)", border: "0.5px solid rgba(0,255,136,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>ENERGY SAVED</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#00ff88" }}>34%</div>
                </div>
                <div style={{ background: "rgba(0,212,255,0.06)", border: "0.5px solid rgba(0,212,255,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>UPTIME</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#00d4ff" }}>99.7%</div>
                </div>
              </div>
            </div>

            {/* Historical Analytics */}
            <div className="dash-card">
              <div className="dash-card-title">HISTORICAL ANALYTICS · 7-DAY AVERAGE</div>
              <svg width="100%" height="140" viewBox="0 0 380 140" preserveAspectRatio="none">
                <rect x="10" y="60" width="38" height="65" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="64" y="40" width="38" height="85" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="118" y="75" width="38" height="50" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="172" y="30" width="38" height="95" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="226" y="55" width="38" height="70" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="280" y="45" width="38" height="80" rx="4" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                <rect x="334" y="68" width="38" height="57" rx="4" fill="rgba(0,212,255,0.6)" stroke="rgba(0,212,255,0.8)" strokeWidth="0.5" />

                <text x="29" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Mon</text>
                <text x="83" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Tue</text>
                <text x="137" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Wed</text>
                <text x="191" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Thu</text>
                <text x="245" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Fri</text>
                <text x="299" y="135" textAnchor="middle" fill="rgba(180,195,230,0.5)" fontSize="9" fontFamily="Inter">Sat</text>
                <text x="353" y="135" textAnchor="middle" fill="rgba(180,195,230,0.9)" fontSize="9" fontFamily="Inter" fontWeight="600">Today</text>

                <text x="29" y="55" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">38</text>
                <text x="83" y="35" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">51</text>
                <text x="137" y="70" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">29</text>
                <text x="191" y="25" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">62</text>
                <text x="245" y="50" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">43</text>
                <text x="299" y="40" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="Inter">49</text>
                <text x="353" y="63" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="Inter" fontWeight="700">42</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai-section">
        <div className="ai-bg"></div>
        <div className="ai-layout">
          <div className="ai-text reveal">
            <div className="section-label">Intelligence Engine</div>
            <h2 className="section-title">Machine Learning Driven Adaptive Air Purification</h2>
            <p className="section-sub" style={{ marginTop: "16px" }}>
              Our AI model continuously analyzes real-time and historical sensor data to forecast pollution trends and autonomously tune purification parameters for optimal performance and energy efficiency.
            </p>
            <div className="ai-points">
              <div className="ai-point">
                <div className="ai-point-icon">📈</div>
                <div>
                  <h4>Predictive forecasting</h4>
                  <p>Predicts PM2.5 and AQI levels 4+ hours ahead with high accuracy using time-series ML models.</p>
                </div>
              </div>
              <div className="ai-point">
                <div className="ai-point-icon">⚙️</div>
                <div>
                  <h4>Adaptive purification control</h4>
                  <p>Automatically adjusts fan speed and UV-C intensity based on predicted pollution, cutting energy use by up to 34%.</p>
                </div>
              </div>
              <div className="ai-point">
                <div className="ai-point-icon">🔔</div>
                <div>
                  <h4>Proactive alerts</h4>
                  <p>Sends early warnings before air quality deteriorates, enabling preventive action.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Neural net SVG */}
          <div className="neural-wrap reveal" style={{ transitionDelay: "0.15s" }}>
            <svg width="300" height="340" viewBox="0 0 300 340">
              <defs>
                <filter id="glow-filter">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text x="30" y="20" fill="rgba(0,212,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="Inter">INPUT</text>
              <text x="150" y="20" fill="rgba(0,212,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="Inter">HIDDEN</text>
              <text x="270" y="20" fill="rgba(0,212,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="Inter">OUTPUT</text>

              {/* Input nodes */}
              <circle id="n1" cx="30" cy="70" r="14" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
              <circle id="n2" cx="30" cy="120" r="14" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
              <circle id="n3" cx="30" cy="170" r="14" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
              <circle id="n4" cx="30" cy="220" r="14" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
              <circle id="n5" cx="30" cy="270" r="14" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
              <text x="30" y="74" textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="7" fontFamily="Inter">PM2.5</text>
              <text x="30" y="124" textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="7" fontFamily="Inter">AQI</text>
              <text x="30" y="174" textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="7" fontFamily="Inter">TEMP</text>
              <text x="30" y="224" textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="7" fontFamily="Inter">HUM</text>
              <text x="30" y="274" textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="7" fontFamily="Inter">GAS</text>

              {/* Hidden layer 1 */}
              <circle cx="110" cy="55" r="14" fill="rgba(100,80,255,0.12)" stroke="rgba(120,100,255,0.5)" strokeWidth="1" />
              <circle cx="110" cy="110" r="14" fill="rgba(100,80,255,0.12)" stroke="rgba(120,100,255,0.5)" strokeWidth="1" />
              <circle cx="110" cy="165" r="14" fill="rgba(100,80,255,0.12)" stroke="rgba(120,100,255,0.5)" strokeWidth="1" />
              <circle cx="110" cy="220" r="14" fill="rgba(100,80,255,0.12)" stroke="rgba(120,100,255,0.5)" strokeWidth="1" />
              <circle cx="110" cy="275" r="14" fill="rgba(100,80,255,0.12)" stroke="rgba(120,100,255,0.5)" strokeWidth="1" />

              {/* Hidden layer 2 */}
              <circle cx="190" cy="55" r="14" fill="rgba(0,180,180,0.12)" stroke="rgba(0,200,200,0.5)" strokeWidth="1" />
              <circle cx="190" cy="110" r="14" fill="rgba(0,180,180,0.12)" stroke="rgba(0,200,200,0.5)" strokeWidth="1" />
              <circle cx="190" cy="165" r="14" fill="rgba(0,180,180,0.12)" stroke="rgba(0,200,200,0.5)" strokeWidth="1" />
              <circle cx="190" cy="220" r="14" fill="rgba(0,180,180,0.12)" stroke="rgba(0,200,200,0.5)" strokeWidth="1" />
              <circle cx="190" cy="275" r="14" fill="rgba(0,180,180,0.12)" stroke="rgba(0,200,200,0.5)" strokeWidth="1" />

              {/* Output nodes */}
              <circle cx="270" cy="120" r="16" fill="rgba(0,255,136,0.15)" stroke="rgba(0,255,136,0.7)" strokeWidth="1.5" />
              <circle cx="270" cy="185" r="16" fill="rgba(0,255,136,0.15)" stroke="rgba(0,255,136,0.7)" strokeWidth="1.5" />
              <circle cx="270" cy="250" r="16" fill="rgba(0,255,136,0.15)" stroke="rgba(0,255,136,0.7)" strokeWidth="1.5" />
              <text x="270" y="124" textAnchor="middle" fill="rgba(0,255,136,0.9)" fontSize="7" fontFamily="Inter">AQI+4h</text>
              <text x="270" y="189" textAnchor="middle" fill="rgba(0,255,136,0.9)" fontSize="7" fontFamily="Inter">FAN</text>
              <text x="270" y="254" textAnchor="middle" fill="rgba(0,255,136,0.9)" fontSize="7" fontFamily="Inter">UV-C</text>

              {/* Connections */}
              <g opacity="0.18" stroke="rgba(0,212,255,1)" strokeWidth="0.7" fill="none">
                <line x1="44" y1="70" x2="96" y2="55" /><line x1="44" y1="70" x2="96" y2="110" />
                <line x1="44" y1="120" x2="96" y2="55" /><line x1="44" y1="120" x2="96" y2="165" />
                <line x1="44" y1="170" x2="96" y2="110" /><line x1="44" y1="170" x2="96" y2="220" />
                <line x1="44" y1="220" x2="96" y2="165" /><line x1="44" y1="220" x2="96" y2="275" />
                <line x1="44" y1="270" x2="96" y2="220" /><line x1="44" y1="270" x2="96" y2="275" />
              </g>
              <g opacity="0.15" stroke="rgba(120,100,255,1)" strokeWidth="0.7" fill="none">
                <line x1="124" y1="55" x2="176" y2="55" /><line x1="124" y1="55" x2="176" y2="110" />
                <line x1="124" y1="110" x2="176" y2="55" /><line x1="124" y1="110" x2="176" y2="165" />
                <line x1="124" y1="165" x2="176" y2="110" /><line x1="124" y1="165" x2="176" y2="220" />
                <line x1="124" y1="220" x2="176" y2="165" /><line x1="124" y1="220" x2="176" y2="275" />
                <line x1="124" y1="275" x2="176" y2="220" /><line x1="124" y1="275" x2="176" y2="275" />
              </g>
              <g opacity="0.2" stroke="rgba(0,255,136,1)" strokeWidth="0.7" fill="none">
                <line x1="204" y1="55" x2="254" y2="120" /><line x1="204" y1="110" x2="254" y2="120" />
                <line x1="204" y1="165" x2="254" y2="185" /><line x1="204" y1="220" x2="254" y2="185" />
                <line x1="204" y1="275" x2="254" y2="250" />
              </g>

              {/* Animated pulse dots */}
              <circle r="5" fill="rgba(0,212,255,0.9)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M44,70 L96,55 L124,55 L176,110 L204,110 L254,120" />
              </circle>
              <circle r="4" fill="rgba(0,255,136,0.9)">
                <animateMotion dur="3s" repeatCount="indefinite" begin="0.8s" path="M44,220 L96,275 L124,275 L176,220 L204,220 L254,185" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* MONITORING */}
      <section id="monitoring">
        <div className="inner">
          <div className="centered reveal">
            <div className="section-label">Remote Access</div>
            <h2 className="section-title">Monitor from anywhere.</h2>
            <p className="section-sub" style={{ textAlign: "center" }}>
              Responsive web dashboard and mobile application keep you connected to your air quality 24/7.
            </p>
          </div>

          <div className="monitoring-grid reveal" style={{ transitionDelay: "0.1s" }}>
            {/* Web dashboard mock */}
            <div className="monitor-device">
              <div className="monitor-device-title">WEB DASHBOARD</div>
              <div className="web-dash-mock">
                <div className="web-dash-topbar">
                  <div className="tbar-dot" style={{ background: "#ff5f57" }}></div>
                  <div className="tbar-dot" style={{ background: "#febc2e" }}></div>
                  <div className="tbar-dot" style={{ background: "#28c840" }}></div>
                  <span style={{ fontSize: "9px", color: "rgba(180,195,230,0.4)", marginLeft: "8px" }}>airsense.dashboard.app</span>
                </div>
                <div className="web-dash-body">
                  <div style={{ fontSize: "10px", color: "rgba(180,195,230,0.5)", marginBottom: "10px" }}>LIVE OVERVIEW</div>
                  <div className="web-dash-row">
                    <div className="web-mini-card">
                      <div className="wmc-label">AQI</div>
                      <div className="wmc-val">42</div>
                    </div>
                    <div className="web-mini-card">
                      <div className="wmc-label">PM2.5</div>
                      <div className="wmc-val">12.4</div>
                    </div>
                    <div className="web-mini-card">
                      <div className="wmc-label">TEMP</div>
                      <div className="wmc-val">24°C</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "10px", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "9px", color: "rgba(180,195,230,0.4)", marginBottom: "6px" }}>TREND</div>
                    <svg width="100%" height="36" viewBox="0 0 260 36">
                      <polyline points="0,28 30,24 60,20 90,26 120,15 150,18 180,12 210,16 260,10" fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <polygon points="0,28 30,24 60,20 90,26 120,15 150,18 180,12 210,16 260,10 260,36 0,36" fill="rgba(0,212,255,0.07)" />
                    </svg>
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1, background: "rgba(0,255,136,0.08)", border: "0.5px solid rgba(0,255,136,0.15)", borderRadius: "6px", padding: "8px", fontSize: "9px", color: "rgba(0,255,136,0.8)" }}>☁ Cloud synced</div>
                    <div style={{ flex: 1, background: "rgba(0,212,255,0.08)", border: "0.5px solid rgba(0,212,255,0.15)", borderRadius: "6px", padding: "8px", fontSize: "9px", color: "rgba(0,212,255,0.8)" }}>🔔 1 alert</div>
                  </div>
                </div>
              </div>
              <ul className="monitor-features">
                <li><div className="mf-dot"></div>Real-time live monitoring</li>
                <li><div class="mf-dot"></div>Cloud connectivity & sync</li>
                <li><div className="mf-dot"></div>Historical data reports</li>
                <li><div className="mf-dot"></div>Smart alerts & notifications</li>
              </ul>
            </div>

            {/* Mobile mock */}
            <div className="monitor-device">
              <div className="monitor-device-title">MOBILE APPLICATION</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "180px", background: "rgba(0,0,0,0.6)", borderRadius: "28px", border: "0.5px solid rgba(255,255,255,0.12)", padding: "12px", position: "relative", boxShadow: "0 0 40px rgba(0,100,200,0.15)" }}>
                  {/* notch */}
                  <div style={{ width: "60px", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", margin: "0 auto 10px" }}></div>
                  <div style={{ fontSize: "8px", color: "rgba(0,212,255,0.6)", textAlign: "center", letterSpacing: "0.1em", marginBottom: "8px" }}>AIRSENSE</div>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "36px", fontWeight: "700", color: "#00d4ff", lineHeight: 1 }}>{aqiValue}</div>
                    <div style={{ fontSize: "8px", color: "#00ff88", letterSpacing: "0.08em" }}>GOOD AIR QUALITY</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", marginBottom: "8px" }}>
                    <div style={{ background: "rgba(0,212,255,0.08)", border: "0.5px solid rgba(0,212,255,0.15)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "8px", color: "var(--muted)" }}>PM2.5</div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--cyan)" }}>12.4</div>
                    </div>
                    <div style={{ background: "rgba(0,255,136,0.08)", border: "0.5px solid rgba(0,255,136,0.15)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "8px", color: "var(--muted)" }}>TEMP</div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--green)" }}>24°C</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "8px", color: "var(--muted)", marginBottom: "4px" }}>PURIFIER FAN STATUS</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "9px", color: "var(--text)", fontWeight: "600" }}>Smart Auto Mode</span>
                      <span style={{ fontSize: "8px", color: "var(--green)", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: "4px" }}>ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="monitor-features">
                <li><div className="mf-dot"></div>iOS & Android native apps</li>
                <li><div className="mf-dot"></div>Push notification alerts</li>
                <li><div className="mf-dot"></div>Widgets and Quick Controls</li>
                <li><div className="mf-dot"></div>Siri & Google Assistant support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section id="specs">
        <div className="inner">
          <div className="reveal">
            <div className="section-label">Technical Specs</div>
            <h2 className="section-title">Hardware & Sensor Details</h2>
            <p className="section-sub">Industrial-grade instrumentation designed for precise detection and robust execution.</p>
          </div>
          <div className="specs-grid reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="spec-card">
              <div className="spec-card-num">01 / SENSOR</div>
              <div className="spec-card-name">DHT22 Temperature & Humidity</div>
              <div className="spec-card-desc">Features capacitive humidity sensing and high-precision thermistor for environmental monitoring. Accuracy: ±2% RH, ±0.5°C.</div>
              <div className="spec-accent"></div>
            </div>
            <div className="spec-card">
              <div className="spec-card-num">02 / SENSOR</div>
              <div className="spec-card-name">MQ-135 Gas Detection</div>
              <div className="spec-card-desc">Sensitive tin dioxide sensor calibrated for detection of Ammonia (NH3), Nitrogen oxides (NOx), Alcohol, Carbon Dioxide, Smoke, and LPG.</div>
              <div className="spec-accent"></div>
            </div>
            <div className="spec-card">
              <div className="spec-card-num">03 / SENSOR</div>
              <div className="spec-card-name">Laser PM2.5 Sensor</div>
              <div className="spec-card-desc">Utilizes laser scattering principles to detect particulate matter down to 2.5 and 10 micrometers with high resolution in real-time.</div>
              <div className="spec-accent"></div>
            </div>
            <div className="spec-card">
              <div className="spec-card-num">04 / FILTER</div>
              <div className="spec-card-name">H13 HEPA & Carbon</div>
              <div className="spec-card-desc">Dual-stage filter combining medical-grade HEPA for micro-particles and dense activated carbon matrix for organic vapours.</div>
              <div className="spec-accent"></div>
            </div>
            <div className="spec-card">
              <div className="spec-card-num">05 / PROCESSOR</div>
              <div className="spec-card-name">ESP32 Dual-Core MCU</div>
              <div className="spec-card-desc">Equipped with 240MHz dual-core processor, integrated Wi-Fi and Bluetooth, handling data ingestion and fan control cycles locally.</div>
              <div className="spec-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-bg"></div>
        <div className="cta-grid"></div>
        <div className="cta-particles" ref={ctaParticlesRef}></div>
        <div className="cta-content">
          <span className="cta-tag">ENTERPRISE READY</span>
          <h2 className="cta-title">Ready for cleaner air?</h2>
          <p className="cta-sub">
            Integrate AirSense AI into your office, school, or home environment today. Access full API integrations, multi-device management, and historical CSV datasets.
          </p>
          <a href="#dashboard" onClick={handleGoToDashboard} className="cta-btn">
            Access Dashboard Now
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>© 2026 AirSense AI Project. All rights reserved.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#features" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Features
          </a>
          <a href="#dashboard" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Dashboard
          </a>
          <a href="#specs" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Specs
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Landing
