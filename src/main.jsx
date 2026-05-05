import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, MapPin, Route, ShieldCheck, Wallet, Plane, AlertTriangle, Layers, Database, GitBranch, Clock, Plus, Trash2 } from 'lucide-react'
import './styles.css'

const destinationCatalog = [
  { city: 'Tokyo', region: 'Japan', cost: 220, risk: 'Medium', tags: ['Transit', 'Food', 'Culture'] },
  { city: 'Paris', region: 'France', cost: 240, risk: 'Medium', tags: ['Museums', 'Walkable', 'Food'] },
  { city: 'New York', region: 'USA', cost: 260, risk: 'High', tags: ['Transit', 'Events', 'Food'] },
  { city: 'Cancun', region: 'Mexico', cost: 180, risk: 'Low', tags: ['Beach', 'Relaxed', 'Resort'] },
  { city: 'Rome', region: 'Italy', cost: 210, risk: 'Medium', tags: ['History', 'Walkable', 'Food'] },
]

const initialTrip = {
  name: 'Japan Spring Sprint',
  travelers: 2,
  budget: 4200,
  days: 7,
  pace: 'Balanced',
  destinations: ['Tokyo'],
}

function buildPlan(trip) {
  const selected = destinationCatalog.filter((d) => trip.destinations.includes(d.city))
  const dailyDestinationCost = selected.reduce((sum, d) => sum + d.cost, 0) / Math.max(selected.length, 1)
  const estimatedSpend = Math.round((dailyDestinationCost + 85 * trip.travelers) * trip.days)
  const remaining = trip.budget - estimatedSpend
  const dailySafeSpend = Math.max(0, Math.floor(trip.budget / Math.max(trip.days, 1)))
  const risk = remaining < 0 ? 'High' : remaining < trip.budget * 0.15 ? 'Medium' : 'Low'
  const itinerary = Array.from({ length: Math.min(trip.days, 5) }, (_, index) => {
    const city = selected[index % Math.max(selected.length, 1)]?.city || 'Choose destination'
    return {
      day: index + 1,
      title: index === 0 ? `Arrive and orient in ${city}` : `Explore ${city} with ${trip.pace.toLowerCase()} pacing`,
      systemNote: index === 0 ? 'Low-friction first day to reduce travel fatigue.' : 'Groups nearby activities to reduce transit overhead.',
    }
  })
  return { selected, estimatedSpend, remaining, dailySafeSpend, risk, itinerary }
}

function App() {
  const [trip, setTrip] = useState(initialTrip)
  const [draftDestination, setDraftDestination] = useState('Paris')
  const plan = useMemo(() => buildPlan(trip), [trip])

  const addDestination = () => {
    if (!trip.destinations.includes(draftDestination)) {
      setTrip({ ...trip, destinations: [...trip.destinations, draftDestination] })
    }
  }

  const removeDestination = (city) => {
    setTrip({ ...trip, destinations: trip.destinations.filter((d) => d !== city) })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Plane size={16} /> Travel Planner v2</span>
          <h1>Plan trips like a system, not a checklist.</h1>
          <p>
            A travel planning prototype that shows system-design thinking: constraints, risk signals, budgets, itinerary generation, and decision visibility in one responsive interface.
          </p>
          <div className="hero-actions">
            <a href="#planner" className="primary-btn">Open Planner</a>
            <a href="#architecture" className="secondary-btn">View System Design</a>
          </div>
        </div>
        <div className="system-card">
          <div className="card-header"><Layers /> Decision Engine</div>
          <div className="signal-grid">
            <div><strong>{plan.risk}</strong><span>Budget Risk</span></div>
            <div><strong>${plan.dailySafeSpend}</strong><span>Safe / Day</span></div>
            <div><strong>{trip.destinations.length}</strong><span>Stops</span></div>
            <div><strong>{trip.days}</strong><span>Days</span></div>
          </div>
        </div>
      </section>

      <section id="planner" className="planner-grid">
        <div className="panel form-panel">
          <h2>Trip Inputs</h2>
          <label>Trip Name<input value={trip.name} onChange={(e) => setTrip({ ...trip, name: e.target.value })} /></label>
          <div className="two-col">
            <label>Budget ($)<input type="number" value={trip.budget} onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })} /></label>
            <label>Days<input type="number" value={trip.days} onChange={(e) => setTrip({ ...trip, days: Number(e.target.value) })} /></label>
          </div>
          <div className="two-col">
            <label>Travelers<input type="number" value={trip.travelers} onChange={(e) => setTrip({ ...trip, travelers: Number(e.target.value) })} /></label>
            <label>Pace<select value={trip.pace} onChange={(e) => setTrip({ ...trip, pace: e.target.value })}><option>Relaxed</option><option>Balanced</option><option>Fast</option></select></label>
          </div>
          <label>Add Destination<select value={draftDestination} onChange={(e) => setDraftDestination(e.target.value)}>{destinationCatalog.map((d) => <option key={d.city}>{d.city}</option>)}</select></label>
          <button className="primary-btn full" onClick={addDestination}><Plus size={18} /> Add Stop</button>
        </div>

        <div className="panel output-panel">
          <h2>{trip.name}</h2>
          <div className="metric-row">
            <div><Wallet /><strong>${plan.estimatedSpend}</strong><span>Estimated Spend</span></div>
            <div><ShieldCheck /><strong>${plan.remaining}</strong><span>Budget Delta</span></div>
            <div><AlertTriangle /><strong>{plan.risk}</strong><span>Risk Level</span></div>
          </div>
          <div className="destinations">
            {plan.selected.map((d) => (
              <div className="destination-card" key={d.city}>
                <div><MapPin size={18} /><strong>{d.city}</strong><span>{d.region}</span></div>
                <button onClick={() => removeDestination(d.city)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel itinerary-panel">
        <div className="section-title"><CalendarDays /><h2>Generated Itinerary Preview</h2></div>
        <div className="itinerary-list">
          {plan.itinerary.map((item) => (
            <article key={item.day}>
              <span>Day {item.day}</span>
              <h3>{item.title}</h3>
              <p>{item.systemNote}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="architecture">
        <div className="section-title"><GitBranch /><h2>System Design Thinking</h2></div>
        <div className="architecture-grid">
          <div className="panel"><Database /><h3>Data Model</h3><p>Trip inputs are separated from derived outputs so calculations can change without corrupting user intent.</p></div>
          <div className="panel"><Route /><h3>Decision Layer</h3><p>Budget, risk, pacing, and destination costs are converted into visible planning signals.</p></div>
          <div className="panel"><Clock /><h3>Future Scale</h3><p>The UI is designed so real APIs, auth, persistence, and recommendation services can be added cleanly later.</p></div>
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
