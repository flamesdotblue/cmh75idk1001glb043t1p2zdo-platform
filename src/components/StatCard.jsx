export default function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-[#1a1a1a]">
      <div className="flex items-center justify-between">
        <div className="text-white/80">{icon}</div>
        <span className="text-sm text-white/60">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}
