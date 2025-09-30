import React, { useEffect, useState } from 'react'
import ReportForm from '../components/ReportForm.jsx'
import ReportCard from '../components/ReportCard.jsx'
import { fetchReports, updateReportStatus } from '../services/api.js'
import { useAuth } from '../services/authContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])

  async function load() {
    const data = await fetchReports()
    setReports(data)
  }

  useEffect(() => { load() }, [])

  async function onCreated() {
    await load()
  }

  async function onUpdateStatus(id, status) {
    await updateReportStatus(id, status)
    await load()
  }

  async function onReportUpdated() {
    await load()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="space-y-4">
      {!isAdmin && <ReportForm onCreated={onCreated} />}
      <div className="grid gap-3">
        {reports.map(r => (
          <ReportCard 
            key={r._id} 
            report={r} 
            canUpdate={isAdmin} 
            onUpdateStatus={onUpdateStatus} 
            onReportUpdated={onReportUpdated}
          />
        ))}
      </div>
    </div>
  )
}


