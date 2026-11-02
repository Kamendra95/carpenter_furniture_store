import { Router } from 'express'
import { 
  getAdminSettings,
  getPublicSettings,
  updateAdminSettings
} from '../controllers/adminSettingsController.js'
import { authenticateToken } from '../middleware/auth.js'
import { settingsValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'
import multer from 'multer'
import { config } from '../config/index.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const error = new Error('Invalid file type. Allowed: JPEG, PNG, WebP')
      error.name = 'MulterError'
      error.code = 'INVALID_FILE_TYPE'
      error.statusCode = 400
      cb(error)
    }
  }
})

router.use(authenticateToken)

router.get('/', getAdminSettings)
router.get('/public', getPublicSettings)
router.put('/', upload.single('logo'), settingsValidator, validate, updateAdminSettings)

export default router