import React from 'react'

export default function ReportCard({ report, onUpdateStatus, canUpdate }) {
  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      {report.imageUrl && <img src={report.imageUrl} className="w-32 h-24 object-cover rounded" />}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{report.status}</span>
        </div>
        <p className="text-sm text-gray-700">{report.description}</p>
        <div className="text-sm mt-1">{report.customCategory ? report.customCategory : report.category} • {report.urgency}</div>
        {canUpdate && (
          <div className="mt-2 flex gap-2">
            {['Pending', 'In Progress', 'Resolved'].map(s => (
              <button key={s} onClick={()=>onUpdateStatus(report._id, s)} className={`px-2 py-1 text-sm rounded border ${report.status===s?'bg-blue-600 text-white':'bg-white'}`}>{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


