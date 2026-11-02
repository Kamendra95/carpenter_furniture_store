import { Router } from 'express'
import { 
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateAdminProductStatus,
  uploadProductMedia,
  deleteAdminProductMedia
} from '../controllers/adminProductController.js'
import { authenticateToken } from '../middleware/auth.js'
import { uploadRateLimit } from '../middleware/rateLimiter.js'
import multer from 'multer'
import { productValidator, productMediaValidator, idParamValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'
import { config } from '../config/index.js'

const router = Router()

const allowedTypes = [...config.upload.allowedImageTypes, ...config.upload.allowedVideoTypes]

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const error = new Error('Invalid file type. Allowed: JPEG, PNG, WebP, MP4, WebM, MOV')
      error.name = 'MulterError'
      error.code = 'INVALID_FILE_TYPE'
      error.statusCode = 400
      cb(error)
    }
  }
})

router.use(authenticateToken)

router.get('/', getAdminProducts)
router.get('/:id', idParamValidator(), validate, getAdminProductById)
router.post('/', upload.array('media', 10), productValidator, validate, createAdminProduct)
router.put('/:id', upload.array('media', 10), idParamValidator(), productValidator, validate, updateAdminProduct)
router.delete('/:id', idParamValidator(), validate, deleteAdminProduct)
router.patch('/:id/status', idParamValidator(), validate, updateAdminProductStatus)

router.post('/:id/media', uploadRateLimit, upload.single('file'), productMediaValidator, validate, uploadProductMedia)
router.delete('/:id/media/:mediaId', idParamValidator('id'), idParamValidator('mediaId'), validate, deleteAdminProductMedia)

export default router