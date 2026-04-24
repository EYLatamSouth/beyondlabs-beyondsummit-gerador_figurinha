import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import { getCountryByCode } from '@/lib/countries'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 1200

// ── Image loading ─────────────────────────────────────────────────────────────

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const timeout = setTimeout(
      () => reject(new Error(`Timeout loading: ${src}`)),
      8000,
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
    size -= 2
    ctx.font = fontTemplate(size)
  }
  return size
}

// ── Rounded rect ──────────────────────────────────────────────────────────────

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

// ── Load flag SVG from country-flag-icons package ─────────────────────────────

async function loadFlagSvg(countryCode: string): Promise<HTMLImageElement | null> {
  try {
    const mod = await import('country-flag-icons/string/3x2') as Record<string, string>
    const svg: string | undefined = mod[countryCode.toUpperCase()]
    if (!svg) return null
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    return loadImage(dataUrl)
  } catch {
    return null
  }
}

// ── Layer composition ─────────────────────────────────────────────────────────
//
// Template pixel map (900 × 1200):
//
//   ┌──────────────────────────────────────────────────────┐ y=0
//   │  dark green band (#1A5C2A)                           │
//   │  BS logo (left)   │  "BEYOND SUMMIT" (top-right)     │
//   │                   │  [ FLAG | CODE ] white box       │ y≈130–230
//   ├──────────────────────────────────────────────────────┤ y≈235
//   │  lighter green background + white person silhouette  │
//   │  (user photo drawn on top here — full width)         │
//   │                                                      │
//   ├──────────────────────────────────────────────────────┤ y≈990
//   │  white area: NOME AQUI (bold black ~96px)            │ y≈1060–1130
//   │  [CARGO] [ÁREA]  green tag boxes (~44px)             │ y≈1145–1189
//   └──────────────────────────────────────────────────────┘ y=1200

export async function composeLayers(
  canvas: HTMLCanvasElement,
  stampData: StampData,
  photoUrl: string,
  photoTransform: PhotoTransform = DEFAULT_PHOTO_TRANSFORM,
): Promise<void> {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context')

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  await Promise.allSettled([
    document.fonts.load('800 96px "Barlow Condensed"'),
    document.fonts.load('700 44px "Barlow Condensed"'),
  ])

  // Photo area constants — full canvas width, from header bottom to text area top
  const PHOTO_X = 0
  const PHOTO_Y = 235
  const PHOTO_W = CANVAS_WIDTH
  const PHOTO_H = 755  // ends at y=990, before the white bottom section

  // ── Step 1: Template background ───────────────────────────────────────────
  // Drawn first as background. The user photo (already background-removed by @imgly)
  // is composited on top, so no multiply trick is needed — transparent photo pixels
  // naturally reveal the green/BS-letter template behind the person.
  try {
    const template = await loadImage('/template/figurinha-template.webp')
    ctx.drawImage(template, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  } catch {
    console.error('[canvas] Template not found — check public/template/figurinha-template.webp')
    // Minimal fallback background
    ctx.fillStyle = '#3D9A52'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillStyle = '#1A5C2A'
    ctx.fillRect(0, 0, CANVAS_WIDTH, PHOTO_Y)
  }

  // ── Step 2: Flag + country code (overwrite template's Brazil placeholder) ──
  // Layout constants
  const FLAG_BOX_Y = 130
  const FLAG_BOX_H = 100
  const FLAG_BOX_R = 14
  const FLAG_INNER_PAD = 18   // left/right inner padding
  const FLAG_IMG_W = 96
  const FLAG_IMG_H = Math.round(FLAG_IMG_W * (2 / 3))  // 64 — 3:2 ratio
  const FLAG_TEXT_GAP = 18    // gap between flag and code text
  const CODE_FONT_SIZE = 72

  const country = getCountryByCode(stampData.countryCode)
  const codeDisplay = country?.codeDisplay ?? '— —'

  // Measure text width so the box is sized exactly to its content
  ctx.font = `800 ${CODE_FONT_SIZE}px "Barlow Condensed", sans-serif`
  const codeTextW = ctx.measureText(codeDisplay).width

  // Box width = left_pad + flag + gap + code_text + right_pad (no excess space)
  const FLAG_BOX_W = Math.ceil(FLAG_INNER_PAD + FLAG_IMG_W + FLAG_TEXT_GAP + codeTextW + FLAG_INNER_PAD)
  // Right-align to x=875 (the template placeholder's right edge)
  const FLAG_BOX_X = 875 - FLAG_BOX_W

  // White rounded box — tight fit around content
  fillRoundedRect(ctx, FLAG_BOX_X, FLAG_BOX_Y, FLAG_BOX_W, FLAG_BOX_H, FLAG_BOX_R, '#FFFFFF')

  const FLAG_IMG_X = FLAG_BOX_X + FLAG_INNER_PAD
  const FLAG_IMG_Y = FLAG_BOX_Y + Math.round((FLAG_BOX_H - FLAG_IMG_H) / 2)

  if (country) {
    // Try SVG from country-flag-icons, then emoji fallback
    const flagImg = await loadFlagSvg(stampData.countryCode)
    if (flagImg) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(FLAG_IMG_X, FLAG_IMG_Y, FLAG_IMG_W, FLAG_IMG_H, 4)
      ctx.clip()
      ctx.drawImage(flagImg, FLAG_IMG_X, FLAG_IMG_Y, FLAG_IMG_W, FLAG_IMG_H)
      ctx.restore()
    } else {
      // Emoji fallback
      ctx.save()
      ctx.font = '52px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        country.code.toUpperCase().replace(/./g, (c) =>
          String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)),
        ),
        FLAG_IMG_X,
        FLAG_IMG_Y + FLAG_IMG_H / 2,
      )
      ctx.restore()
    }

    // Country code (e.g. "BRA") — fixed 72px, right of flag
    const CODE_X = FLAG_IMG_X + FLAG_IMG_W + FLAG_TEXT_GAP
    const CODE_Y = FLAG_BOX_Y + FLAG_BOX_H / 2
    drawText(ctx, country.codeDisplay, CODE_X, CODE_Y, {
      font: `800 ${CODE_FONT_SIZE}px "Barlow Condensed", sans-serif`,
      color: '#111111',
      align: 'left',
      baseline: 'middle',
    })
  } else {
    // No country selected — placeholder centered in box
    drawText(ctx, codeDisplay, FLAG_BOX_X + FLAG_BOX_W / 2, FLAG_BOX_Y + FLAG_BOX_H / 2, {
      font: '700 32px "Barlow Condensed", sans-serif',
      color: '#9CA3AF',
      align: 'center',
      baseline: 'middle',
    })
  }

  // ── Step 3: User photo (background already removed by @imgly) ───────────────
  // Drawn on top of the template with normal blend. The transparent areas of the
  // photo naturally reveal the green template and "BS" letter silhouette behind
  // the person — no multiply trick needed.
  try {
    const photo = await loadImage(photoUrl)
    // Base cover-scale fills the photo zone. photoTransform.scale multiplies on top.
    // The photo is anchored to the CENTER of the photo zone, matching the editor's
    // coordinate system exactly. offsetX/offsetY are canvas-px deltas from that center.
    const baseScale = Math.max(PHOTO_W / photo.naturalWidth, PHOTO_H / photo.naturalHeight)
    const effectiveScale = baseScale * photoTransform.scale
    const dw = photo.naturalWidth * effectiveScale
    const dh = photo.naturalHeight * effectiveScale

    const zoneCenterX = PHOTO_X + PHOTO_W / 2   // 450
    const zoneCenterY = PHOTO_Y + PHOTO_H / 2   // 612.5

    const dx = zoneCenterX - dw / 2 + photoTransform.offsetX
    const dy = zoneCenterY - dh / 2 + photoTransform.offsetY

    ctx.save()
    ctx.beginPath()
    ctx.rect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H)
    ctx.clip()
    ctx.drawImage(photo, dx, dy, dw, dh)
    ctx.restore()
  } catch {
    console.error('[canvas] Failed to draw user photo')
  }

  // ── Step 4: Bottom text area (cover template's "NOME AQUI" / "CARGO" / "ÁREA") ─
  // Template placeholder text starts ~y=990; cover from there to bottom.
  const BOTTOM_Y = 990
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, BOTTOM_Y, CANVAS_WIDTH, CANVAS_HEIGHT - BOTTOM_Y)

  // ── Name ──────────────────────────────────────────────────────────────────
  const nameText = stampData.name.trim() ? stampData.name.toUpperCase() : 'NOME AQUI'
  const NAME_LEFT = 37
  const NAME_MAX_W = CANVAS_WIDTH - NAME_LEFT * 2

  const nameFontSize = shrinkFontToFit(
    ctx,
    nameText,
    NAME_MAX_W,
    (s) => `800 ${s}px "Barlow Condensed", sans-serif`,
    96,
    36,
  )

  // Name baseline: ~85px into the white section (visually top-aligned with padding)
  drawText(ctx, nameText, NAME_LEFT, BOTTOM_Y + 85, {
    font: `800 ${nameFontSize}px "Barlow Condensed", sans-serif`,
    color: stampData.name.trim() ? '#111111' : '#CCCCCC',
    align: 'left',
    maxWidth: NAME_MAX_W,
  })

  // ── CARGO and ÁREA — two separate green boxes ─────────────────────────────
  const TAG_Y = BOTTOM_Y + 112
  const TAG_H = 44
  const TAG_FONT = '700 26px "Barlow Condensed", sans-serif'
  const TAG_BG = '#3D9A52'
  const TAG_PAD_X = 16

  ctx.font = TAG_FONT

  const cargoText = stampData.role.trim() ? stampData.role.toUpperCase() : 'CARGO'
  const areaText = stampData.area.trim() ? stampData.area.toUpperCase() : 'ÁREA'

  const cargoW = Math.max(ctx.measureText(cargoText).width + TAG_PAD_X * 2, 90)
  const areaW = Math.max(ctx.measureText(areaText).width + TAG_PAD_X * 2, 90)

  fillRoundedRect(ctx, NAME_LEFT, TAG_Y, cargoW, TAG_H, 5, TAG_BG)
  drawText(ctx, cargoText, NAME_LEFT + TAG_PAD_X, TAG_Y + TAG_H / 2, {
    font: TAG_FONT,
    color: '#FFFFFF',
    align: 'left',
    baseline: 'middle',
  })

  const areaX = NAME_LEFT + cargoW + 10
  fillRoundedRect(ctx, areaX, TAG_Y, areaW, TAG_H, 5, TAG_BG)
  drawText(ctx, areaText, areaX + TAG_PAD_X, TAG_Y + TAG_H / 2, {
    font: TAG_FONT,
    color: '#FFFFFF',
    align: 'left',
    baseline: 'middle',
  })
}