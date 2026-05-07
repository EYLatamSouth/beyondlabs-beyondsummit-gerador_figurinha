export function AppBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: "url('/assets/soccer-pattern.svg')",
        backgroundSize: '120px',
        backgroundRepeat: 'repeat',
        opacity: 0.04,
      }}
    />
  )
}
