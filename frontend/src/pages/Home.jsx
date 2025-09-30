import React, { useEffect, useState } from 'react'
import Map from '../components/Map.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { fetchReports } from '../services/api.js'

export default function Home() {
  const [reports, setReports] = useState([])
  const [filters, setFilters] = useState({ category: '', urgency: '' })
  const [searchLocation, setSearchLocation] = useState(null)

  async function load() {
    const data = await fetchReports({ ...filters })
    setReports(data)
  }

  useEffect(() => { load() }, [])

  async function applyFilters(e) {
    e.preventDefault()
    await load()
  }
  
  function handleLocationFound(location) {
    setSearchLocation(location)
  }
  
  async function onReportUpdated() {
    await load()
  }

  return (
    <div className="space-y-4">
      <SearchBar onLocationFound={handleLocationFound} />
      <div className="bg-white p-4 rounded shadow">
        <form onSubmit={applyFilters} className="flex gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600">Category</label>
            <select className="border p-2 rounded" value={filters.category} onChange={(e)=>setFilters({...filters, category: e.target.value})}>
              <option value="">All</option>
              {['Road','Water','Power','Waste','Other'].map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Urgency</label>
            <select className="border p-2 rounded" value={filters.urgency} onChange={(e)=>setFilters({...filters, urgency: e.target.value})}>
              <option value="">All</option>
              {['Low','Medium','High'].map(u=> <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
        </form>
      </div>
      <Map reports={reports} searchLocation={searchLocation} onReportUpdated={onReportUpdated} />
      <section className="bg-gray-50 rounded-lg shadow-sm border overflow-hidden animate-fadeIn">
        <div className="p-6 md:p-8 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Why CivicLens?</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">
            CivicLens bridges communities and authorities, enabling faster, smarter, and more transparent action on civic issues. It raises <span className="font-semibold text-blue-700">awareness</span>,
            <span className="font-semibold text-blue-700"> empowerment</span>, and supports <span className="font-semibold text-blue-700">secure</span> reporting so problems are solved sooner.
          </p>
          <div className="mt-5 grid md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4 border hover:shadow transition">
              <h3 className="font-semibold mb-1">📝 Report & Track</h3>
              <p className="text-sm text-gray-700">Log potholes, leaks, outages, and sanitation issues with location, photos, and urgency.</p>
            </div>
            <div className="rounded-lg p-4 border hover:shadow transition">
              <h3 className="font-semibold mb-1">🗺️ Visual Awareness</h3>
              <p className="text-sm text-gray-700">Severity-colored markers make hotspots obvious, empowering faster response.</p>
            </div>
            <div className="rounded-lg p-4 border hover:shadow transition">
              <h3 className="font-semibold mb-1">✅ Action & Accountability</h3>
              <p className="text-sm text-gray-700">Statuses progress from Pending to Resolved for transparent outcomes.</p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-gray-50">
          <h3 className="text-xl font-semibold text-blue-700">Key Features</h3>
          <ul className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-gray-800">
            <li className="flex items-start gap-2 p-3 bg-white rounded border hover:shadow-sm transition"><span>🔒</span><span><span className="font-semibold">Secure Reporting:</span> Protects user data while ensuring accountability.</span></li>
            <li className="flex items-start gap-2 p-3 bg-white rounded border hover:shadow-sm transition"><span>🗺️</span><span><span className="font-semibold">Interactive Map:</span> Visualizes reports in real time for quick understanding.</span></li>
            <li className="flex items-start gap-2 p-3 bg-white rounded border hover:shadow-sm transition"><span>🎯</span><span><span className="font-semibold">Advanced Filters:</span> Sort by type, priority, or location.</span></li>
            <li className="flex items-start gap-2 p-3 bg-white rounded border hover:shadow-sm transition"><span>🧭</span><span><span className="font-semibold">Admin Dashboard:</span> Monitor, manage, and act on reports seamlessly.</span></li>
            <li className="flex items-start gap-2 p-3 bg-white rounded border hover:shadow-sm transition md:col-span-2"><span>🤝</span><span><span className="font-semibold">Community Empowerment:</span> Engages citizens, raises awareness, and contributes to a safer, organized environment.</span></li>
          </ul>
        </div>
      </section>
    </div>
  )
}


