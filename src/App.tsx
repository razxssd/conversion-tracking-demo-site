import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { SignupPage } from './pages/SignupPage'
import { useRbly } from './hooks/useRbly'
import { useEventLog } from './hooks/useEventLog'

function AppContent() {
  const { isInitialized, error } = useRbly()
  const { trackWithLogging } = useEventLog()
  const location = useLocation()
  const prevPathRef = useRef<string | null>(null)

  // Track page_view on every route change (SPA navigation)
  // autoPageView is disabled in SDK init because it only fires once;
  // in a SPA we need to track on every client-side navigation.
  useEffect(() => {
    if (!isInitialized) return
    if (prevPathRef.current === location.pathname) return
    prevPathRef.current = location.pathname

    trackWithLogging('page_view', {
      url: window.location.href,
      path: location.pathname,
    })
  }, [location.pathname, isInitialized, trackWithLogging])

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-red-800">SDK Error</h2>
          <p className="text-red-700 mt-1">{error}</p>
          <p className="text-sm text-red-600 mt-3">
            Check your <code className="bg-red-100 px-1 rounded">.env</code> configuration and ensure the SDK is built.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return <AppContent />
}
