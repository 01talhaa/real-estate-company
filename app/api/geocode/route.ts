import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    // Try with country bias for better results in Bangladesh
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=BD&limit=5&types=address,place,locality,neighborhood`
    )

    const data = await response.json()
    console.log('Mapbox geocoding results:', data.features?.length || 0, 'results')

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      const isExactMatch = data.features[0].place_type?.includes('address')
      
      return NextResponse.json({
        success: true,
        data: {
          lat: lat,
          lng: lng,
          display_name: data.features[0].place_name
        },
        fallback: !isExactMatch,
        message: isExactMatch ? 'Exact location found' : 'Approximate location - drag marker to adjust'
      })
    } else {
      // Fallback: Try to extract city/country from address
      const parts = address.split(',').map(p => p.trim())
      
      if (parts.length >= 2) {
        // Try broader search with just city
        const cityQuery = parts.slice(-2).join(', ')
        const fallbackResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityQuery)}.json?access_token=${mapboxToken}&limit=1`
        )
        
        const fallbackData = await fallbackResponse.json()
        
        if (fallbackData.features && fallbackData.features.length > 0) {
          const [lng, lat] = fallbackData.features[0].center
          return NextResponse.json({
            success: true,
            data: {
              lat: lat,
              lng: lng,
              display_name: fallbackData.features[0].place_name + ' (Approximate)'
            },
            fallback: true
          })
        }
      }

      // Last resort: Return Dhaka center for Bangladesh addresses
      return NextResponse.json({
        success: true,
        data: {
          lat: 23.8103,
          lng: 90.4125,
          display_name: 'Dhaka, Bangladesh (Approximate)'
        },
        fallback: true
      })
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to geocode address' },
      { status: 500 }
    )
  }
}
