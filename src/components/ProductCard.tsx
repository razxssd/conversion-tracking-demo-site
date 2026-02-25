import { Link } from 'react-router'
import type { Product } from '../data/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
