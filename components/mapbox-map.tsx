'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapboxMapProps {
  lat: number
  lng: number
  onLocationChange?: (lat: number, lng: number) => void
  draggable?: boolean
  zoom?: number
  height?: string
  showHint?: boolean // Show hint banner for dragging
}

export function MapboxMap({ 
  lat, 
  lng, 
  onLocationChange, 
  draggable = false,
  zoom = 15,
  height = '400px',
  showHint = false
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Don't show placeholder if no coordinates
  const hasValidCoords = lat && lng && lat !== 0 && lng !== 0

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !hasValidCoords) return
    
    console.log('Initializing Mapbox with:', { lat, lng })
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    })

    map.current.on('load', () => {
      console.log('Mapbox loaded')
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [hasValidCoords, lat, lng, zoom])

  // Update marker when coordinates change
  useEffect(() => {
    if (!map.current || !mapLoaded || !hasValidCoords) return

    console.log('Updating marker to:', { lat, lng })

    // Remove old marker
    if (marker.current) {
      marker.current.remove()
    }

    // Create new marker with pulse animation for draggable
    const markerElement = document.createElement('div')
    markerElement.className = draggable ? 'custom-marker-draggable' : 'custom-marker'
    markerElement.style.cssText = `
      width: 30px;
      height: 30px;
      background-color: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      cursor: ${draggable ? 'move' : 'default'};
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${draggable && showHint ? 'animation: pulse 2s infinite;' : ''}
    `

    marker.current = new mapboxgl.Marker({
      element: markerElement,
      draggable: draggable
    })
      .setLngLat([lng, lat])
      .addTo(map.current)

    // Add drag event for admin panel
    if (draggable && onLocationChange) {
      marker.current.on('dragstart', () => {
        setIsDragging(true)
      })
      
      marker.current.on('dragend', () => {
        setIsDragging(false)
        if (marker.current) {
          const lngLat = marker.current.getLngLat()
          onLocationChange(lngLat.lat, lngLat.lng)
        }
      })
    }

    // Fly to new location
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
      essential: true
    })
  }, [lat, lng, mapLoaded, draggable, onLocationChange, zoom, hasValidCoords])

  // Don't show map if no coordinates
  if (!hasValidCoords) {
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
      {draggable && showHint && (
        <div className="mb-3 p-3 bg-green-muted border border-green-light rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium text-green-dark mb-1">📍 Approximate Location</p>
            <p className="text-green-dark">
              The map shows a nearby area. <strong>Drag the blue marker</strong> to pinpoint the exact address.
            </p>
          </div>
        </div>
      )}
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg shadow-md"
          style={{ height }}
        />
        {isDragging && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2   px-4 py-2 rounded-full shadow-lg text-sm font-medium z-10">
            Drop to set location
          </div>
        )}
      </div>
      {draggable && (
        <p className="mt-2 text-sm text-black flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag the blue marker to adjust the exact location
        </p>
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
