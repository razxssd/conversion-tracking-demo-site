import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { DebugPanel } from './DebugPanel'

export function Layout({ children }: { children: ReactNode }) {
  const [debugOpen, setDebugOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <DebugPanel isOpen={debugOpen} onToggle={() => setDebugOpen(!debugOpen)} />
      </div>
    </div>
  )
}
