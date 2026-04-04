import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/tuner', label: 'Tuner' },
  { to: '/tabs', label: 'Tabs' },
  { to: '/learn', label: 'AI Tutor' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-violet-500 flex items-center justify-center text-lg shadow-lg transition-shadow duration-300 group-hover:shadow-amber-400/40">
              🎸
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-violet-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity -z-10" />
          </div>
          <span className="font-extrabold text-lg gradient-text tracking-tight">GuitarSikho</span>
        </Link>

        {/* Nav pills */}
        <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-white/[0.04] border border-border/60">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-4 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200"
            >
              {pathname === link.to && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-400/25"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  pathname === link.to ? 'text-amber-300' : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
