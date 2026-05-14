import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export async function uploadToCloudinary(file: Buffer | string, folder: string = 'pqrix-projects'): Promise<string> {
  try {
    // Verify Cloudinary config
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials are not configured')
    }

    // Convert buffer to base64 data URI
    let uploadData: string
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64')
      // Detect image type from buffer
      const mimeType = file[0] === 0xFF && file[1] === 0xD8 ? 'jpeg' : 
                       file[0] === 0x89 && file[1] === 0x50 ? 'png' : 
                       file[0] === 0x47 && file[1] === 0x49 ? 'gif' : 
                       file[0] === 0x52 && file[1] === 0x49 ? 'webp' : 'png'
      uploadData = `data:image/${mimeType};base64,${base64}`
    } else {
      uploadData = file
    }

    console.log(`Uploading to Cloudinary folder: ${folder}`)
    const result = await cloudinary.uploader.upload(uploadData, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })
    console.log(`Cloudinary upload successful: ${result.secure_url}`)
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`)
    }
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

export function extractPublicId(url: string): string {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  return lastPart.split('.')[0]
}

export default cloudinary
