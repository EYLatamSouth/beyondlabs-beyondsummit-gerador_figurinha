export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-20 h-14 md:h-16 bg-[#2D7A40] flex items-center px-4 md:px-8 shadow-md">
      {/* Logo — left */}
      <div className="flex-1 flex items-center">
        <img
          src="/assets/logo-beyondlabs.png"
          alt="BeyondLabs"
          className="h-7 md:h-9 w-auto object-contain"
        />
      </div>

      {/* Title — center */}
      <div className="flex-1 flex justify-center">
        <p className="font-display font-bold text-white uppercase tracking-[0.15em] text-sm md:text-base leading-tight text-center">
          Beyond Summit
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          Innovation Cup
        </p>
      </div>

      {/* Year badge — right */}
      <div className="flex-1 flex justify-end">
        <span className="font-display font-bold text-xl md:text-2xl text-[#E0C060] tracking-widest">
          2026
        </span>
      </div>
    </header>
  )
}
