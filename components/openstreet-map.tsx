'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface OpenStreetMapProps {
  lat: number
  lng: number
  onLocationChange?: (lat: number, lng: number) => void
  draggable?: boolean
  zoom?: number
  height?: string
}

export function OpenStreetMap({ 
  lat, 
  lng, 
  onLocationChange, 
  draggable = false,
  zoom = 15,
  height = '400px'
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapRef.current) return
    
    // Don't show map if no coordinates
    if (!lat || !lng || lat === 0 || lng === 0) return

    // Import Leaflet dynamically (client-side only)
    import('leaflet').then((L) => {
      // Clear existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Create map
      const map = L.map(mapRef.current!).setView([lat, lng], zoom)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom marker icon (fix for default marker not showing)
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      // Add marker
      const marker = L.marker([lat, lng], {
        icon: defaultIcon,
        draggable: draggable
      }).addTo(map)

      // Add popup
      marker.bindPopup('Property Location')

      // Handle drag events
      if (draggable && onLocationChange) {
        marker.on('dragend', (event: any) => {
          const position = event.target.getLatLng()
          onLocationChange(position.lat, position.lng)
        })
      }

      mapInstanceRef.current = map
      markerRef.current = marker
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, zoom, draggable, onLocationChange])

  // Don't show map if no coordinates
  if (!lat || !lng || lat === 0 || lng === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-gradient-to-br from-green-muted to-gray-50 border-2 border-dashed border-green-light rounded-lg p-8"
        style={{ height }}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-base font-medium text-black mb-2">Map Preview</p>
          <p className="text-sm text-black">
            {draggable ? 'Fill in address fields above, then click "Update Map Now"' : 'No location data available'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full rounded-lg shadow-md border border-gray-300"
        style={{ height }}
      />
      {draggable && (
        <p className="mt-2 text-sm text-black">
          📍 Map shows current address location. Drag the marker to adjust exact position.
        </p>
      )}
    </div>
  )
}
