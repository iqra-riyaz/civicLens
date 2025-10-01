import React, { useState, useEffect } from 'react'
import { upvoteReport } from '../services/api'
import { useAuth } from '../services/authContext'
import StatusUpdateModal from './StatusUpdateModal'

export default function ReportCard({ report, onUpdateStatus, canUpdate, onReportUpdated, onDelete, editButton }) {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(report.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Check if current user has already upvoted this report
  useEffect(() => {
    if (user && report.upvoters) {
      setHasUpvoted(report.upvoters.includes(user._id));
    }
  }, [user, report.upvoters]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleUpvote = async () => {
    try {
      setIsUpvoting(true);
      const updatedReport = await upvoteReport(report._id);
      setUpvoteCount(updatedReport.upvotes);
      setHasUpvoted(!hasUpvoted);
      if (onReportUpdated) {
        onReportUpdated(report._id);
      }
    } catch (error) {
      console.error('Failed to toggle upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow flex gap-4">
        {report.imageUrl && <img src={report.imageUrl} className="w-32 h-24 object-cover rounded" />}
        <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{report.status}</span>
        </div>
        <p className="text-sm text-gray-700">{report.description}</p>
        <div className="text-sm mt-1">{report.customCategory ? report.customCategory : report.category} • {report.urgency}</div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">Created: {formatDate(report.createdAt)}</div>
          <div className="flex items-center">
            <button 
              onClick={handleUpvote} 
              disabled={isUpvoting}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition ${hasUpvoted ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${hasUpvoted ? 'text-blue-600' : ''}`} fill={hasUpvoted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>{upvoteCount}</span>
            </button>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          {canUpdate && (
            <button 
              onClick={() => setShowStatusModal(true)} 
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
            >
              Update Status
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(report._id)} 
              className="px-3 py-1 bg-red-600 text-white text-sm rounded"
            >
              Delete
            </button>
          )}
          {editButton}
        </div>
        
        {/* Display proof text if available */}
        {report.proof && report.proof.text && (
          <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
            <div className="font-medium">Admin Update:</div>
            <p>{report.proof.text}</p>
          </div>
        )}
        
        {/* Display proof image if available */}
        {report.proof && report.proof.imageUrl && (
          <div className="mt-2">
            <button 
              onClick={() => window.open(report.proof.imageUrl, '_blank')}
              className="flex items-center text-blue-600 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Proof Image
            </button>
          </div>
        )}
        </div>
      </div>
      
      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          report={report}
          onClose={() => setShowStatusModal(false)}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </>)
}


