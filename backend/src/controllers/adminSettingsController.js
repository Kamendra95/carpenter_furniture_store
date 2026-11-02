import {
  getBusinessSettings,
  getPublicBusinessSettings,
  updateBusinessSettings
} from '../models/BusinessSettings.js'
import { cloudinaryUpload, cloudinaryDelete } from '../config/cloudinary.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { serializeSettings } from '../models/serializers.js'

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getBusinessSettings()

  res.json({
    success: true,
    data: serializeSettings(settings)
  })
})

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const currentSettings = await getBusinessSettings()
  let uploadedLogo = null

  if (req.file) {
    uploadedLogo = await cloudinaryUpload(req.file.buffer, {
      folder: 'carpenter-furniture/settings',
      resource_type: 'image',
      public_id: `logo-${Date.now()}`
    })
  }

  const payload = { ...req.body }

  if (uploadedLogo) {
    payload.logo_url = uploadedLogo.secure_url
    payload.logo_public_id = uploadedLogo.public_id
  }

  let updated

  try {
    updated = await updateBusinessSettings(payload)
  } catch (error) {
    if (uploadedLogo) {
      try {
        await cloudinaryDelete(uploadedLogo.public_id)
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded logo:', cleanupError.message)
      }
    }
    throw error
  }

  if (uploadedLogo && currentSettings.logoPublicId && currentSettings.logoPublicId !== uploadedLogo.public_id) {
    try {
      await cloudinaryDelete(currentSettings.logoPublicId)
    } catch (error) {
      console.error('Failed to delete old logo:', error.message)
    }
  }

  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: serializeSettings(updated)
  })
})

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getPublicBusinessSettings()
  const serialized = serializeSettings(settings)
  delete serialized.logo_public_id

  res.json({
    success: true,
    data: serialized
  })
})
