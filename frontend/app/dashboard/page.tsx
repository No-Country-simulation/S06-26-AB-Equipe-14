'use client'

import Sidebar from './components/Sidebar'
import Navbar from './components/navbar'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <Navbar />
      <main className="flex-1 px-6 pt-24 pb-10 text-slate-100 sm:px-10 lg:px-14 md:ml-64">
      </main>
      </div>
  )
}
