import { useState } from 'react'
import { useEventLog } from '../hooks/useEventLog'

export function SignupPage() {
  const { trackWithLogging } = useEventLog()
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [lastResult, setLastResult] = useState<RblyTrackResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLastResult(null)

    const result = await trackWithLogging('signup', {
      email: form.email,
      name: form.name,
      company: form.company,
      plan: 'trial',
    })

    setLastResult(result)
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-1">
          Mock registration form. Submit to trigger a <code className="bg-gray-100 px-1 rounded text-sm">signup</code> event.
          Submit the same email twice to test deduplication.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Acme Inc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing up...' : 'Create Account'}
        </button>
      </form>

      {lastResult && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            lastResult.success
              ? 'bg-green-50 border border-green-200 text-green-800'
              : lastResult.deduplicated
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {lastResult.success && (
            <p><strong>Signup tracked!</strong> ID: {lastResult.data?.conversion_id}</p>
          )}
          {lastResult.deduplicated && (
            <p><strong>Duplicate detected</strong> ({lastResult.reason}) - Same email already tracked</p>
          )}
          {!lastResult.success && !lastResult.deduplicated && (
            <p><strong>Error:</strong> {lastResult.error} - {lastResult.message}</p>
          )}
        </div>
      )}
    </div>
  )
}
