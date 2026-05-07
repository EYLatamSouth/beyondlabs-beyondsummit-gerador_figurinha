export function DecorativeCorners() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Top-left — purple */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="absolute top-0 left-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 C55 0 100 10 120 50 C140 88 130 130 80 150 C40 165 0 140 0 100 Z"
          fill="#6B3FA0"
          opacity="0.75"
        />
      </svg>

      {/* Top-right — cyan */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="absolute top-0 right-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M120 0 C70 0 30 15 10 55 C-8 90 10 120 50 120 C85 120 120 95 120 60 Z"
          fill="#4BBFDB"
          opacity="0.75"
        />
      </svg>

      {/* Bottom-left — pink */}
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="absolute bottom-0 left-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 140 C0 90 15 45 55 20 C90 -2 130 15 130 55 C130 95 95 140 55 140 Z"
          fill="#E8365D"
          opacity="0.75"
        />
      </svg>

      {/* Bottom-right — lime */}
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        className="absolute bottom-0 right-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150 150 C100 150 55 135 30 95 C8 58 25 15 65 10 C105 5 150 35 150 80 Z"
          fill="#8DC63F"
          opacity="0.75"
        />
      </svg>
    </div>
  )
}
