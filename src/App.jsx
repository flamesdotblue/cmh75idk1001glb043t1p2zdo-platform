import { useMemo, useState } from 'react'
import { ArrowRight, Award, CheckCircle, Clock, Flame, Play, Star } from 'lucide-react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProgressBar from './components/ProgressBar'
import StatCard from './components/StatCard'

const brand = {
  bg: '#121212',
  surface: '#1a1a1a',
  accent: '#D6452E',
  text: '#ffffff',
  darkText: '#2E2E2E',
  soft: '#E5E5E5',
  beige: '#F4E1C1',
}

const initialSkills = [
  {
    id: 'pushup',
    name: 'Push-up',
    difficulty: 1,
    progress: 40,
    thumb: 'https://images.unsplash.com/photo-1599050751795-632c31283d35?q=80&w=600&auto=format&fit=crop',
    stages: [
      { pct: 20, exercises: [{ name: 'Incline Push-ups', sets: 3, reps: 10 }] },
      { pct: 40, exercises: [{ name: 'Knee Push-ups', sets: 3, reps: 12 }] },
      { pct: 60, exercises: [{ name: 'Standard Push-ups', sets: 4, reps: 10 }] },
      { pct: 80, exercises: [{ name: 'Decline Push-ups', sets: 4, reps: 8 }] },
      { pct: 100, exercises: [{ name: 'Diamond Push-ups', sets: 4, reps: 8 }] },
    ],
  },
  {
    id: 'pullup',
    name: 'Pull-up',
    difficulty: 3,
    progress: 15,
    thumb: 'https://images.unsplash.com/photo-1546484959-f54d7d1f7cfb?q=80&w=600&auto=format&fit=crop',
    stages: [
      { pct: 20, exercises: [{ name: 'Dead Hangs', sets: 3, reps: 30 }] },
      { pct: 40, exercises: [{ name: 'Band-assisted Pull-ups', sets: 3, reps: 8 }] },
      { pct: 60, exercises: [{ name: 'Negative Pull-ups', sets: 4, reps: 5 }] },
      { pct: 80, exercises: [{ name: 'Pull-ups', sets: 4, reps: 5 }] },
      { pct: 100, exercises: [{ name: 'Chest-to-bar Pull-ups', sets: 4, reps: 4 }] },
    ],
  },
  {
    id: 'dip',
    name: 'Dip',
    difficulty: 2,
    progress: 25,
    thumb: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop',
    stages: [
      { pct: 20, exercises: [{ name: 'Bench Dips', sets: 3, reps: 12 }] },
      { pct: 40, exercises: [{ name: 'Band-assisted Dips', sets: 3, reps: 8 }] },
      { pct: 60, exercises: [{ name: 'Parallel Bar Dips', sets: 4, reps: 6 }] },
      { pct: 80, exercises: [{ name: 'Tempo Dips', sets: 4, reps: 5 }] },
      { pct: 100, exercises: [{ name: 'Weighted Dips', sets: 4, reps: 4 }] },
    ],
  },
]

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [email, setEmail] = useState('')
  const [skills, setSkills] = useState(initialSkills)
  const [selectedSkillId, setSelectedSkillId] = useState(null)
  const [workoutStep, setWorkoutStep] = useState(0)
  const [streak, setStreak] = useState(3)
  const [level, setLevel] = useState(12)
  const [achievements] = useState(['First Push-up Set', '3-day Streak'])

  const selectedSkill = useMemo(() => skills.find(s => s.id === selectedSkillId) || null, [skills, selectedSkillId])

  const startSkill = (id) => {
    setSelectedSkillId(id)
    setWorkoutStep(0)
    setScreen('skill')
  }

  const completeWorkout = () => {
    if (!selectedSkill) return
    setSkills(prev => prev.map(s => {
      if (s.id !== selectedSkill.id) return s
      const next = Math.min(100, s.progress + 10)
      return { ...s, progress: next }
    }))
    setStreak(s => s + 1)
    setLevel(l => Math.min(100, l + 2))
    setScreen('home')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: brand.bg, color: brand.text }}>
      <Header onLogoClick={() => setScreen('home')} />

      <main className="flex-1 pb-20">
        {screen === 'onboarding' && (
          <Onboarding
            step={onboardingStep}
            onNext={() => {
              if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1)
              else setScreen('auth')
            }}
          />
        )}

        {screen === 'auth' && (
          <Auth
            email={email}
            onEmailChange={setEmail}
            onContinue={() => setScreen('home')}
          />
        )}

        {screen === 'home' && (
          <Home
            streak={streak}
            level={level}
            achievements={achievements}
            skills={skills}
            onContinueTraining={() => setScreen('skills')}
          />
        )}

        {screen === 'skills' && (
          <Skills skills={skills} onSelect={startSkill} />
        )}

        {screen === 'skill' && selectedSkill && (
          <SkillDetail
            skill={selectedSkill}
            onStart={() => setScreen('workout')}
            onBack={() => setScreen('skills')}
            onCompleteStage={() => setScreen('workout')}
          />
        )}

        {screen === 'workout' && selectedSkill && (
          <Workout
            skill={selectedSkill}
            step={workoutStep}
            onNext={() => setWorkoutStep(s => s + 1)}
            onComplete={completeWorkout}
            onBack={() => setScreen('skill')}
          />
        )}

        {screen === 'profile' && (
          <Profile level={level} streak={streak} achievements={achievements} />
        )}
      </main>

      <BottomNav
        active={screen}
        onNavigate={(key) => {
          if (key === 'progress') setScreen('profile')
          else setScreen(key)
        }}
      />
    </div>
  )
}

function Onboarding({ step, onNext }) {
  const slides = [
    { title: 'Train Smart', text: 'Guided skill-based workouts built for progression.' },
    { title: 'Track Progress', text: 'Visualize your improvement and stay consistent.' },
    { title: 'Master Skills', text: 'Unlock badges as you conquer new calisthenics skills.' },
  ]
  return (
    <section className="px-6 pt-8">
      <div className="h-64 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #2E2E2E, #121212)' }}>
        <Play className="w-14 h-14 text-white/80" />
      </div>
      <h2 className="text-2xl font-semibold tracking-wide" style={{ color: brand.beige }}>{slides[step].title}</h2>
      <p className="text-white/70 mt-2">{slides[step].text}</p>
      <button
        onClick={onNext}
        className="mt-8 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: brand.accent }}
      >
        {step < 2 ? 'Next' : 'Get Started'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </section>
  )
}

function Auth({ email, onEmailChange, onContinue }) {
  return (
    <section className="px-6 pt-8">
      <h2 className="text-2xl font-semibold" style={{ color: brand.beige }}>Welcome to Calisthena</h2>
      <p className="text-white/60 mt-1 italic">“Start where you are. Progress every day.”</p>

      <div className="mt-8 space-y-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <label className="text-sm text-white/70">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full bg-transparent outline-none border border-white/10 focus:border-white/30 rounded-lg px-3 py-2"
          />
        </div>
        <button onClick={onContinue} className="w-full py-3 rounded-xl font-medium" style={{ backgroundColor: brand.accent }}>Continue</button>
        <button onClick={onContinue} className="w-full py-3 rounded-xl font-medium bg-white/5">Continue with Google</button>
      </div>
    </section>
  )
}

function Home({ streak, level, achievements, skills, onContinueTraining }) {
  const totalProgress = Math.round(skills.reduce((a, s) => a + s.progress, 0) / (skills.length || 1))
  return (
    <section className="px-6 pt-6 space-y-6">
      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Overall Progress</p>
            <h3 className="text-3xl font-semibold" style={{ color: brand.beige }}>{totalProgress}%</h3>
          </div>
          <ProgressBar value={totalProgress} accent={brand.accent} />
        </div>
        <button onClick={onContinueTraining} className="mt-4 w-full py-3 rounded-xl font-medium" style={{ backgroundColor: brand.accent }}>Continue Training</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${streak} days`} />
        <StatCard icon={<Star className="w-5 h-5" />} label="Level" value={`${level}%`} />
        <StatCard icon={<Award className="w-5 h-5" />} label="Badges" value={`${achievements.length}`} />
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <p className="text-white/60 text-sm">Motivation</p>
        <p className="mt-2 text-lg italic">“Discipline is choosing what you want most over what you want now.”</p>
      </div>
    </section>
  )
}

function Skills({ skills, onSelect }) {
  return (
    <section className="px-6 pt-6">
      <h3 className="text-xl font-semibold mb-4" style={{ color: brand.beige }}>Skills Library</h3>
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill) => (
          <button key={skill.id} onClick={() => onSelect(skill.id)} className="text-left bg-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${skill.thumb})` }} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{skill.name}</h4>
                <span className="text-sm text-white/70">{skill.progress}%</span>
              </div>
              <ProgressBar value={skill.progress} accent={brand.accent} compact />
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span>Difficulty:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`inline-block w-2.5 h-2.5 rounded ${i < skill.difficulty ? 'bg-white/80' : 'bg-white/15'}`} />
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function SkillDetail({ skill, onStart, onBack, onCompleteStage }) {
  return (
    <section className="px-6 pt-4">
      <button onClick={onBack} className="text-white/70 text-sm mb-3">← Back</button>
      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold" style={{ color: brand.beige }}>{skill.name}</h3>
          <span className="text-white/70">{skill.progress}%</span>
        </div>
        <ProgressBar value={skill.progress} accent={brand.accent} />
        <button onClick={onStart} className="mt-4 w-full py-3 rounded-xl font-medium" style={{ backgroundColor: brand.accent }}>Start Workout</button>
      </div>

      <div className="mt-6 space-y-4">
        {skill.stages.map((stage) => (
          <div key={stage.pct} className="bg-[#1a1a1a] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${skill.progress >= stage.pct ? 'text-green-400' : 'text-white/30'}`} />
                <h4 className="font-semibold">Stage {stage.pct}%</h4>
              </div>
              <span className="text-xs text-white/60">{stage.exercises.length} exercise</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {stage.exercises.map((ex) => (
                <li key={ex.name} className="flex items-center justify-between">
                  <span>{ex.name}</span>
                  <span className="text-white/60">{ex.sets} x {ex.reps}</span>
                </li>
              ))}
            </ul>
            <button onClick={onCompleteStage} className="mt-3 w-full py-2 rounded-lg text-sm" style={{ backgroundColor: brand.accent }}>Do this stage</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function Workout({ skill, step, onNext, onComplete, onBack }) {
  const currentStageIndex = Math.min(step, skill.stages.length - 1)
  const stage = skill.stages[currentStageIndex]
  const isLast = currentStageIndex >= skill.stages.length - 1

  return (
    <section className="px-6 pt-4">
      <button onClick={onBack} className="text-white/70 text-sm mb-3">← Back</button>
      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold" style={{ color: brand.beige }}>{skill.name} Workout</h3>
          <span className="text-sm text-white/60">Stage {stage.pct}%</span>
        </div>
        <div className="mt-3 space-y-3">
          {stage.exercises.map((ex) => (
            <div key={ex.name} className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="font-medium">{ex.name}</p>
                  <p className="text-xs text-white/60">{ex.sets} sets × {ex.reps} reps</p>
                </div>
              </div>
              <button className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: brand.accent }}>Start</button>
            </div>
          ))}
        </div>
        {!isLast ? (
          <button onClick={onNext} className="mt-4 w-full py-3 rounded-xl font-medium" style={{ backgroundColor: brand.accent }}>Next Exercise</button>
        ) : (
          <button onClick={onComplete} className="mt-4 w-full py-3 rounded-xl font-medium" style={{ backgroundColor: brand.accent }}>Complete Session</button>
        )}
      </div>
    </section>
  )
}

function Profile({ level, streak, achievements }) {
  return (
    <section className="px-6 pt-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/10" />
        <div>
          <h3 className="text-xl font-semibold" style={{ color: brand.beige }}>Athlete</h3>
          <p className="text-white/60">Level {level}% • {streak}-day streak</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <p className="text-white/60 text-sm">Progress</p>
        <div className="mt-2">
          <ProgressBar value={level} accent={brand.accent} />
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-5">
        <p className="text-white/60 text-sm mb-3">Achievements</p>
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li key={a} className="flex items-center gap-2 text-white/90">
              <Award className="w-4 h-4 text-white/70" /> {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
