export default function ProgressBar({ value = 0, accent = '#D6452E', compact = false }) {
  return (
    <div className={`${compact ? 'h-2' : 'h-3'} w-full rounded-full bg-white/10 overflow-hidden`}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: accent }}
      />
    </div>
  )
}
