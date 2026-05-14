/**
 * Utility functions for image uploads
 * Uses Cloudinary for image hosting
 */

export interface UploadedImage {
  url: string
  publicId: string
  width?: number
  height?: number
}

/**
 * Upload image to Cloudinary
 * Uses Cloudinary's unsigned upload preset for security
 */
export async function uploadToCloudinary(
  file: File,
  preset: string = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
): Promise<UploadedImage> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", preset)
  formData.append("folder", "sabit-cms/projects")

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary")
  }

  const data = await response.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  }
}

/**
 * Delete image from Cloudinary
 * Requires server-side API call for security
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This should be called from a server action or API route
  // Never expose Cloudinary API key to client
  const response = await fetch("/api/admin/images/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  })

  if (!response.ok) {
    throw new Error("Failed to delete image from Cloudinary")
  }
}

/**
 * Get Cloudinary image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string
  } = {}
): string {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  const transforms: string[] = []

  if (options.width) {
    transforms.push(`w_${options.width}`)
  }
  if (options.height) {
    transforms.push(`h_${options.height}`)
  }
  if (options.crop) {
    transforms.push(`c_${options.crop}`)
  }
  if (options.quality) {
    transforms.push(`q_${options.quality}`)
  }

  const path = transforms.length > 0 ? `/${transforms.join(",")}` : ""

  return `${baseUrl}${path}/${publicId}`
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 10MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid image format. Supported: JPG, PNG, WebP, GIF" }
  }

  return { valid: true }
}
