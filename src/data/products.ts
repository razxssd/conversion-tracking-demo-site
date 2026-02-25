export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  imageUrl: string
  badge?: string
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Noise-Canceling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio for work and travel.',
    price: 249.99,
    currency: 'USD',
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/id/180/400/400',
    badge: 'Best Seller',
  },
  {
    id: 'prod-002',
    name: 'Mechanical Keyboard',
    description:
      'Compact 75% layout with hot-swappable switches, RGB backlighting, and USB-C connectivity. Built for productivity.',
    price: 149.99,
    currency: 'USD',
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/id/366/400/400',
  },
  {
    id: 'prod-003',
    name: 'Ultrawide Monitor 34"',
    description:
      '34-inch curved ultrawide display with 144Hz refresh rate, WQHD resolution. Ideal for multitasking and creative work.',
    price: 599.99,
    currency: 'USD',
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/id/532/400/400',
    badge: 'New',
  },
  {
    id: 'prod-004',
    name: 'Ergonomic Office Chair',
    description:
      'Fully adjustable lumbar support, breathable mesh back, and 4D armrests. Designed for all-day comfort.',
    price: 399.99,
    currency: 'USD',
    category: 'Furniture',
    imageUrl: 'https://picsum.photos/id/625/400/400',
  },
  {
    id: 'prod-005',
    name: 'e-book Reader',
    description:
      'small hand-held electronic device for reading books.',
    price: 34.99,
    currency: 'USD',
    category: 'Accessories',
    imageUrl: 'https://picsum.photos/id/668/400/400',
  },
  {
    id: 'prod-006',
    name: 'Portable Speaker',
    description:
      'Waterproof IPX7 speaker with 360-degree sound, 20-hour playtime, and built-in power bank.',
    price: 79.99,
    currency: 'USD',
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/id/529/400/400',
    badge: 'Sale',
  },
]
