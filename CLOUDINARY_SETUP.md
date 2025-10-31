# Cloudinary Upload Preset Setup

To enable image uploads in the admin panel, you need to create an unsigned upload preset in your Cloudinary account.

## Steps:

1. **Login to Cloudinary Dashboard**
   - Go to https://cloudinary.com/console
   - Login with your account

2. **Navigate to Settings**
   - Click on the gear icon (Settings) in the top right
   - Go to "Upload" tab

3. **Create Upload Preset**
   - Scroll down to "Upload presets" section
   - Click "Add upload preset"
   - Set the following:
     * **Preset name**: `real_estate_upload`
     * **Signing Mode**: `Unsigned` (Important!)
     * **Folder**: `real-estate` (optional, for organization)
     * **Access mode**: `public`
   - Click "Save"

4. **Update .env File**
   - The preset name `real_estate_upload` is already in your `.env` file
   - Make sure these variables are set:
     ```
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dmhwqfotb
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=real_estate_upload
     ```

5. **Test Upload**
   - Restart your Next.js development server
   - Go to `/admin/properties/new`
   - Try uploading an image in the Featured Image section
   - If successful, the image will appear and you'll see a success toast

## Important Notes:

- **Unsigned uploads** allow client-side uploads without exposing API secrets
- Images are automatically stored in your Cloudinary account
- URLs are secure (https) and optimized
- Cloudinary provides automatic image optimization and transformations

## Troubleshooting:

If uploads fail:
1. Check browser console for errors
2. Verify the upload preset name matches exactly: `real_estate_upload`
3. Ensure signing mode is set to "Unsigned"
4. Check that NEXT_PUBLIC_ variables are in .env (they're needed in browser)
5. Restart dev server after .env changes

## Usage:

The image upload components are now used in:
- ✅ Property Form: Featured image, property images, floor plans
- ✅ Insight Form: Featured image, author avatar
- ✅ Gallery Form: Individual gallery images

All images upload directly from your device with drag-and-drop or file selection.
