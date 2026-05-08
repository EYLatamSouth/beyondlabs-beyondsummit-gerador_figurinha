// Sparkle positions (relative to the card, %) and animation delays
const SPARKLES = [
  { top: '-8%',  left: '10%',  size: 22, delay: '0s',    duration: '2.2s' },
  { top: '-6%',  left: '50%',  size: 18, delay: '0.4s',  duration: '1.9s' },
  { top: '-9%',  left: '82%',  size: 24, delay: '0.8s',  duration: '2.5s' },
  { top: '20%',  left: '-8%',  size: 16, delay: '0.2s',  duration: '2.1s' },
  { top: '55%',  left: '-9%',  size: 20, delay: '1.0s',  duration: '2.3s' },
  { top: '85%',  left: '-7%',  size: 14, delay: '0.6s',  duration: '1.8s' },
  { top: '20%',  left: '104%', size: 18, delay: '1.2s',  duration: '2.0s' },
  { top: '55%',  left: '106%', size: 22, delay: '0.3s',  duration: '2.4s' },
  { top: '88%',  left: '103%', size: 16, delay: '0.9s',  duration: '2.1s' },
  { top: '104%', left: '18%',  size: 20, delay: '0.5s',  duration: '2.2s' },
  { top: '106%', left: '60%',  size: 16, delay: '1.1s',  duration: '1.9s' },
]

function SparkleIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
        fill="#F5C518"
        stroke="#C9A84C"
        strokeWidth="0.5"
      />
    </svg>
  )
}

interface RareStampEffectsProps {
  /** Whether the rare effects should be visible */
  visible: boolean
}

/**
 * Decorative overlay that adds shimmer + sparkle particles around a rare sticker.
 * Renders as a zero-layout-impact absolute wrapper — the parent must be position:relative.
 */
export function RareStampEffects({ visible }: RareStampEffectsProps) {
  if (!visible) return null

  return (
    <>
      {/* Shimmer sweep — positioned to overlay the card exactly */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
        <div
          className="absolute inset-0 animate-shimmer-sweep"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
            width: '60%',
            top: 0,
            bottom: 0,
            left: 0,
          }}
        />
      </div>

      {/* Sparkle particles — positioned relative to the card wrapper */}
      {SPARKLES.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none z-20 animate-sparkle-float"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          <SparkleIcon size={s.size} />
        </div>
      ))}
    </>
  )
}
