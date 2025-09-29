import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function LocationButton({ onLocationFound }) {
  const map = useMap();
  
  // Create a blue location marker
  const createLocationMarker = (position) => {
    return L.circleMarker(position, {
      radius: 8,
      fillColor: '#3b82f6',
      color: '#2563eb',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });
  };

  const handleClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        
        // Center map on user location
        map.setView([latitude, longitude], 15);
        
        // Create and add marker
        const marker = createLocationMarker([latitude, longitude]);
        marker.addTo(map);
        
        // Pass location to parent component if needed
        if (onLocationFound) {
          onLocationFound(userLocation);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your location permissions.');
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleClick}
          className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 text-blue-600 rounded-md shadow-md"
          title="Show my location"
          aria-label="Show my location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}