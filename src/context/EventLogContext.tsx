import { createContext, useState, useCallback, type ReactNode } from 'react'

export interface EventLogEntry {
  id: string
  timestamp: Date
  type: 'track' | 'action' | 'verify'
  event: string
  properties?: Record<string, unknown>
  value?: number | null
  currency?: string | null
  result: RblyTrackResult | null
  duration?: number
}

export interface EventLogContextValue {
  entries: EventLogEntry[]
  addEntry(entry: EventLogEntry): void
  updateEntry(id: string, result: RblyTrackResult, duration: number): void
  clearLog(): void
}

export const EventLogContext = createContext<EventLogContextValue>({
  entries: [],
  addEntry: () => {},
  updateEntry: () => {},
  clearLog: () => {},
})

export function EventLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<EventLogEntry[]>([])

  const addEntry = useCallback((entry: EventLogEntry) => {
    setEntries(prev => [entry, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, result: RblyTrackResult, duration: number) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, result, duration } : e))
    )
  }, [])

  const clearLog = useCallback(() => {
    setEntries([])
  }, [])

  return (
    <EventLogContext.Provider value={{ entries, addEntry, updateEntry, clearLog }}>
      {children}
    </EventLogContext.Provider>
  )
}
