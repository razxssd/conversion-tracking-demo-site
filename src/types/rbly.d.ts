interface RblyInitOptions {
  apiKey: string
  apiBase?: string
  customUtmParams?: string[]
  autoPageView?: boolean
  verifyParam?: string
  deduplication?: {
    enabled?: boolean
    idempotencyKeys?: string[]
    timeWindow?: number
    retention?: number
  }
}

interface RblyTrackResult {
  success: boolean
  data?: {
    conversion_id: string
    [key: string]: unknown
  }
  error?: string
  message?: string
  statusCode?: number
  deduplicated?: boolean
  reason?: 'property_based' | 'time_based'
  key?: string | null
  lastTracked?: string
  timeSinceLastTracked?: number
  queued?: boolean
  queueId?: string
}

interface RblyConfig {
  initialized: boolean
  apiBase: string
  hasApiKey: boolean
  deduplication: {
    enabled: boolean
    timeWindow: number
    retention: number
  }
}

interface RblyDedupStats {
  totalEvents: number
  totalEntries: number
  events: Record<string, {
    entries: number
    oldestEntry: number
    newestEntry: number
  }>
}

interface RblyQueueStats {
  totalEvents: number
  events: Array<{
    id: string
    event: string
    retryCount: number
    timestamp: string
    enqueuedAt: string
    lastAttempt: string | null
  }>
  oldestEvent: string | null
  processorRunning: boolean
}

interface RblyProcessQueueResult {
  success: boolean
  processed: number
  succeeded: number
  failed: number
  removed: number
  remaining: number
}

interface Rbly {
  init(options: RblyInitOptions): void
  track(
    event: string,
    properties?: Record<string, unknown>,
    value?: number | null,
    currency?: string | null
  ): Promise<RblyTrackResult>
  getConfig(): RblyConfig
  getDedupStats(): RblyDedupStats | null
  clearDedupCache(): boolean
  getQueueStats(): RblyQueueStats
  clearQueue(): number
  processQueueNow(): Promise<RblyProcessQueueResult>
}

interface Window {
  rbly: Rbly
}
