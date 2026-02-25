import { useState, useEffect } from 'react'
import { useEventLog } from '../hooks/useEventLog'

interface DebugPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export function DebugPanel({ isOpen, onToggle }: DebugPanelProps) {
  const { entries, clearLog, logAction } = useEventLog()
  const [dedupStats, setDedupStats] = useState<RblyDedupStats | null>(null)
  const [queueStats, setQueueStats] = useState<RblyQueueStats | null>(null)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'log' | 'dedup' | 'queue' | 'config' | 'actions'>('log')
  const [verifyToken, setVerifyToken] = useState('')

  useEffect(() => {
    if (!isOpen || !window.rbly) return

    const refresh = () => {
      try {
        setDedupStats(window.rbly.getDedupStats())
        setQueueStats(window.rbly.getQueueStats())
      } catch {
        // SDK not ready yet
      }
    }

    refresh()
    const interval = setInterval(refresh, 2000)
    return () => clearInterval(interval)
  }, [isOpen])

  const sdkConfig = window.rbly ? (() => { try { return window.rbly.getConfig() } catch { return null } })() : null
  const clickId = localStorage.getItem('rbly_click_id')
  const currentVerifyToken = new URLSearchParams(window.location.search).get('rbly_verify')

  const handleClearDedup = () => {
    const result = window.rbly.clearDedupCache()
    logAction('clearDedupCache', { success: result } as RblyTrackResult)
  }

  const handleClearQueue = () => {
    const removed = window.rbly.clearQueue()
    logAction('clearQueue', { success: true, message: `Removed ${removed} events` } as RblyTrackResult)
  }

  const handleProcessQueue = async () => {
    const result = await window.rbly.processQueueNow()
    logAction('processQueueNow', { success: result.success, message: `${result.succeeded}/${result.processed} succeeded` } as RblyTrackResult)
  }

  const handleSetTestClickId = () => {
    const testId = `test_click_${Date.now()}`
    localStorage.setItem('rbly_click_id', testId)
    window.location.reload()
  }

  const handleVerifyDomain = () => {
    const token = verifyToken.trim() || `vrf_test_${Date.now()}`
    const url = new URL(window.location.href)
    url.searchParams.set('rbly_verify', token)
    window.location.href = url.toString()
  }

  const tabs = [
    { id: 'log' as const, label: 'Events', count: entries.length },
    { id: 'dedup' as const, label: 'Dedup' },
    { id: 'queue' as const, label: 'Queue', count: queueStats?.totalEvents },
    { id: 'config' as const, label: 'Config' },
    { id: 'actions' as const, label: 'Actions' },
  ]

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={onToggle}
        className="w-6 bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center cursor-pointer border-l border-gray-700 transition-colors"
        title={isOpen ? 'Close debug panel' : 'Open debug panel'}
      >
        <span className="[writing-mode:vertical-lr] text-[10px] font-mono tracking-widest">
          DEBUG
        </span>
      </button>

      {isOpen && (
        <div className="w-[360px] bg-gray-900 text-gray-100 flex flex-col overflow-hidden border-l border-gray-700">
          {/* Status bar */}
          <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${sdkConfig?.initialized ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{sdkConfig?.initialized ? 'SDK Initialized' : 'SDK Not Ready'}</span>
            {clickId && (
              <>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400 font-mono truncate" title={clickId}>{clickId}</span>
              </>
            )}
            {currentVerifyToken && (
              <>
                <span className="text-gray-600">|</span>
                <span className="bg-purple-500/20 text-purple-300 px-1.5 rounded font-mono truncate" title={currentVerifyToken}>
                  verify: {currentVerifyToken}
                </span>
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 text-xs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 bg-gray-700 text-gray-300 px-1 rounded text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'log' && (
              <div>
                {entries.length > 0 && (
                  <button
                    onClick={clearLog}
                    className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 px-3 text-left hover:bg-gray-800"
                  >
                    Clear log
                  </button>
                )}
                {entries.length === 0 ? (
                  <p className="text-gray-500 text-xs p-3">No events tracked yet. Navigate pages or trigger events.</p>
                ) : (
                  entries.map(entry => (
                    <div
                      key={entry.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    >
                      <div className="px-3 py-2 flex items-center gap-2">
                        <StatusBadge result={entry.result} type={entry.type} />
                        <span className="text-xs font-mono font-semibold text-gray-200 truncate">
                          {entry.event}
                        </span>
                        {entry.value != null && (
                          <span className="text-xs text-gray-400">
                            ${entry.value}
                          </span>
                        )}
                        <span className="ml-auto text-[10px] text-gray-500 flex-shrink-0">
                          {entry.duration != null ? `${entry.duration}ms` : '...'}
                        </span>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">
                          {entry.timestamp.toLocaleTimeString('en', { hour12: false, fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions)}
                        </span>
                      </div>
                      {expandedEntry === entry.id && (
                        <pre className="px-3 pb-2 text-[10px] text-gray-400 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(
                            {
                              properties: entry.properties,
                              value: entry.value,
                              currency: entry.currency,
                              result: entry.result,
                            },
                            null,
                            2
                          )}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'dedup' && (
              <div className="p-3">
                {dedupStats ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Stat label="Total Events" value={dedupStats.totalEvents} />
                      <Stat label="Total Entries" value={dedupStats.totalEntries} />
                    </div>
                    {Object.entries(dedupStats.events).length > 0 ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Per-event breakdown:</p>
                        {Object.entries(dedupStats.events).map(([event, data]) => (
                          <div key={event} className="bg-gray-800 rounded p-2 mb-1 text-xs">
                            <span className="font-mono font-semibold text-gray-200">{event}</span>
                            <span className="text-gray-400 ml-2">{data.entries} entries</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No dedup entries yet.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Dedup stats unavailable.</p>
                )}
              </div>
            )}

            {activeTab === 'queue' && (
              <div className="p-3">
                {queueStats ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Stat label="Queued Events" value={queueStats.totalEvents} />
                      <Stat label="Processor" value={queueStats.processorRunning ? 'Running' : 'Stopped'} />
                    </div>
                    {queueStats.events.length > 0 ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Queued events:</p>
                        {queueStats.events.map(evt => (
                          <div key={evt.id} className="bg-gray-800 rounded p-2 mb-1 text-xs">
                            <span className="font-mono font-semibold text-gray-200">{evt.event}</span>
                            <span className="text-gray-400 ml-2">retry #{evt.retryCount}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No events in queue.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Queue stats unavailable.</p>
                )}
              </div>
            )}

            {activeTab === 'config' && (
              <div className="p-3">
                <pre className="text-[11px] text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      sdk: sdkConfig,
                      env: {
                        VITE_API_BASE: import.meta.env.VITE_API_BASE || '(not set)',
                        VITE_SDK_URL: import.meta.env.VITE_SDK_URL || '(not set)',
                        VITE_API_KEY: import.meta.env.VITE_API_KEY ? '***set***' : '(not set)',
                      },
                      localStorage: {
                        rbly_click_id: clickId || '(none)',
                        rbly_utm_params: (() => {
                          try { return JSON.parse(localStorage.getItem('rbly_utm_params') || 'null') }
                          catch { return null }
                        })(),
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="p-3 space-y-2">
                <p className="text-xs text-gray-500 mb-3">SDK utility actions</p>
                <ActionButton label="Set Test Click ID" description="Write a test click ID to localStorage and reload" onClick={handleSetTestClickId} />
                <ActionButton label="Clear Dedup Cache" description="Remove all deduplication entries" onClick={handleClearDedup} variant="warning" />
                <ActionButton label="Clear Event Queue" description="Remove all queued events" onClick={handleClearQueue} variant="warning" />
                <ActionButton label="Process Queue Now" description="Manually trigger queue processing" onClick={handleProcessQueue} />

                <div className="pt-3 mt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Domain Verification</p>
                  <p className="text-[10px] text-gray-600 mb-2">
                    Adds <code className="text-gray-400">?rbly_verify</code> to URL and reloads. The SDK sends a ping to <code className="text-gray-400">/v1/sdk/ping</code> during init.
                  </p>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={verifyToken}
                      onChange={e => setVerifyToken(e.target.value)}
                      placeholder="vrf_test_token (optional)"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleVerifyDomain}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors flex-shrink-0"
                    >
                      Verify
                    </button>
                  </div>
                  {currentVerifyToken && (
                    <p className="text-[10px] text-purple-300 mt-1">
                      Active token: <span className="font-mono">{currentVerifyToken}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ result, type }: { result: RblyTrackResult | null; type: string }) {
  if (!result) {
    return <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
  }
  if (type === 'verify') {
    return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${result.success ? 'bg-purple-400' : 'bg-red-400'}`} />
  }
  if (result.success) {
    return <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
  }
  if (result.deduplicated) {
    return <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
  }
  if (result.queued) {
    return <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
  }
  return <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <p className="text-[10px] text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-mono font-semibold text-gray-200">{value}</p>
    </div>
  )
}

function ActionButton({
  label,
  description,
  onClick,
  variant = 'default',
}: {
  label: string
  description: string
  onClick: () => void
  variant?: 'default' | 'warning'
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded text-xs transition-colors ${
        variant === 'warning'
          ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-200'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
      }`}
    >
      <span className="font-semibold">{label}</span>
      <p className="text-gray-500 mt-0.5">{description}</p>
    </button>
  )
}
