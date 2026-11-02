import { Router } from 'express'
import { 
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from '../controllers/adminCategoryController.js'
import { authenticateToken } from '../middleware/auth.js'
import { categoryValidator, idParamValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'

const router = Router()

router.use(authenticateToken)

router.get('/', getAdminCategories)
router.get('/:id', idParamValidator(), validate, getAdminCategoryById)
router.post('/', categoryValidator, validate, createAdminCategory)
router.put('/:id', idParamValidator(), categoryValidator, validate, updateAdminCategory)
router.delete('/:id', idParamValidator(), validate, deleteAdminCategory)

export default router