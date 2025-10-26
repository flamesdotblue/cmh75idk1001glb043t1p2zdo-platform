import { BarChart, Dumbbell, Home, User } from 'lucide-react'

export default function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'skills', label: 'Skills', icon: Dumbbell },
    { key: 'progress', label: 'Progress', icon: BarChart },
    { key: 'profile', label: 'Profile', icon: User },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-3xl bg-black/60 backdrop-blur border-t border-white/10">
        <div className="grid grid-cols-4">
          {items.map(({ key, label, icon: Icon }) => {
            const isActive = active === key || (key === 'progress' && active === 'profile')
            return (
              <button key={key} onClick={() => onNavigate(key)} className="py-3 flex flex-col items-center justify-center gap-1">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <span className={`text-xs ${isActive ? 'text-white' : 'text-white/60'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
