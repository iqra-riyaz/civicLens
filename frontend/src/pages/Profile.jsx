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
      // Sort reports by updatedAt (newest first)
      const sortedReports = [...data].sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      )
      setReports(sortedReports)
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
              <div key={report._id}>
                <ReportCard 
                  report={report}
                  onDelete={handleDelete}
                  onReportUpdated={() => loadReports()}
                  editButton={
                    <button 
                      onClick={() => handleEdit(report)} 
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                    >
                      Edit
                    </button>
                  }
                />
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


