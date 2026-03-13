import { useState, useEffect, useContext } from 'react'
import { EventLogContext } from '../context/EventLogContext'

interface UseRblyReturn {
  isLoaded: boolean
  isInitialized: boolean
  error: string | null
  rbly: Rbly | null
}

export function useRbly(): UseRblyReturn {
  const [isLoaded, setIsLoaded] = useState(!!window.rbly)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addEntry, updateEntry } = useContext(EventLogContext)

  useEffect(() => {
    if (window.rbly) {
      setIsLoaded(true)
      initSdk()
      return
    }

    const interval = setInterval(() => {
      if (window.rbly) {
        clearInterval(interval)
        setIsLoaded(true)
        initSdk()
      }
    }, 50)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!window.rbly) {
        setError('SDK failed to load within 10 seconds. Check VITE_SDK_URL in .env')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  function installPingInterceptor() {
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : input.toString()

      const isPing = url.includes('/v1/sdk/ping')

      if (!isPing) {
        return originalFetch(input, init)
      }

      const entryId = crypto.randomUUID()
      const start = performance.now()

      let pingBody: Record<string, unknown> = {}
      try {
        pingBody = JSON.parse(init?.body as string || '{}')
      } catch { /* ignore */ }

      addEntry({
        id: entryId,
        timestamp: new Date(),
        type: 'verify',
        event: 'domain_verify',
        properties: { token: pingBody.token, domain: pingBody.domain },
        result: null,
      })

      try {
        const response = await originalFetch(input, init)
        const duration = Math.round(performance.now() - start)
        const cloned = response.clone()
        let responseData: Record<string, unknown> | null = null
        try {
          responseData = await cloned.json()
        } catch { /* ignore */ }

        updateEntry(
          entryId,
          {
            success: response.ok,
            ...(responseData || {}),
            ...(!response.ok ? { error: 'server_error', message: `HTTP ${response.status}` } : {}),
          } as RblyTrackResult,
          duration
        )

        return response
      } catch (e) {
        const duration = Math.round(performance.now() - start)
        updateEntry(
          entryId,
          {
            success: false,
            error: 'network_error',
            message: e instanceof Error ? e.message : 'Network error',
          } as RblyTrackResult,
          duration
        )
        throw e
      }
    }
  }

  function initSdk() {
    try {
      const config = window.rbly.getConfig()
      if (config.initialized) {
        setIsInitialized(true)
        return
      }

      const params = new URLSearchParams(window.location.search)
      const apiKey = params.get('apiKey') || import.meta.env.VITE_API_KEY
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

      if (!apiKey) {
        setError('VITE_API_KEY not configured in .env')
        return
      }

      // Install fetch interceptor BEFORE init so we capture the verification ping
      installPingInterceptor()

      window.rbly.init({
        apiKey,
        apiBase,
        autoPageView: false,
      })
      setIsInitialized(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'SDK init failed')
    }
  }

  return {
    isLoaded,
    isInitialized,
    error,
    rbly: isInitialized ? window.rbly : null,
  }
}
