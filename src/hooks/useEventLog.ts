import { useContext, useCallback } from 'react'
import { EventLogContext } from '../context/EventLogContext'

export function useEventLog() {
  const context = useContext(EventLogContext)

  const trackWithLogging = useCallback(
    async (
      event: string,
      properties?: Record<string, unknown>,
      value?: number | null,
      currency?: string | null
    ) => {
      const id = crypto.randomUUID()
      const start = performance.now()

      context.addEntry({
        id,
        timestamp: new Date(),
        type: 'track',
        event,
        properties,
        value,
        currency,
        result: null,
      })

      try {
        const result = await window.rbly.track(event, properties, value, currency)
        const duration = Math.round(performance.now() - start)
        context.updateEntry(id, result, duration)
        return result
      } catch (e) {
        const duration = Math.round(performance.now() - start)
        const errorResult: RblyTrackResult = {
          success: false,
          error: 'sdk_error',
          message: e instanceof Error ? e.message : 'Unknown error',
        }
        context.updateEntry(id, errorResult, duration)
        return errorResult
      }
    },
    [context]
  )

  const logAction = useCallback(
    (action: string, result: RblyTrackResult) => {
      context.addEntry({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: 'action',
        event: action,
        result,
        duration: 0,
      })
    },
    [context]
  )

  return { ...context, trackWithLogging, logAction }
}
