import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard'

export function HomePage() {
  const clickId = localStorage.getItem('rbly_click_id')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rebrandly Conversion Tracking Demo</h1>
        <p className="text-gray-600 mt-1">
          Mock e-commerce store for testing the SDK. Browse products, make purchases, and sign up to generate tracking events.
        </p>
      </div>

      {!clickId && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>No click ID detected.</strong> Visit this page with{' '}
            <code className="bg-amber-100 px-1 rounded text-xs">?rbly_click_id=test123</code>{' '}
            in the URL to simulate arriving from a Rebrandly link, or use the "Set Test Click ID" button in the debug panel.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
