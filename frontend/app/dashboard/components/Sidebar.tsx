'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BsGrid, BsMap, BsGraphUp, BsRobot } from 'react-icons/bs'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BsGrid size={20} />,
    },
    {
      label: 'Mapa',
      href: '/map',
      icon: <BsMap size={20} />,
    },
    {
      label: 'Relatórios',
      href: '/reports',
      icon: <BsGraphUp size={20} />,
    },
    {
      label: 'Busca IA',
      href: '/aiquery',
      icon: <BsRobot size={20} />,
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

        <nav className="p-4 mt-12 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform hover:translate-x-2 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/10'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span 
                className={`transition-all duration-500 ${
                  isActive(item.href) ? 'scale-110 text-white' : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110'
                }`}
              >
                {item.icon}
              </span>
              <span className="font-semibold tracking-wide text-sm">{item.label}</span>
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
