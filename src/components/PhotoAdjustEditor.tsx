import { useState, useRef, useCallback, useEffect } from 'react'
import { Move, ZoomIn, ZoomOut, Check, SkipForward } from 'lucide-react'
import type { PhotoTransform } from '@/types/stamp'
import { DEFAULT_PHOTO_TRANSFORM } from '@/types/stamp'

// Canvas dimensions — must match canvas.ts constants
const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 1200
const PHOTO_ZONE_Y = 80        // y where the photo area starts in canvas space
const PHOTO_ZONE_H = 950       // height of the photo area in canvas space

interface PhotoAdjustEditorProps {
  photoUrl: string
  onConfirm: (transform: PhotoTransform) => void
  onSkip: () => void
}

interface DragState {
  active: boolean
  startX: number
  startY: number
  startOffsetX: number
  startOffsetY: number
}

interface PinchState {
  active: boolean
  initialDistance: number
  initialScale: number
}

const MIN_SCALE = 0.4
const MAX_SCALE = 3.0
const SCALE_STEP = 0.1

export function PhotoAdjustEditor({ photoUrl, onConfirm, onSkip }: PhotoAdjustEditorProps) {
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_PHOTO_TRANSFORM)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<DragState>({ active: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 })
  const pinchRef = useRef<PinchState>({ active: false, initialDistance: 0, initialScale: 1 })

  // How many CSS px correspond to 1 canvas px (updated on resize)
  const displayRatioRef = useRef(1)

  useEffect(() => {
    function updateRatio() {
      if (containerRef.current) {
        displayRatioRef.current = containerRef.current.offsetWidth / CANVAS_WIDTH
      }
    }
    updateRatio()
    const ro = new ResizeObserver(updateRatio)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // ── Computed photo display metrics ─────────────────────────────────────────
  // Returns the photo's natural cover-scale size and base-centered position
  // in CSS px relative to the container top-left, so we can position the <img>.
  const getPhotoDisplayMetrics = useCallback((naturalW: number, naturalH: number, scale: number) => {
    const ratio = displayRatioRef.current
    const zoneW = CANVAS_WIDTH   // canvas px
    const zoneH = PHOTO_ZONE_H   // canvas px
    const baseScale = Math.max(zoneW / naturalW, zoneH / naturalH)
    const effectiveScale = baseScale * scale

    const displayW = naturalW * effectiveScale * ratio
    const displayH = naturalH * effectiveScale * ratio

    // Center of photo zone in CSS px from container top
    const zoneCenterX = (CANVAS_WIDTH / 2) * ratio
    const zoneCenterY = (PHOTO_ZONE_Y + PHOTO_ZONE_H / 2) * ratio

    return { displayW, displayH, zoneCenterX, zoneCenterY, baseScale }
  }, [])

  // ── Drag (mouse) ────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: transform.offsetX,
      startOffsetY: transform.offsetY,
    }
  }, [transform.offsetX, transform.offsetY])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.active) return
    const ratio = displayRatioRef.current
    const dx = (e.clientX - dragRef.current.startX) / ratio
    const dy = (e.clientY - dragRef.current.startY) / ratio
    setTransform((prev) => ({
      ...prev,
      offsetX: dragRef.current.startOffsetX + dx,
      offsetY: dragRef.current.startOffsetY + dy,
    }))
  }, [])

  const handleMouseUp = useCallback(() => {
    dragRef.current.active = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // ── Drag (touch / pinch) ────────────────────────────────────────────────────
  const getTouchDistance = (touches: { [index: number]: { clientX: number; clientY: number } }) =>
    Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        active: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startOffsetX: transform.offsetX,
        startOffsetY: transform.offsetY,
      }
      pinchRef.current.active = false
    } else if (e.touches.length === 2) {
      dragRef.current.active = false
      pinchRef.current = {
        active: true,
        initialDistance: getTouchDistance(e.touches),
        initialScale: transform.scale,
      }
    }
  }, [transform.offsetX, transform.offsetY, transform.scale])

  const handleTouchEnd = useCallback(() => {
    dragRef.current.active = false
    pinchRef.current.active = false
  }, [])

  // touchmove and wheel must be non-passive to allow preventDefault() —
  // React JSX handlers are passive by default in modern browsers, so we
  // attach them directly to the DOM element via useEffect.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const ratio = displayRatioRef.current
      if (e.touches.length === 1 && dragRef.current.active) {
        const dx = (e.touches[0].clientX - dragRef.current.startX) / ratio
        const dy = (e.touches[0].clientY - dragRef.current.startY) / ratio
        setTransform((prev) => ({
          ...prev,
          offsetX: dragRef.current.startOffsetX + dx,
          offsetY: dragRef.current.startOffsetY + dy,
        }))
      } else if (e.touches.length === 2 && pinchRef.current.active) {
        const dist = getTouchDistance(e.touches)
        const rawScale = pinchRef.current.initialScale * (dist / pinchRef.current.initialDistance)
        setTransform((prev) => ({
          ...prev,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, rawScale)),
        }))
      }
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)),
      }))
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  // ── Button zoom ─────────────────────────────────────────────────────────────
  function zoomBy(delta: number) {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)),
    }))
  }

  // ── Photo img style ─────────────────────────────────────────────────────────
  // We position the <img> absolutely within the container.
  // The img is centered at zoneCenterX + offsetX, zoneCenterY + offsetY.
  function getImgStyle(): React.CSSProperties {
    const img = imgRef.current
    if (!img || !img.naturalWidth) return { display: 'none' }

    const { displayW, displayH, zoneCenterX, zoneCenterY } =
      getPhotoDisplayMetrics(img.naturalWidth, img.naturalHeight, transform.scale)

    const ratio = displayRatioRef.current
    const left = zoneCenterX + transform.offsetX * ratio - displayW / 2
    const top  = zoneCenterY + transform.offsetY * ratio - displayH / 2

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${displayW}px`,
      height: `${displayH}px`,
      maxWidth: 'none',  // override Tailwind preflight max-width: 100% which would constrain width and cause thinning on zoom
      cursor: 'grab',
      userSelect: 'none',
      touchAction: 'none',
      pointerEvents: 'auto',
    }
  }

  // Force re-render when the image loads so getImgStyle() recalculates
  const [, forceUpdate] = useState(0)

  return (
    <div className="flex flex-col items-center w-full gap-5 animate-fade-slide-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-[#111111] uppercase tracking-wide leading-tight">
          Ajuste sua foto
        </h2>
        <p className="font-body text-sm text-[#6B7280] mt-1">
          Arraste para reposicionar · scroll ou pinch para zoom
        </p>
      </div>

      {/* Editor container — 3:4 aspect ratio, same as StampCanvas */}
      <div className="w-full max-w-[360px]">
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)] bg-[#3D9A52]"
          style={{ aspectRatio: '3 / 4', cursor: 'grab' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Template background */}
          <img
            src="/template/figurinha-bg.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
            draggable={false}
          />

          {/* User photo — draggable/zoomable */}
          <img
            ref={imgRef}
            src={photoUrl}
            alt="Sua foto"
            style={getImgStyle()}
            draggable={false}
            onLoad={() => forceUpdate((n) => n + 1)}
          />

          {/* Drag hint overlay — shown briefly */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ top: `${(PHOTO_ZONE_Y / CANVAS_HEIGHT) * 100}%`, height: `${(PHOTO_ZONE_H / CANVAS_HEIGHT) * 100}%` }}
          >
            <div className="flex flex-col items-center gap-1 bg-black/30 rounded-xl px-4 py-2 backdrop-blur-[2px] opacity-60">
              <Move size={20} className="text-white" />
              <span className="font-body text-white text-xs font-medium">Arraste para ajustar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-3 w-full max-w-[360px]">
        <button
          type="button"
          onClick={() => zoomBy(-SCALE_STEP)}
          disabled={transform.scale <= MIN_SCALE}
          className="p-2 rounded-lg border border-[#D1D5DB] text-[#374151] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Diminuir zoom"
        >
          <ZoomOut size={18} />
        </button>

        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={SCALE_STEP}
          value={transform.scale}
          onChange={(e) =>
            setTransform((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
          }
          className="flex-1 accent-[#1A5C2A] h-1.5 cursor-pointer"
          aria-label="Zoom da foto"
        />

        <button
          type="button"
          onClick={() => zoomBy(SCALE_STEP)}
          disabled={transform.scale >= MAX_SCALE}
          className="p-2 rounded-lg border border-[#D1D5DB] text-[#374151] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Aumentar zoom"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-[360px]">
        <button
          type="button"
          onClick={() => onConfirm(transform)}
          className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-[8px] font-display font-bold text-xl tracking-widest uppercase text-white bg-[#1A5C2A] hover:bg-[#3D9A52] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,92,42,0.35)] transition-all duration-200"
        >
          <Check size={20} strokeWidth={2.5} />
          Confirmar posição
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[8px] text-[#6B7280] font-body text-sm font-medium hover:bg-[#F5F5F5] transition-all duration-150"
        >
          <SkipForward size={14} />
          Pular ajuste
        </button>
      </div>
    </div>
  )
}
