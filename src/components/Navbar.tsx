import { Link, useLocation } from 'react-router'

export function Navbar() {
  const location = useLocation()
  const clickId = localStorage.getItem('rbly_click_id')

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              DemoShop
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/" className={linkClass('/')}>Products</Link>
              <Link to="/signup" className={linkClass('/signup')}>Sign Up</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={`inline-block w-2 h-2 rounded-full ${clickId ? 'bg-green-500' : 'bg-gray-300'}`} />
            {clickId ? (
              <span className="font-mono truncate max-w-[120px]" title={clickId}>
                {clickId}
              </span>
            ) : (
              <span>No click ID</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
