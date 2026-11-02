function toId(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  if (value._id) return value._id.toString()
  if (value.id) return value.id.toString()
  return value.toString()
}

export function serializeMedia(media) {
  if (!media) return null

  return {
    id: toId(media),
    media_type: media.mediaType || media.media_type || 'image',
    media_url: media.mediaUrl || media.media_url || '',
    public_id: media.publicId || media.public_id || '',
    alt_text: media.altText || media.alt_text || '',
    sort_order: media.sortOrder ?? media.sort_order ?? 0,
    created_at: media.created_at || media.createdAt || null
  }
}

export function serializeCategory(category) {
  if (!category) return null

  return {
    id: toId(category),
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    product_count:
      category.productCount ??
      category.product_count ??
      (Array.isArray(category.products) ? category.products.length : 0),
    created_at: category.created_at || category.createdAt || null,
    updated_at: category.updated_at || category.updatedAt || null
  }
}

export function serializeProduct(product) {
  if (!product) return null

  const category = product.category
  const categoryIsObject = category && typeof category === 'object' && (category._id || category.id)

  const media = [...(product.media || [])]
    .map(serializeMedia)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return {
    id: toId(product),
    category_id: categoryIsObject ? toId(category) : toId(category),
    category_name: categoryIsObject ? category.name || '' : '',
    category_slug: categoryIsObject ? category.slug || '' : '',
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    price: product.price ?? 0,
    discount_price: product.discountPrice ?? product.discount_price ?? null,
    material: product.material || '',
    dimensions: product.dimensions || '',
    availability_status: product.availabilityStatus || product.availability_status || 'in_stock',
    is_active: product.isActive ?? product.is_active ?? true,
    is_featured: product.isFeatured ?? product.is_featured ?? false,
    media,
    created_at: product.created_at || product.createdAt || null,
    updated_at: product.updated_at || product.updatedAt || null
  }
}

export function serializeInquiry(inquiry) {
  if (!inquiry) return null

  const product = inquiry.productDetails || inquiry.product
  const productIsObject = product && typeof product === 'object' && (product._id || product.id)

  return {
    id: toId(inquiry),
    product_id: productIsObject ? toId(product) : toId(product),
    product_name: productIsObject ? product.name || '' : '',
    product_slug: productIsObject ? product.slug || '' : '',
    product_price: productIsObject ? product.price ?? null : null,
    customer_name: inquiry.customerName || inquiry.customer_name || '',
    customer_phone: inquiry.customerPhone || inquiry.customer_phone || '',
    customer_email: inquiry.customerEmail || inquiry.customer_email || '',
    message: inquiry.message || '',
    status: inquiry.status || 'new',
    admin_notes: inquiry.adminNotes || inquiry.admin_notes || '',
    created_at: inquiry.created_at || inquiry.createdAt || null,
    updated_at: inquiry.updated_at || inquiry.updatedAt || null
  }
}

export function serializeSettings(settings) {
  if (!settings) return null

  return {
    business_name: settings.businessName || settings.business_name || '',
    logo_url: settings.logoUrl || settings.logo_url || '',
    logo_public_id: settings.logoPublicId || settings.logo_public_id || '',
    phone: settings.phone || '',
    whatsapp_number: settings.whatsappNumber || settings.whatsapp_number || '',
    email: settings.email || '',
    address: settings.address || '',
    about_text: settings.aboutText || settings.about_text || '',
    facebook_url: settings.facebookUrl || settings.facebook_url || '',
    instagram_url: settings.instagramUrl || settings.instagram_url || '',
    youtube_url: settings.youtubeUrl || settings.youtube_url || '',
    updated_at: settings.updated_at || settings.updatedAt || null
  }
}

export function serializeAdmin(admin) {
  if (!admin) return null

  return {
    id: toId(admin),
    name: admin.name || '',
    email: admin.email || ''
  }
}
