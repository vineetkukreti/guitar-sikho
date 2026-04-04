import { useState, useEffect } from 'react'
import TabViewer from '../components/TabViewer'
import { motion, AnimatePresence } from 'framer-motion'

interface TabSummary {
  slug: string
  title: string
  artist: string
  film: string
  year: number
  difficulty: string
  capo: number
  chords: string[]
}

const DIFFICULTY_CONFIG: Record<string, { label: string; style: string; dot: string }> = {
  beginner:     { label: 'Beginner',     style: 'bg-green-400/10 text-green-400 border-green-400/25',  dot: 'bg-green-400' },
  intermediate: { label: 'Intermediate', style: 'bg-amber-400/10 text-amber-400 border-amber-400/25',  dot: 'bg-amber-400' },
  advanced:     { label: 'Advanced',     style: 'bg-rose-400/10  text-rose-400  border-rose-400/25',   dot: 'bg-rose-400'  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

export default function TabsPage() {
  const [tabs, setTabs] = useState<TabSummary[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<object | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingTab, setLoadingTab] = useState(false)

  useEffect(() => {
    fetch('/api/tabs/')
      .then((r) => r.json())
      .then((d) => setTabs(d.tabs))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tabs.filter((t) => {
    const q = search.toLowerCase()
    return !q || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.film.toLowerCase().includes(q)
  })

  const openTab = async (slug: string) => {
    setLoadingTab(true)
    try {
      const res = await fetch(`/api/tabs/${slug}`)
      const data = await res.json()
      setSelected(data)
    } finally {
      setLoadingTab(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient orb */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-orb absolute top-20 right-0 w-[360px] h-[360px] rounded-full bg-amber-500/7 blur-[90px]" />
        <div className="bg-grid absolute inset-0 opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            Hindi Song Tabs
          </h1>
          <p className="text-gray-500 text-sm">Guitar tabs for Bollywood hits — chords, strumming patterns & more</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 relative"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">
            🔍
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by song, artist, or film..."
            className="w-full bg-white/[0.04] border border-border/70 rounded-2xl pl-11 pr-5 py-3.5 text-white text-sm
              placeholder-gray-600 focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.06] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Results count */}
        {!loading && search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-600 mb-4"
          >
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </motion.p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton rounded-3xl h-48" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={search}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((tab, i) => {
                const diff = DIFFICULTY_CONFIG[tab.difficulty] ?? DIFFICULTY_CONFIG.beginner
                return (
                  <motion.button
                    key={tab.slug}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    onClick={() => openTab(tab.slug)}
                    disabled={loadingTab}
                    className="gradient-border-hover glass rounded-3xl p-5 border border-border/60 text-left
                      hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-500/5
                      transition-all duration-300 group disabled:opacity-40 disabled:cursor-wait"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md">
                        🎵
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${diff.style}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                        {diff.label}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-base group-hover:text-amber-300 transition-colors mb-1 leading-tight">
                      {tab.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4">
                      {tab.artist} · {tab.film} · {tab.year}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {tab.capo > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-gray-400 font-medium">
                          Capo {tab.capo}
                        </span>
                      )}
                      {tab.chords.slice(0, 3).map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.04] text-gray-500 font-mono">
                          {c}
                        </span>
                      ))}
                      {tab.chords.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] text-gray-600">
                          +{tab.chords.length - 3}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-3 text-center py-20"
                >
                  <div className="text-5xl mb-4">🎸</div>
                  <p className="text-gray-500 text-sm">No songs found for "{search}"</p>
                  <button
                    onClick={() => setSearch('')}
                    className="mt-3 text-amber-400 text-xs hover:text-amber-300 transition-colors"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Tab viewer modal */}
      {selected && (
        <TabViewer
          tab={selected as Parameters<typeof TabViewer>[0]['tab']}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
