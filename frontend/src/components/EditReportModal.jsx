import React, { useState } from 'react'
import { updateReport } from '../services/api.js'
import Map from './Map.jsx'

const categories = ['Road', 'Water', 'Power', 'Waste', 'Other']
const urgencies = ['Low', 'Medium', 'High']

export default function EditReportModal({ report, onClose, onSave }) {
  const [form, setForm] = useState({
    title: report.title,
    description: report.description,
    category: report.category,
    urgency: report.urgency,
    lat: report.location?.lat || '',
    lng: report.location?.lng || ''
  })
  const [customCategory, setCustomCategory] = useState(report.customCategory || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function onPickLocation(location) {
    setForm({
      ...form,
      lat: location.lat,
      lng: location.lng
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const updatedData = { ...form }
      if (form.category === 'Other' && customCategory) {
        updatedData.customCategory = customCategory
      }
      
      // Include location data in the update
      if (form.lat && form.lng) {
        updatedData.location = {
          lat: form.lat,
          lng: form.lng
        }
      }
      
      await updateReport(report._id, updatedData)
      onSave()
    } catch (e) {
      setError('Failed to update report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input 
                className="w-full border p-2 rounded" 
                value={form.title} 
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea 
                className="w-full border p-2 rounded" 
                rows="4" 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select 
                  className="w-full border p-2 rounded" 
                  value={form.category} 
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Urgency</label>
                <select 
                  className="w-full border p-2 rounded" 
                  value={form.urgency} 
                  onChange={(e) => setForm({...form, urgency: e.target.value})}
                >
                  {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            
            {form.category === 'Other' && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Custom Category</label>
                <input 
                  className="w-full border p-2 rounded" 
                  placeholder="Describe the issue (e.g., Streetlight, Tree, Signage)" 
                  value={customCategory} 
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={form.lat} 
                  onChange={(e) => setForm({...form, lat: e.target.value})}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={form.lng} 
                  onChange={(e) => setForm({...form, lng: e.target.value})}
                  readOnly
                />
              </div>
            </div>
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm text-gray-600 mb-1">Location (Click on map to update)</label>
            <Map 
              reports={[]} 
              onPickLocation={onPickLocation} 
              searchLocation={form.lat && form.lng ? {lat: form.lat, lng: form.lng} : null}
            />
            <p className="text-sm text-gray-600">Click on the map to set a new location for this report.</p>
          </div>
        </form>
      </div>
    </div>
  )
}