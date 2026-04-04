interface Tab {
  slug: string
  title: string
  artist: string
  film: string
  year: number
  difficulty: string
  capo: number
  tuning: string
  bpm: number
  time_signature: string
  chords: string[]
  strumming_pattern: string
  description: string
  intro_tab: string
  verse_tab: string
  chorus_tab: string
  tips: string[]
}

interface Props {
  tab: Tab
  onClose: () => void
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
}

function ChordBadge({ chord }: { chord: string }) {
  return (
    <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium">
      {chord}
    </span>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">{title}</h3>
      <div className="glass rounded-xl p-4 overflow-x-auto">
        <pre className="tab-display text-green-300 text-xs leading-6">{content}</pre>
      </div>
    </div>
  )
}

export default function TabViewer({ tab, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass border-b border-border px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">{tab.title}</h2>
            <p className="text-gray-400 text-sm">{tab.artist} · {tab.film} ({tab.year})</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none mt-1">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-3">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${DIFFICULTY_COLORS[tab.difficulty]}`}>
              {tab.difficulty}
            </span>
            {tab.capo > 0 && (
              <span className="text-xs px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 font-medium">
                Capo {tab.capo}
              </span>
            )}
            <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
              {tab.bpm} BPM
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
              {tab.tuning}
            </span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{tab.description}</p>

          {/* Chords */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Chords Used</h3>
            <div className="flex flex-wrap gap-2">
              {tab.chords.map((c) => <ChordBadge key={c} chord={c} />)}
            </div>
          </div>

          {/* Strumming */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Strumming Pattern</h3>
            <code className="text-amber-400 font-mono text-sm bg-amber-400/5 px-3 py-1.5 rounded-lg border border-amber-400/10">
              {tab.strumming_pattern}
            </code>
          </div>

          {/* Tabs */}
          <Section title="Intro Tab" content={tab.intro_tab} />
          <Section title="Verse" content={tab.verse_tab} />
          <Section title="Chorus" content={tab.chorus_tab} />

          {/* Tips */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Pro Tips</h3>
            <ul className="space-y-2">
              {tab.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-amber-400 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
