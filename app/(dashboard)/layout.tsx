'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <AuthGuard>
      <div className="layout-container">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Navbar isSidebarCollapsed={isSidebarCollapsed} />
          <div className="main-inner">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
