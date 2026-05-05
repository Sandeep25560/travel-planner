import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, MapPin, Route, ShieldCheck, Wallet, Plane, AlertTriangle, Layers, Database, GitBranch, Clock, Plus, Trash2, Sparkles, Server, RefreshCcw } from 'lucide-react'
import './styles.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const destinationCatalog = [
  { city: 'Tokyo', region: 'Japan', cost: 220, risk: 'Medium', tags: ['Transit', 'Food', 'Culture'] },
  { city: 'Paris', region: 'France', cost: 240, risk: 'Medium', tags: ['Museums', 'Walkable', 'Food'] },
  { city: 'New York', region: 'USA', cost: 260, risk: 'High', tags: ['Transit', 'Events', 'Food'] },
  { city: 'Cancun', region: 'Mexico', cost: 180, risk: 'Low', tags: ['Beach', 'Relaxed', 'Resort'] },
  { city: 'Rome', region: 'Italy', cost: 210, risk: 'Medium', tags: ['History', 'Walkable', 'Food'] },
  { city: 'Dubai', region: 'UAE', cost: 250, risk: 'High', tags: ['Luxury', 'Transit', 'Desert'] },
]

const initialTrip = { name: 'Japan Spring Sprint', travelers: 2, budget: 4200, days: 7, pace: 'Balanced', destinations: ['Tokyo'] }

function buildPlan(trip) {
  const selected = destinationCatalog.filter((d) => trip.destinations.includes(d.city))
  const dailyDestinationCost = selected.reduce((sum, d) => sum + d.cost, 0) / Math.max(selected.length, 1)
  const estimatedSpend = Math.round((dailyDestinationCost + 85 * trip.travelers) * trip.days)
  const remaining = trip.budget - estimatedSpend
  const dailySafeSpend = Math.max(0, Math.floor(trip.budget / Math.max(trip.days, 1)))
  const risk = remaining < 0 ? 'High' : remaining < trip.budget * 0.15 ? 'Medium' : 'Low'
  const itinerary = Array.from({ length: Math.min(trip.days, 5) }, (_, index) => {
    const city = selected[index % Math.max(selected.length, 1)]?.city || 'Choose destination'
    return { day: index + 1, title: index === 0 ? `Arrive and orient in ${city}` : `Explore ${city} with ${trip.pace.toLowerCase()} pacing`, systemNote: index === 0 ? 'Low-friction first day to reduce travel fatigue.' : 'Groups nearby activities to reduce transit overhead.' }
  })
  return { selected, estimatedSpend, remaining, dailySafeSpend, risk, itinerary }
}

function App() {
  const [trip, setTrip] = useState(initialTrip)
  const [savedTrips, setSavedTrips] = useState([])
  const [draftDestination, setDraftDestination] = useState('Paris')
  const [apiStatus, setApiStatus] = useState('checking')
  const [message, setMessage] = useState('')
  const plan = useMemo(() => buildPlan(trip), [trip])

  const loadTrips = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/trips`)
      if (!response.ok) throw new Error('API unavailable')
      const data = await response.json()
      setSavedTrips(data)
      setApiStatus('connected')
    } catch {
      setApiStatus('offline-demo')
      setSavedTrips([{ id: 'demo', ...initialTrip }])
    }
  }

  useEffect(() => { loadTrips() }, [])

  const saveTrip = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/trips`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(trip) })
      if (!response.ok) throw new Error('Save failed')
      setMessage('Trip saved to Flask + SQLite architecture.')
      loadTrips()
    } catch {
      setMessage('Demo mode: backend not connected in this environment.')
    }
  }

  const deleteTrip = async (id) => {
    if (id === 'demo') return
    await fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE' })
    loadTrips()
  }

  const addDestination = () => !trip.destinations.includes(draftDestination) && setTrip({ ...trip, destinations: [...trip.destinations, draftDestination] })
  const removeDestination = (city) => setTrip({ ...trip, destinations: trip.destinations.filter((d) => d !== city) })

  return (
    <main className="app-shell">
      <div className="orb orb-one" /><div className="orb orb-two" />
      <nav className="topbar"><strong>TravelPlanner Systems</strong><span className={`status ${apiStatus}`}>{apiStatus === 'connected' ? 'API Connected' : apiStatus === 'checking' ? 'Checking API' : 'Demo Mode'}</span></nav>
      <section className="hero">
        <div className="hero-copy glass">
          <span className="eyebrow"><Sparkles size={16} /> System-design travel planner</span>
          <h1>Plan trips through constraints, signals, and decisions.</h1>
          <p>A premium travel planning system that demonstrates architecture thinking: input modeling, derived decisions, persistence, risk scoring, itinerary generation, and API-ready data flow.</p>
          <div className="hero-actions"><a href="#planner" className="primary-btn">Open Planner</a><a href="#architecture" className="secondary-btn">View Architecture</a></div>
        </div>
        <div className="system-card glass">
          <div className="card-header"><Layers /> Decision Engine</div>
          <div className="signal-grid"><div><strong>{plan.risk}</strong><span>Budget Risk</span></div><div><strong>${plan.dailySafeSpend}</strong><span>Safe / Day</span></div><div><strong>{trip.destinations.length}</strong><span>Stops</span></div><div><strong>{trip.days}</strong><span>Days</span></div></div>
        </div>
      </section>
      <section id="planner" className="planner-grid">
        <div className="panel glass"><h2>Trip Inputs</h2><label>Trip Name<input value={trip.name} onChange={(e) => setTrip({ ...trip, name: e.target.value })} /></label><div className="two-col"><label>Budget ($)<input type="number" value={trip.budget} onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })} /></label><label>Days<input type="number" value={trip.days} onChange={(e) => setTrip({ ...trip, days: Number(e.target.value) })} /></label></div><div className="two-col"><label>Travelers<input type="number" value={trip.travelers} onChange={(e) => setTrip({ ...trip, travelers: Number(e.target.value) })} /></label><label>Pace<select value={trip.pace} onChange={(e) => setTrip({ ...trip, pace: e.target.value })}><option>Relaxed</option><option>Balanced</option><option>Fast</option></select></label></div><label>Add Destination<select value={draftDestination} onChange={(e) => setDraftDestination(e.target.value)}>{destinationCatalog.map((d) => <option key={d.city}>{d.city}</option>)}</select></label><div className="button-row"><button className="primary-btn" onClick={addDestination}><Plus size={18} /> Add Stop</button><button className="secondary-btn" onClick={saveTrip}><Server size={18} /> Save</button></div>{message && <p className="message">{message}</p>}</div>
        <div className="panel glass"><h2>{trip.name}</h2><div className="metric-row"><div><Wallet /><strong>${plan.estimatedSpend}</strong><span>Estimated</span></div><div><ShieldCheck /><strong>${plan.remaining}</strong><span>Delta</span></div><div><AlertTriangle /><strong>{plan.risk}</strong><span>Risk</span></div></div><div className="destinations">{plan.selected.map((d) => <div className="destination-card" key={d.city}><div><MapPin size={18} /><strong>{d.city}</strong><span>{d.region} • {d.tags.join(', ')}</span></div><button onClick={() => removeDestination(d.city)}><Trash2 size={16} /></button></div>)}</div></div>
      </section>
      <section className="panel glass"><div className="section-title"><CalendarDays /><h2>Generated Itinerary</h2></div><div className="itinerary-list">{plan.itinerary.map((item) => <article key={item.day}><span>Day {item.day}</span><h3>{item.title}</h3><p>{item.systemNote}</p></article>)}</div></section>
      <section className="panel glass"><div className="section-title"><RefreshCcw /><h2>Saved Trips from API</h2></div><div className="saved-grid">{savedTrips.map((saved) => <article key={saved.id} className="saved-card"><strong>{saved.name}</strong><span>{saved.days} days • ${saved.budget} • {Array.isArray(saved.destinations) ? saved.destinations.join(', ') : saved.destinations}</span><button onClick={() => deleteTrip(saved.id)}>Delete</button></article>)}</div></section>
      <section id="architecture" className="architecture"><div className="section-title"><GitBranch /><h2>Architecture</h2></div><div className="architecture-grid"><div className="panel glass"><Database /><h3>SQLite Persistence</h3><p>Trips are stored in SQLite through a Flask API, separating user intent from computed planning signals.</p></div><div className="panel glass"><Route /><h3>Decision Layer</h3><p>Budget, pacing, destination cost, and risk are derived from inputs instead of manually stored everywhere.</p></div><div className="panel glass"><Clock /><h3>Scale Path</h3><p>The architecture can evolve into auth, recommendation services, trip sharing, and external travel APIs.</p></div></div></section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
