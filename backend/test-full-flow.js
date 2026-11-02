import { connectDB } from './src/config/database.js'
import { findProducts } from './src/models/Product.js'
import * as CategoryModel from './src/models/Category.js'
import { paginationValidator, productFilterValidator } from './src/validators/adminValidators.js'

async function test() {
  await connectDB()
  
  // Simulate the validator middleware
  const req = { query: {} }
  const res = {}
  let nextCalled = false
  const next = () => { nextCalled = true }
  
  // Run paginationValidator
  console.log('Running validators...')
  for (const validator of paginationValidator) {
    await validator.run(req)
  }
  for (const validator of productFilterValidator) {
    await validator.run(req)
  }
  
  const { validationResult } = await import('express-validator')
  const errors = validationResult(req)
  console.log('Validation errors:', errors.array())
  
  if (!errors.isEmpty()) {
    console.log('Validation failed')
    return
  }
  
  console.log('Validated query:', req.query)
  
  // Run controller logic
  const { page = 1, limit = 12, category, min_price, max_price, search, availability, featured, sort = 'createdAt', order = 'DESC' } = req.query
  
  console.log('Parsed params:', { page, limit, category, min_price, max_price, search, availability, featured, sort, order })
  
  const result = await findProducts({
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    category,
    minPrice: min_price ? parseFloat(min_price) : undefined,
    maxPrice: max_price ? parseFloat(max_price) : undefined,
    search,
    availability,
    featured: featured === 'true',
    sort,
    order
  })
  
  console.log('findProducts result:', result.pagination.total, 'products')
  
  process.exit(0)
}

test().catch(e => { console.error(e); process.exit(1) })