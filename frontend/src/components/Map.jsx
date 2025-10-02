import React, { useRef, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, LayersControl, LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import LocationButton from './LocationButton.jsx'
import { upvoteReport } from '../services/api'
import { useAuth } from '../services/authContext'

const { BaseLayer } = LayersControl

// Style config for severity markers (clean circular icons)
function styleForUrgency(urgency) {
  switch (urgency) {
    case 'High':
      return { bg: '#ef4444', border: '#b91c1c', label: '!' } // red
    case 'Medium':
      return { bg: '#f97316', border: '#c2410c', label: '!' } // orange
    case 'Low':
    default:
      return { bg: '#f59e0b', border: '#b45309', label: '•' } // yellow
  }
}

// Create a circular DivIcon with severity color and category initial label
function createSeverityIcon(urgency, category) {
  const { bg, border } = styleForUrgency(urgency)
  const label = (category || '?').charAt(0).toUpperCase()
  const size = 28
  const html = `
    <div style="
      width:${size}px; height:${size}px;
      background:${bg};
      border:2px solid ${border};
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.25);
      display:flex; align-items:center; justify-content:center;
      color:#fff; font-weight:700; font-size:16px; line-height:1;">
      ${label}
    </div>`
  return new L.DivIcon({ className: 'severity-marker', html, iconSize: [size, size], iconAnchor: [size/2, size/2] })
}

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) { onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) },
  })
  return null
}

// Component to handle map operations like panning to a location
function MapController({ searchLocation }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (searchLocation) {
      map.setView([searchLocation.lat, searchLocation.lng], 15);
    }
  }, [searchLocation, map]);
  
  return null;
}

// Report popup component with upvote functionality
function ReportPopup({ report, onReportUpdated }) {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(report.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (user && report.upvoters) {
      setHasUpvoted(report.upvoters.includes(user._id));
    }
  }, [user, report.upvoters]);

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
    <div className="space-y-1">
      <div className="font-semibold">{report.title}</div>
      <div className="text-sm">{report.customCategory ? report.customCategory : report.category} • {report.urgency} • {report.status}</div>
      <p className="text-sm">{report.description}</p>
      {report.imageUrl && <img src={report.imageUrl} className="mt-1 max-h-40" />}
      <div className="flex justify-end mt-2">
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
  );
}

export default function Map({ reports = [], onPickLocation, searchLocation, onReportUpdated }) {
  const [userLocation, setUserLocation] = useState(null);
  const markersRef = useRef({});
  const center = reports[0]?.location ? [reports[0].location.lat, reports[0].location.lng] : [20, 0]
  
  const handleLocationFound = (location) => {
    setUserLocation(location);
  };
  
  return (
    <MapContainer 
      center={center} 
      zoom={3} 
      style={{ height: '400px', width: '100%' }}
      worldCopyJump={false}
      minZoom={2}
      maxBounds={[
        [-90, -180],
        [90, 180]
      ]}>
      <LayersControl position="bottomright">
        {/* Default: Carto Voyager (colorful, English-only) */}
        <BaseLayer checked name="Default">
          <TileLayer 
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
            attribution="&copy; OpenStreetMap contributors, &copy; CARTO" 
          />
        </BaseLayer>
        
        {/* Satellite View (Esri World Imagery) */}
        <BaseLayer name="Satellite">
          <TileLayer 
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
            attribution="&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community" 
          />
        </BaseLayer>
      </LayersControl>
      
      {onPickLocation && <LocationPicker onPick={onPickLocation} />}
      <MapController searchLocation={searchLocation} />
      <LocationButton onLocationFound={handleLocationFound} />
      {reports.map((r) => (
        <Marker 
          key={r._id} 
          position={[r.location.lat, r.location.lng]} 
          icon={createSeverityIcon(r.urgency, r.category)}
          ref={(ref) => {
            if (ref) {
              markersRef.current[r._id] = ref;
            } else if (markersRef.current[r._id]) {
              delete markersRef.current[r._id];
            }
          }}
        >
          <Popup>
            <ReportPopup report={r} onReportUpdated={onReportUpdated} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}


