import { v2 as cloudinary } from 'cloudinary'
import { config } from './index.js'

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
})

export const cloudinaryUpload = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'carpenter-furniture',
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    uploadStream.end(buffer)
  })
}

export const cloudinaryDelete = (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export const cloudinaryDeleteMultiple = (publicIds, resourceType = 'image') => {
  return cloudinary.api.delete_resources(publicIds, { resource_type: resourceType })
}

export function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  })
}

export function getVideoUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    quality: 'auto',
    ...options
  })
}

export default cloudinary