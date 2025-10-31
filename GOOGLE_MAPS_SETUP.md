# Google Maps API Setup

To enable address geocoding and map displays in the property management system.

## Steps to Get API Key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Click on project dropdown at the top
   - Create a new project or select existing one
   - Name it something like "Real Estate Website"

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     * **Maps JavaScript API** (for map displays)
     * **Geocoding API** (for address to coordinates conversion)
     * **Places API** (optional, for address autocomplete)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Secure Your API Key (Important!)**
   - Click on the API key to edit it
   - Under "Application restrictions":
     * For development: Choose "HTTP referrers"
     * Add: `http://localhost:3000/*`
     * Add: `https://www.pqrix.com/*`
   - Under "API restrictions":
     * Choose "Restrict key"
     * Select: Maps JavaScript API, Geocoding API, Places API
   - Click "Save"

6. **Update .env File**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
   Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual key

7. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Features Enabled:

### 1. Address Geocoding (Admin Panel)
- In `/admin/properties/new` or `/admin/properties/edit/[id]`
- Location tab has "Get Coordinates" button
- Enter full address and click button
- Automatically fills latitude/longitude fields

### 2. Map Display (Coming Soon)
The coordinates stored in database can be used to:
- Show property location on detail pages
- Display properties on interactive map
- Show nearby properties on map view

## Testing Geocoding:

1. Go to `/admin/properties/new`
2. Navigate to "Location" tab
3. Fill in:
   - Address: "123 Main Street"
   - City: "New York"
   - State: "NY"
   - Country: "USA"
4. Click "Get Coordinates" button
5. Latitude and Longitude should auto-fill

## Cost Information:

- Google Maps offers $200 free credit per month
- Geocoding: $5 per 1000 requests (after free tier)
- Maps display: $7 per 1000 loads (after free tier)
- Free tier is usually sufficient for small-medium websites

## Troubleshooting:

If geocoding doesn't work:
1. Check browser console for errors
2. Verify API key is correct in `.env`
3. Ensure Geocoding API is enabled in Google Cloud Console
4. Check API key restrictions allow your domain
5. Restart dev server after `.env` changes

## Security Best Practices:

✅ **DO:**
- Use `NEXT_PUBLIC_` prefix (required for client-side)
- Restrict API key to specific domains
- Restrict API key to only needed APIs
- Monitor usage in Google Cloud Console

❌ **DON'T:**
- Commit `.env` file to Git (already in .gitignore)
- Share API key publicly
- Leave key unrestricted

## Future Enhancements:

Once API key is configured, you can add:
- Interactive map on property detail pages
- Property search by map area
- Nearby properties finder
- Distance calculations
- Route directions to properties
