const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#faf7f2"/>
  <g fill="none" stroke="#a9784d" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M240 340v-80a40 40 0 0 1 40-40h240a40 40 0 0 1 40 40v80"/>
    <path d="M200 340h400v70H200z"/>
    <path d="M245 410v55"/>
    <path d="M555 410v55"/>
    <path d="M285 300h230"/>
  </g>
  <text x="400" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#7a5635">Image coming soon</text>
</svg>
`

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`

export function handleImageFallback(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = FALLBACK_IMAGE
}
