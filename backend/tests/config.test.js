import { describe, it, expect } from 'vitest'
import { config } from '../src/config/index.js'

describe('upload configuration', () => {
  it('accepts the video formats supported by the admin product form', () => {
    expect(config.upload.allowedVideoTypes).toEqual(
      expect.arrayContaining(['video/mp4', 'video/webm', 'video/quicktime'])
    )
    expect(config.upload.allowedVideoTypes).not.toContain('video/webp')
  })

  it('accepts the image formats supported by the admin product form', () => {
    expect(config.upload.allowedImageTypes).toEqual(
      expect.arrayContaining(['image/jpeg', 'image/png', 'image/webp'])
    )
  })
})
