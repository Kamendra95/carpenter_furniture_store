import { Router } from 'express'
import { 
  getAdminInquiries,
  getAdminInquiryStats,
  getAdminInquiryById,
  updateAdminInquiryStatus
} from '../controllers/adminInquiryController.js'
import { authenticateToken } from '../middleware/auth.js'
import { paginationValidator, inquiryStatusValidator, idParamValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'

const router = Router()

router.use(authenticateToken)

router.get('/', paginationValidator, validate, getAdminInquiries)
router.get('/stats', getAdminInquiryStats)
router.get('/:id', idParamValidator(), validate, getAdminInquiryById)
router.patch('/:id/status', idParamValidator(), inquiryStatusValidator, validate, updateAdminInquiryStatus)

export default router