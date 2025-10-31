'use client'

interface GoogleMapProps {
  lat: number
  lng: number
  onLocationChange?: (lat: number, lng: number) => void
  draggable?: boolean
  zoom?: number
  height?: string
}

export function GoogleMap({ 
  lat, 
  lng, 
  onLocationChange, 
  draggable = false,
  zoom = 15,
  height = '400px'
}: GoogleMapProps) {
  
  // Don't show map if no coordinates
  if (!lat || !lng || lat === 0 || lng === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-white border-2 border-dashed rounded-lg"
        style={{ height }}
      >
        <p className="text-sm text-black">Enter address and click "Update Map Now" to show location</p>
      </div>
    )
  }

  // Use Google Maps Embed API with API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoom}`
  
  return (
    <div className="w-full">
      <iframe
        key={`${lat}-${lng}`}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
        className="rounded-lg shadow-md"
        title="Property Location"
      />
      {draggable && (
        <p className="mt-2 text-sm text-black">
          📍 Map shows current address location. Click "Update Map Now" button to refresh.
        </p>
      )}
    </div>
  )
}
