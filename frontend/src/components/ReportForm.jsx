import React, { useState } from 'react'
import { createReport } from '../services/api.js'
import Map from './Map.jsx'

const categories = ['Road', 'Water', 'Power', 'Waste', 'Other']
const urgencies = ['Low', 'Medium', 'High']

export default function ReportForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'Road', urgency: 'Low', lat: '', lng: '' })
  const [customCategory, setCustomCategory] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onPickLocation({ lat, lng }) {
    setForm((f) => ({ ...f, lat, lng }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      if (form.category === 'Other' && customCategory) {
        fd.append('customCategory', customCategory)
      }
      if (image) fd.append('image', image)
      const created = await createReport(fd)
      onCreated?.(created)
      setForm({ title: '', description: '', category: 'Road', urgency: 'Low', lat: '', lng: '' })
      setCustomCategory('')
      setImage(null)
    } catch (e) {
      setError('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Report an issue</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
          <textarea className="w-full border p-2 rounded" placeholder="Description" rows="4" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
          <div className="flex gap-3">
            <select className="border p-2 rounded" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})}>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border p-2 rounded" value={form.urgency} onChange={(e)=>setForm({...form, urgency: e.target.value})}>
              {urgencies.map(u=> <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {form.category === 'Other' && (
            <input className="w-full border p-2 rounded" placeholder="Describe the issue (e.g., Streetlight, Tree, Signage)" value={customCategory} onChange={(e)=>setCustomCategory(e.target.value)} />
          )}
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 rounded" placeholder="Lat" value={form.lat} onChange={(e)=>setForm({...form, lat: e.target.value})} />
            <input className="border p-2 rounded" placeholder="Lng" value={form.lng} onChange={(e)=>setForm({...form, lng: e.target.value})} />
          </div>
          <input type="file" onChange={(e)=>setImage(e.target.files?.[0])} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading? 'Submitting...' : 'Submit'}</button>
        </div>
        <div>
          <Map reports={[]} onPickLocation={onPickLocation} />
          <p className="text-sm text-gray-600 mt-2">Click on the map to set location.</p>
        </div>
      </form>
    </div>
  )
}


