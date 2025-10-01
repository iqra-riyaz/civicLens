import React, { useEffect, useState } from 'react'
import { fetchReports, updateReportStatus } from '../services/api.js'
import ReportCard from '../components/ReportCard.jsx'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [statusFilter, setStatusFilter] = useState('')

  async function load() {
    const data = await fetchReports({ status: statusFilter || undefined })
    setReports(data)
  }

  useEffect(() => { load() }, [statusFilter])

  async function onUpdateStatus(id, status, proofData) {
    await updateReportStatus(id, status, proofData)
    await load()
  }
  
  async function onReportUpdated() {
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow flex gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-600">Status</label>
          <select className="border p-2 rounded" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {['Pending','In Progress','Resolved'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3">
        {reports.map(r => (
          <ReportCard 
            key={r._id} 
            report={r} 
            canUpdate={true} 
            onUpdateStatus={onUpdateStatus} 
            onReportUpdated={onReportUpdated}
          />
        ))}
      </div>
    </div>
  )
}


