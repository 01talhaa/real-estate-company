'use client'

import { useState, useEffect } from 'react'

interface GoogleMapProps {
  lat: number
  lng: number
  onLocationChange?: (lat: number, lng: number) => void
  draggable?: boolean
  zoom?: number
  height?: string
  showHint?: boolean
  address?: string
}

/**
 * Google Maps component using Google Maps Embed API
 * Displays an embedded map with the specified location
 */
export function GoogleMap({ 
  lat, 
  lng, 
  onLocationChange, 
  draggable = false,
  zoom = 15,
  height = '400px',
  showHint = false,
  address
}: GoogleMapProps) {
  const [mapUrl, setMapUrl] = useState<string>('')
  
  // Validate coordinates are within valid ranges
  const isValidLat = lat >= -90 && lat <= 90 && !isNaN(lat)
  const isValidLng = lng >= -180 && lng <= 180 && !isNaN(lng)
  const hasValidCoords = isValidLat && isValidLng && lat !== 0 && lng !== 0

  useEffect(() => {
    if (!hasValidCoords) {
      setMapUrl('')
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.error('Google Maps API key not found in environment variables')
      // Fallback to simple embed
      if (address && address.trim()) {
        setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=${zoom}`)
      } else {
        setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=${zoom}`)
      }
      return
    }

    // Use address if available, otherwise use coordinates
    let url: string
    if (address && address.trim()) {
      // Using address for better map display
      const encodedAddress = encodeURIComponent(address)
      url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=${zoom}`
    } else {
      // Using coordinates
      url = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=${zoom}`
    }

    setMapUrl(url)
  }, [lat, lng, address, zoom, hasValidCoords])

  // Show placeholder if no valid coordinates
  if (!hasValidCoords) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-gradient-to-br from-[#D1FAE5] to-gray-50 border-2 border-dashed border-[#10B981] rounded-lg p-8"
        style={{ height }}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // Show error if coordinates are invalid
  if (!isValidLat || !isValidLng) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-8"
        style={{ height }}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-base font-medium text-red-700 mb-2">Invalid Coordinates</p>
          <p className="text-sm text-red-600">
            Latitude must be between -90 and 90<br/>
            Longitude must be between -180 and 180<br/>
            <span className="font-mono text-xs">Current: ({lat?.toFixed(6) || 'N/A'}, {lng?.toFixed(6) || 'N/A'})</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {draggable && showHint && (
        <div className="mb-3 p-3 bg-[#D1FAE5] border border-[#10B981] rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#064E3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium text-[#064E3B] mb-1">📍 Location Preview</p>
            <p className="text-[#064E3B]">
              {address ? `Showing: ${address}` : `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`}
            </p>
            {draggable && (
              <p className="text-[#064E3B] mt-1 text-xs">
                💡 Tip: Update the address fields above to change the map location
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="relative">
        {mapUrl ? (
          <iframe
            key={`map-${lat}-${lng}`}
            width="100%"
            height={height}
            frameBorder="0"
            style={{ border: 0, borderRadius: '0.5rem' }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="shadow-md"
            title="Property Location Map"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      {draggable && (
        <p className="mt-2 text-sm text-black flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Update address fields above to change the map location
        </p>
      )}
      {draggable && (
        <p className="mt-2 text-sm text-black">
          📍 Map shows current address location. Click "Update Map Now" button to refresh.
        </p>
      )}
    </div>
  )
}