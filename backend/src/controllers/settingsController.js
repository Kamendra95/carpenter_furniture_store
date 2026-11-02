import { getPublicBusinessSettings } from '../models/BusinessSettings.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { serializeSettings } from '../models/serializers.js'

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getPublicBusinessSettings()
  const serialized = serializeSettings(settings)
  delete serialized.logo_public_id

  res.json({
    success: true,
    data: serialized
  })
})
