import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { products } from '../data/products'
import { useEventLog } from '../hooks/useEventLog'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { trackWithLogging } = useEventLog()
  const [lastResult, setLastResult] = useState<RblyTrackResult | null>(null)
  const [loading, setLoading] = useState(false)

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Back to products</Link>
      </div>
    )
  }

  const handleBuy = async (fixedOrder: boolean) => {
    setLoading(true)
    setLastResult(null)

    const orderId = fixedOrder
      ? `ORD-FIXED-${product.id}`
      : `ORD-${Date.now()}`

    const result = await trackWithLogging(
      'purchase',
      {
        orderId,
        productId: product.id,
        productName: product.name,
      },
      product.price,
      product.currency
    )

    setLastResult(result)
    setLoading(false)
  }

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to products
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
              {product.badge && (
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded mt-1">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-gray-600 mt-3">{product.description}</p>
              <p className="text-3xl font-bold text-gray-900 mt-6">
                ${product.price.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-1">{product.currency}</span>
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleBuy(false)}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              <button
                onClick={() => handleBuy(true)}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
              >
                Buy Again (Fixed Order ID - tests dedup)
              </button>
            </div>

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
                  <p><strong>Purchase tracked!</strong> ID: {lastResult.data?.conversion_id}</p>
                )}
                {lastResult.deduplicated && (
                  <p><strong>Duplicate detected</strong> ({lastResult.reason}) - Key: {lastResult.key || 'time-based'}</p>
                )}
                {!lastResult.success && !lastResult.deduplicated && (
                  <p><strong>Error:</strong> {lastResult.error} - {lastResult.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
