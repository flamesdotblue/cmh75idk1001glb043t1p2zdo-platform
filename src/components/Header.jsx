export default function Header({ onLogoClick }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D6452E' }}>
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-white font-semibold tracking-wide">Calisthena</span>
        </button>
        <span className="text-white/60 text-sm">MVP</span>
      </div>
    </header>
  )
}
