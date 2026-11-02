import { describe, it, expect } from 'vitest'
import {
  serializeMedia,
  serializeCategory,
  serializeProduct,
  serializeInquiry,
  serializeSettings,
  serializeAdmin
} from '../src/models/serializers.js'

describe('serializers', () => {
  it('serializes media from camelCase and snake_case fields', () => {
    expect(serializeMedia({
      _id: 'media-1',
      mediaType: 'video',
      mediaUrl: 'https://cdn.example/video.mp4',
      publicId: 'carpenter/video',
      altText: 'A bed',
      sortOrder: 2
    })).toMatchObject({
      id: 'media-1',
      media_type: 'video',
      media_url: 'https://cdn.example/video.mp4',
      public_id: 'carpenter/video',
      alt_text: 'A bed',
      sort_order: 2
    })

    expect(serializeMedia({
      id: 'media-2',
      media_type: 'image',
      media_url: 'https://cdn.example/image.jpg'
    })).toMatchObject({
      id: 'media-2',
      media_type: 'image',
      media_url: 'https://cdn.example/image.jpg'
    })
  })

  it('serializes products and sorts media by sort order', () => {
    const product = serializeProduct({
      _id: 'product-1',
      name: 'Teak Bed',
      slug: 'teak-bed',
      price: 42000,
      discountPrice: 39000,
      availabilityStatus: 'in_stock',
      isActive: true,
      isFeatured: true,
      category: { _id: 'category-1', name: 'Beds', slug: 'beds' },
      media: [
        { id: 'm2', mediaUrl: 'https://cdn.example/2.jpg', sortOrder: 2 },
        { id: 'm1', mediaUrl: 'https://cdn.example/1.jpg', sortOrder: 1 }
      ]
    })

    expect(product).toMatchObject({
      id: 'product-1',
      category_id: 'category-1',
      category_name: 'Beds',
      category_slug: 'beds',
      name: 'Teak Bed',
      price: 42000,
      discount_price: 39000,
      is_active: true,
      is_featured: true
    })
    expect(product.media.map(item => item.id)).toEqual(['m1', 'm2'])
  })

  it('derives category product counts and handles missing categories', () => {
    expect(serializeCategory({
      _id: 'category-1',
      name: 'Chairs',
      slug: 'chairs',
      products: ['p1', 'p2', 'p3']
    }).product_count).toBe(3)

    expect(serializeCategory({ _id: 'c2', name: 'Tables', productCount: 7 }).product_count).toBe(7)

    expect(serializeProduct({ _id: 'p1', name: 'Loose chair' })).toMatchObject({
      category_id: null,
      category_name: '',
      category_slug: ''
    })
  })

  it('serializes inquiries and settings aliases', () => {
    expect(serializeInquiry({
      _id: 'inquiry-1',
      customerName: 'Asha',
      customerPhone: '9999999999',
      customerEmail: 'asha@example.com',
      message: 'Interested',
      status: 'contacted',
      adminNotes: 'Called',
      product: { _id: 'p1', name: 'Sofa', slug: 'sofa', price: 1000 }
    })).toMatchObject({
      id: 'inquiry-1',
      product_id: 'p1',
      product_name: 'Sofa',
      product_slug: 'sofa',
      product_price: 1000,
      customer_name: 'Asha',
      customer_phone: '9999999999',
      admin_notes: 'Called'
    })

    expect(serializeSettings({
      businessName: 'Wood Works',
      whatsappNumber: '9999999999',
      aboutText: 'Handcrafted'
    })).toMatchObject({
      business_name: 'Wood Works',
      whatsapp_number: '9999999999',
      about_text: 'Handcrafted'
    })
  })

  it('never exposes an admin password hash', () => {
    const admin = serializeAdmin({
      _id: 'admin-1',
      name: 'Owner',
      email: 'owner@example.com',
      passwordHash: 'secret-hash'
    })

    expect(admin).toEqual({
      id: 'admin-1',
      name: 'Owner',
      email: 'owner@example.com'
    })
    expect(admin).not.toHaveProperty('passwordHash')
  })
})
