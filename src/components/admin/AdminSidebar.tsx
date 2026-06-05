'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Calendar, Users, Scissors, MessageSquare, Settings, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { href: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-rose-100">
        <p className="font-bold text-rose-800 text-sm">Podóloga Rosana</p>
        <p className="text-xs text-rose-500">Painel Administrativo</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                ${active ? 'bg-rose-700 text-white' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-rose-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-rose-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-rose-100 flex items-center justify-between px-4 h-14">
        <p className="font-bold text-rose-800 text-sm">Painel Admin</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-14">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
