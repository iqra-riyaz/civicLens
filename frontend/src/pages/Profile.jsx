import React, { useState, useEffect } from 'react'
import { useAuth } from '../services/authContext.jsx'
import { fetchMyReports, deleteReport } from '../services/api.js'
import ReportCard from '../components/ReportCard.jsx'
import EditReportModal from '../components/EditReportModal.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingReport, setEditingReport] = useState(null)

  async function loadReports() {
    if (!user) return
    try {
      setLoading(true)
      const data = await fetchMyReports()
      setReports(data)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [user])

  async function handleDelete(reportId) {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId)
        setReports(reports.filter(r => r._id !== reportId))
      } catch (error) {
        console.error("Failed to delete report:", error)
      }
    }
  }

  function handleEdit(report) {
    setEditingReport(report)
  }

  function handleEditSave() {
    setEditingReport(null)
    loadReports()
  }

  if (!user) return null
  
  return (
    <div className="space-y-6">
      <div className="max-w-lg bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="space-y-2">
          {user.avatarUrl && <img src={user.avatarUrl} className="w-24 h-24 rounded-full" />}
          <div><span className="text-gray-500">Name:</span> {user.name}</div>
          <div><span className="text-gray-500">Email:</span> {user.email}</div>
          <div><span className="text-gray-500">Role:</span> {user.role}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Reports</h2>
        {loading ? (
          <p>Loading your reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-500">You haven't submitted any reports yet.</p>
        ) : (
          <div className="grid gap-4">
            {reports.map(report => (
              <div key={report._id} className="bg-white p-4 rounded border flex gap-4">
                {report.imageUrl && <img src={report.imageUrl} className="w-32 h-24 object-cover rounded" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{report.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{report.status}</span>
                  </div>
                  <p className="text-sm text-gray-700">{report.description}</p>
                  <div className="text-sm mt-1">{report.customCategory ? report.customCategory : report.category} • {report.urgency}</div>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => handleEdit(report)} 
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(report._id)} 
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingReport && (
        <EditReportModal 
          report={editingReport} 
          onClose={() => setEditingReport(null)} 
          onSave={handleEditSave} 
        />
      )}
    </div>
  )
}


