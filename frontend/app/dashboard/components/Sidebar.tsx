'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
    },
    {
      label: 'Mapa',
      href: '/map',
      icon: '🗺️',
    },
    {
      label: 'Relatórios',
      href: '/reports',
      icon: '📈',
    },
    {
      label: 'Busca IA',
      href: '/aiquery',
      icon: '🤖',
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Botão Toggle para Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-40 p-2 m-2 md:hidden bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 overflow-hidden`}
      >
        <div className="flex h-16 items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20 font-semibold text-sm">
              PN
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Portal</p>
              <h1 className="text-base font-semibold text-white">Dashboard</h1>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            © 2024 - Equipe 14
          </p>
        </div>
      </aside>

      {/* Overlay para Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        />
      )}
    </>
  )
}
