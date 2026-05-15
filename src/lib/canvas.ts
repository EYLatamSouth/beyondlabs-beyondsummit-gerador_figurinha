import type { StampData, PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'
import { getCountryByCode, getCountryPalette } from '@/lib/countries'

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

// ── Template colour tinting ───────────────────────────────────────────────────
// Source colours in the BS template that identify the "Brasil" palette:
const SOURCE_GREEN:  [number, number, number] = [68,  152,  69]  // #449845
const SOURCE_YELLOW: [number, number, number] = [250, 230,  77]  // #FAE64D
const TINT_TOLERANCE = 35 // Euclidean RGB distance threshold

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

function colorDist(r: number, g: number, b: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2)
}

// Replaces the template's green/yellow pixels with the given country palette colours.
// Luminance-preserving: keeps the relative brightness of each pixel so shaded/lit
// edges (antialiasing against the teal background) map smoothly to the target hue.
function tintTemplate(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryHex: string,
  secondaryHex: string,
): void {
  const [pr, pg, pb]   = hexToRgb(primaryHex)
  const [sr, sg, sb]   = hexToRgb(secondaryHex)
  const [sgr, sgg, sgb] = SOURCE_GREEN
  const [syr, syg, syb] = SOURCE_YELLOW

  const srcLumGreen  = (sgr + sgg + sgb) / 3 || 1
  const srcLumYellow = (syr + syg + syb) / 3 || 1

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]

    const dg = colorDist(r, g, b, sgr, sgg, sgb)
    if (dg <= TINT_TOLERANCE) {
      const lum = (r + g + b) / 3
      const factor = lum / srcLumGreen
      data[i]     = Math.min(255, Math.round(pr * factor))
      data[i + 1] = Math.min(255, Math.round(pg * factor))
      data[i + 2] = Math.min(255, Math.round(pb * factor))
      continue
    }

    const dy = colorDist(r, g, b, syr, syg, syb)
    if (dy <= TINT_TOLERANCE) {
      const lum = (r + g + b) / 3
      const factor = lum / srcLumYellow
      data[i]     = Math.min(255, Math.round(sr * factor))
      data[i + 1] = Math.min(255, Math.round(sg * factor))
      data[i + 2] = Math.min(255, Math.round(sb * factor))
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// ── Layer composition ─────────────────────────────────────────────────────────
//
// Template pixel map (900 × 1200) — new teal BS FY26 layout:
//
//   ┌──────────────────────────────────────────────────────┐ y=0
//   │  teal full-card background                           │
//   │  "BEYOND SUMMIT" branding + trophy (top area)        │
//   ├──────────────────────────────────────────────────────┤ y≈80
//   │  user photo zone (full width)                        │
//   │  clip ends at y=1030 — photo extends under the cards │
//   │  transparent pixels reveal the template behind       │
//   │                                                      │
//   │  [ FLAG  ] white rounded card — bottom-right         │ x≈595, y≈830, w≈280, h≈215
//   │  [ CODE  ] e.g. "BRA", centered below flag           │ drawn over photo
//   │                                                      │
//   │  white rounded card — bottom-left                    │ x≈25,  y≈1000, w≈550, h≈175
//   │  NOME AQUI  (bold black 80–90px)                     │ drawn over photo
//   │  Área de Atuação  (regular black ~40px)              │
//   └──────────────────────────────────────────────────────┘ y=1200

export async function composeLayers(
  canvas: HTMLCanvasElement,
  stampData: StampData,
  photoUrl: string,
  photoTransform: PhotoTransform = DEFAULT_PHOTO_TRANSFORM,
  isRare = false,
  namePlaceholder = 'NOME AQUI',
): Promise<void> {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Could not get 2D context')

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  await Promise.allSettled([
    document.fonts.load('800 70px "Barlow Condensed"'),
    document.fonts.load('700 34px "Barlow Condensed"'),
  ])

  // Photo area constants. Adjust PHOTO_PADDING_X to control how far the photo
  // stays from the left/right borders of the sticker (symmetric). 0 = full width.
  const PHOTO_PADDING_X = 45  // ← tweak this to test: try 0, 20, 40, 60…
  const PHOTO_X = PHOTO_PADDING_X
  const PHOTO_Y = 80
  const PHOTO_W = CANVAS_WIDTH - PHOTO_PADDING_X * 2
  const PHOTO_H = 930  // clip ends at y=1010; flag card starts at y=830, name card at y=1000

  // ── Step 1: Template background ───────────────────────────────────────────
  // Drawn first. The user photo (background-removed by @imgly) composites on top —
  // transparent photo pixels naturally reveal the teal template and BS branding.
  // Rare stickers use figurinha-bg-rara.png instead of the standard template.
  const templateSrc = isRare ? '/template/figurinha-bg-rara.png' : '/template/figurinha-bg.png'
  let templateImg: HTMLImageElement | null = null
  try {
    templateImg = await loadImage(templateSrc)
    ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  } catch {
    console.error(`[canvas] Template not found — check public/template/${isRare ? 'figurinha-bg-rara.png' : 'figurinha-bg.png'}`)
    ctx.fillStyle = isRare ? '#C9A84C' : '#0D7B73'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  // ── Step 1b: Country colour tinting ──────────────────────────────────────
  // Replaces the template's green/yellow BS silhouette colours with the two
  // primary colours of the selected country's flag. Brasil is a no-op.
  const [palettePrimary, paletteSecondary] = getCountryPalette(stampData.countryCode)
  tintTemplate(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, palettePrimary, paletteSecondary)

  // ── Step 2: User photo (background already removed by @imgly) ───────────────
  // Drawn on top of the template via an offscreen canvas so we can erase the
  // logo zones before compositing — this lets the template logos show through.
  try {
    const photo = await loadImage(photoUrl)
    const baseScale = Math.max(PHOTO_W / photo.naturalWidth, PHOTO_H / photo.naturalHeight)
    const effectiveScale = baseScale * photoTransform.scale
    const dw = photo.naturalWidth * effectiveScale
    const dh = photo.naturalHeight * effectiveScale

    const zoneCenterX = PHOTO_X + PHOTO_W / 2
    const zoneCenterY = PHOTO_Y + PHOTO_H / 2

    const dx = zoneCenterX - dw / 2 + photoTransform.offsetX
    const dy = zoneCenterY - dh / 2 + photoTransform.offsetY

    // Draw photo to offscreen first so we can punch logo-shaped holes before
    // compositing onto the main canvas (which already has the template).
    const photoOff = document.createElement('canvas')
    photoOff.width = CANVAS_WIDTH
    photoOff.height = CANVAS_HEIGHT
    const photoOffCtx = photoOff.getContext('2d')
    if (photoOffCtx) {
      photoOffCtx.save()
      photoOffCtx.beginPath()
      photoOffCtx.rect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H)
      photoOffCtx.clip()
      photoOffCtx.drawImage(photo, dx, dy, dw, dh)
      photoOffCtx.restore()

      // ── Erase logo zones so the template shows through ──────────────────
      // destination-out punches transparent holes in the photo where the logos are.
      // The template (already drawn on the main canvas) shows through those holes.
      //
      // Template is 900 × 1200 px — tune these bounding boxes to tightly wrap
      // each logo. Only the area WITHIN the photo zone (y ≥ PHOTO_Y) needs
      // erasing; everything above is already visible on the template.
      //
      // Left logo  — "BEYOND SUMMIT INNOVATION CUP" text
      const LEFT_LOGO_X = 45,  LEFT_LOGO_Y = 18,  LEFT_LOGO_W = 235, LEFT_LOGO_H = 95
      // Right logo — BS26 trophy + circle "B"
      const RIGHT_LOGO_X = 720, RIGHT_LOGO_Y = 20, RIGHT_LOGO_W = 360, RIGHT_LOGO_H = 255

      photoOffCtx.globalCompositeOperation = 'destination-out'
      photoOffCtx.fillStyle = 'rgba(0,0,0,1)'
      photoOffCtx.fillRect(LEFT_LOGO_X,  LEFT_LOGO_Y,  LEFT_LOGO_W,  LEFT_LOGO_H)
      photoOffCtx.fillRect(RIGHT_LOGO_X, RIGHT_LOGO_Y, RIGHT_LOGO_W, RIGHT_LOGO_H)
      photoOffCtx.globalCompositeOperation = 'source-over'

      ctx.drawImage(photoOff, 0, 0)
    }
  } catch {
    console.error('[canvas] Failed to draw user photo')
  }

  // ── Step 3: Flag card — vertical layout, bottom-right ────────────────────
  // White rounded card with flag image on top and country code centered below.
  // Starts just at the photo zone bottom (y=830) to overlap slightly, as per design.
  const FLAG_CARD_X = 675
  const FLAG_CARD_Y = 815
  const FLAG_CARD_W = 180
  const FLAG_CARD_H = 175
  const FLAG_CARD_R = 10

  const FLAG_IMG_W = 80
  const FLAG_IMG_H = Math.round(FLAG_IMG_W * (2 / 3))  // 80 — 3:2 ratio
  const FLAG_IMG_X = FLAG_CARD_X + Math.round((FLAG_CARD_W - FLAG_IMG_W) / 2)
  const FLAG_IMG_Y = FLAG_CARD_Y + 24

  const CODE_FONT_SIZE = 72
  const CODE_X = FLAG_CARD_X + FLAG_CARD_W / 2
  const CODE_Y = FLAG_IMG_Y + FLAG_IMG_H + 14 + Math.round(CODE_FONT_SIZE * 0.75)

  const country = getCountryByCode(stampData.countryCode)
  const codeDisplay = country?.codeDisplay ?? '— —'

  // White rounded card
  fillRoundedRect(ctx, FLAG_CARD_X, FLAG_CARD_Y, FLAG_CARD_W, FLAG_CARD_H, FLAG_CARD_R, '#FFFFFF')

  if (country) {
    const flagImg = await loadFlagSvg(stampData.countryCode)
    if (flagImg) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(FLAG_IMG_X, FLAG_IMG_Y, FLAG_IMG_W, FLAG_IMG_H, 4)
      ctx.clip()
      ctx.drawImage(flagImg, FLAG_IMG_X, FLAG_IMG_Y, FLAG_IMG_W, FLAG_IMG_H)
      ctx.restore()
    } else {
      // Emoji fallback centered in the flag slot
      ctx.save()
      ctx.font = '52px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        country.code.toUpperCase().replace(/./g, (c) =>
          String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)),
        ),
        FLAG_IMG_X + FLAG_IMG_W / 2,
        FLAG_IMG_Y + FLAG_IMG_H / 2,
      )
      ctx.restore()
    }

    // Country code (e.g. "BRA") — centered below the flag image
    drawText(ctx, country.codeDisplay, CODE_X, CODE_Y, {
      font: `800 ${CODE_FONT_SIZE}px "Barlow Condensed", sans-serif`,
      color: '#111111',
      align: 'center',
      baseline: 'alphabetic',
    })
  } else {
    // No country selected — placeholder centered in card
    drawText(ctx, codeDisplay, FLAG_CARD_X + FLAG_CARD_W / 2, FLAG_CARD_Y + FLAG_CARD_H / 2, {
      font: '700 32px "Barlow Condensed", sans-serif',
      color: '#9CA3AF',
      align: 'center',
      baseline: 'middle',
    })
  }

  // ── Step 4: Name + role/area text on the bottom-left white card ──────────
  // Card dimensions are fixed. Font sizes shrink to fit inside the card.
  const NAME_CARD_X = 59
  const NAME_CARD_Y = 1015
  const NAME_CARD_W = 652   // stays clear of the flag card (starts at x≈675)
  const NAME_CARD_H = 112
  const NAME_CARD_R = 20
  const NAME_LEFT = NAME_CARD_X + 20
  const NAME_MAX_W = NAME_CARD_W - 40

  fillRoundedRect(ctx, NAME_CARD_X, NAME_CARD_Y, NAME_CARD_W, NAME_CARD_H, NAME_CARD_R, '#ffffff')

  // ── Name — top line, baseline at card y+60 ────────────────────────────────
  const nameText = stampData.name.trim() ? stampData.name.toUpperCase() : namePlaceholder

  const nameFontSize = shrinkFontToFit(
    ctx,
    nameText,
    NAME_MAX_W,
    (s) => `800 ${s}px "Barlow Condensed", sans-serif`,
    58,
    20,
  )

  drawText(ctx, nameText, NAME_LEFT, NAME_CARD_Y + 60, {
    font: `800 ${nameFontSize}px "Barlow Condensed", sans-serif`,
    color: stampData.name.trim() ? '#111111' : '#CCCCCC',
    align: 'left',
    maxWidth: NAME_MAX_W,
  })

  // ── Role | Área — second line, baseline at card y+98 ──────────────────────
  const rolePart = stampData.role.trim()
  const roleAreaText = rolePart || 'Posição'
  const roleAreaColor = rolePart ? '#000000' : '#BBBBBB'

  const roleAreaFontSize = shrinkFontToFit(
    ctx,
    roleAreaText,
    NAME_MAX_W,
    (s) => `700 ${s}px "Barlow Condensed", sans-serif`,
    30,
    14,
  )

  drawText(ctx, roleAreaText, NAME_LEFT, NAME_CARD_Y + 98, {
    font: `700 ${roleAreaFontSize}px "Barlow Condensed", sans-serif`,
    color: roleAreaColor,
    align: 'left',
    maxWidth: NAME_MAX_W,
  })
}
