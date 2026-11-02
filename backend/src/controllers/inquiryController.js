import { createInquiry } from '../models/Inquiry.js'
import { getPublicBusinessSettings } from '../models/BusinessSettings.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { serializeInquiry } from '../models/serializers.js'

export const createInquiryPublic = asyncHandler(async (req, res) => {
  const { product_id, customer_name, customer_phone, customer_email, message } = req.body

  const inquiry = await createInquiry({
    product: product_id || null,
    customerName: customer_name,
    customerPhone: customer_phone,
    customerEmail: customer_email || null,
    message
  })

  const settings = await getPublicBusinessSettings()
  const serialized = serializeInquiry(inquiry)

  let whatsappUrl = null
  let phoneUrl = null

  if (settings?.whatsappNumber) {
    const productText = serialized.product_name
      ? `I'm interested in "${serialized.product_name}" (INR ${serialized.product_price})`
      : 'I have a general inquiry'
    const fullMessage = `${productText}\n\nName: ${customer_name}\nPhone: ${customer_phone}\nMessage: ${message}`
    whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`
  }

  if (settings?.phone) {
    phoneUrl = `tel:${settings.phone.replace(/\D/g, '')}`
  }

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully. We will contact you soon.',
    data: {
      inquiry: serialized,
      contact: {
        whatsapp_url: whatsappUrl,
        phone_url: phoneUrl,
        email: settings?.email || ''
      }
    }
  })
})
