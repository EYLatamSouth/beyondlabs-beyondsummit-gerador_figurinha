import type { StampData } from '@/types/stamp'
import { getCountryByCode, getFlagEmoji } from '@/lib/countries'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 1200

// ── Image loading ─────────────────────────────────────────────────────────────

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const timeout = setTimeout(
      () => reject(new Error(`Timeout loading: ${src}`)),
      5000,
    )
    img.onload = () => {
      clearTimeout(timeout)
      resolve(img)
    }
    img.onerror = () => {
      clearTimeout(timeout)
      reject(new Error(`Failed to load: ${src}`))
    }
    img.src = src
  })
}

// ── Export ────────────────────────────────────────────────────────────────────

export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ── Text helpers ──────────────────────────────────────────────────────────────

interface DrawTextOptions {
  font: string
  color: string
  align: CanvasTextAlign
  baseline?: CanvasTextBaseline
  maxWidth?: number
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: DrawTextOptions,
): void {
  ctx.font = options.font
  ctx.fillStyle = options.color
  ctx.textAlign = options.align
  ctx.textBaseline = options.baseline ?? 'alphabetic'
  if (options.maxWidth !== undefined) {
    ctx.fillText(text, x, y, options.maxWidth)
  } else {
    ctx.fillText(text, x, y)
  }
}

function shrinkFontToFit(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontTemplate: (size: number) => string,
  initialSize: number,
  minSize: number,
): number {
  let size = initialSize
  ctx.font = fontTemplate(size)
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 1
    ctx.font = fontTemplate(size)
  }
  return size
}

// ── Rounded rect (compatible with all browsers) ───────────────────────────────

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
): void {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

// ── Layer composition ─────────────────────────────────────────────────────────

export async function composeLayers(
  canvas: HTMLCanvasElement,
  stampData: StampData,
  photoUrl: string,
): Promise<void> {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context')

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Ensure display fonts are loaded before drawing text
  await Promise.allSettled([
    document.fonts.load('800 72px "Barlow Condensed"'),
    document.fonts.load('700 36px "Barlow Condensed"'),
  ])

  // ── Layer 1: Background template ──────────────────────────────────────────
  try {
    const bg = await loadImage('/template/figurinha-bg.png')
    ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  } catch {
    // Fallback: solid green background with subtle BS lettering
    ctx.fillStyle = '#1A5C2A'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.font = '800 380px "Barlow Condensed", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('BS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
    ctx.textBaseline = 'alphabetic'

    // Decorative gold top bar
    ctx.fillStyle = '#C9A84C'
    ctx.fillRect(0, 0, CANVAS_WIDTH, 8)
  }

  // ── Layer 2: User photo ────────────────────────────────────────────────────
  // Positioned to align with the silhouette area on the template
  const photoX = 162
  const photoY = 216
  const photoW = 558
  const photoH = 620

  try {
    const photo = await loadImage(photoUrl)
    const scale = Math.max(photoW / photo.naturalWidth, photoH / photo.naturalHeight)
    const dw = photo.naturalWidth * scale
    const dh = photo.naturalHeight * scale
    const dx = photoX + (photoW - dw) / 2
    const dy = photoY + (photoH - dh) / 2

    ctx.save()
    ctx.beginPath()
    ctx.rect(photoX, photoY, photoW, photoH)
    ctx.clip()
    ctx.drawImage(photo, dx, dy, dw, dh)
    ctx.restore()
  } catch {
    // Skip if photo unavailable (shouldn't happen in practice)
    console.error('[canvas] Failed to draw user photo')
  }

  // ── Layer 3: Overlay template ──────────────────────────────────────────────
  try {
    const overlay = await loadImage('/template/figurinha-overlay.png')
    ctx.drawImage(overlay, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  } catch {
    // Fallback: draw minimal overlay elements so the layout is readable
    // Top band
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, 0, CANVAS_WIDTH, 220)

    // Event name text
    drawText(ctx, 'BEYOND SUMMIT', 495, 60, {
      font: '700 36px "Barlow Condensed", sans-serif',
      color: '#FFFFFF',
      align: 'left',
    })
    drawText(ctx, 'INNOVATION CUP', 495, 100, {
      font: '500 24px "DM Sans", sans-serif',
      color: '#C9A84C',
      align: 'left',
    })

    // Bottom band
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, CANVAS_HEIGHT - 230, CANVAS_WIDTH, 230)
  }

  // ── Layer 4: Country flag ──────────────────────────────────────────────────
  const flagX = 468
  const flagY = 90
  const flagW = 120
  const flagH = 90

  try {
    const flag = await loadImage(`/flags/${stampData.countryCode}.svg`)
    ctx.drawImage(flag, flagX, flagY, flagW, flagH)
  } catch {
    // Fallback: draw emoji flag
    const emoji = getFlagEmoji(stampData.countryCode)
    ctx.font = `72px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(emoji, flagX, flagY)
    ctx.textBaseline = 'alphabetic'
  }

  // ── Layer 5: Country code (e.g. "BRA") ────────────────────────────────────
  const country = getCountryByCode(stampData.countryCode)
  if (country) {
    drawText(ctx, country.codeDisplay, flagX + flagW / 2, flagY + flagH + 48, {
      font: '800 40px "Barlow Condensed", sans-serif',
      color: '#FFFFFF',
      align: 'center',
    })
  }

  // ── Layer 6: NAME ─────────────────────────────────────────────────────────
  const nameText = stampData.name.toUpperCase()
  const nameMaxWidth = 810
  const nameBaseSize = 72

  shrinkFontToFit(
    ctx,
    nameText,
    nameMaxWidth,
    (s) => `800 ${s}px "Barlow Condensed", sans-serif`,
    nameBaseSize,
    32,
  )

  drawText(ctx, nameText, 45, 1040, {
    font: ctx.font,
    color: '#FFFFFF',
    align: 'left',
    maxWidth: nameMaxWidth,
  })

  // ── Layer 7: ROLE | AREA tag ───────────────────────────────────────────────
  const tagX = 45
  const tagY = 1070
  const tagW = 810
  const tagH = 72

  fillRoundedRect(ctx, tagX, tagY, tagW, tagH, 6, '#3D9A52')

  const tagText = `${stampData.role.toUpperCase()} | ${stampData.area.toUpperCase()}`
  const tagMaxWidth = tagW - 40

  shrinkFontToFit(
    ctx,
    tagText,
    tagMaxWidth,
    (s) => `700 ${s}px "Barlow Condensed", sans-serif`,
    34,
    16,
  )

  drawText(ctx, tagText, tagX + 20, tagY + tagH / 2 + 12, {
    font: ctx.font,
    color: '#FFFFFF',
    align: 'left',
    maxWidth: tagMaxWidth,
  })
}
