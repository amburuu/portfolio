'use client'

import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="absolute top-4 right-4 z-50 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}