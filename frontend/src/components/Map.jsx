import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

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

export default function Map({ reports = [], onPickLocation }) {
  const center = reports[0]?.location ? [reports[0].location.lat, reports[0].location.lng] : [20, 0]
  return (
    <MapContainer center={center} zoom={3} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {onPickLocation && <LocationPicker onPick={onPickLocation} />}
      {reports.map((r) => (
        <Marker key={r._id} position={[r.location.lat, r.location.lng]} icon={createSeverityIcon(r.urgency, r.category)}>
          <Popup>
            <div className="space-y-1">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm">{r.customCategory ? r.customCategory : r.category} • {r.urgency} • {r.status}</div>
              <p className="text-sm">{r.description}</p>
              {r.imageUrl && <img src={r.imageUrl} className="mt-1 max-h-40" />}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}


