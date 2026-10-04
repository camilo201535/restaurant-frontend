import { Link } from 'react-router-dom'

function MainLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside
        className="d-flex flex-column flex-shrink-0 p-3 text-white"
        style={{ width: '240px', backgroundColor: '#17212b' }}
      >
        <span className="fs-5 fw-bold mb-4">Restaurant Admin</span>
        <nav aria-label="Main navigation">
          <ul className="nav nav-pills flex-column mb-auto">

            <li className="nav-item">
              <Link to="/" className="nav-link text-white">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/users" className="nav-link text-white">Users</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link text-white">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/providers" className="nav-link text-white">Providers</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <header className="d-flex align-items-center px-4 border-bottom bg-white fw-semibold" style={{ minHeight: '72px' }}>
          Dashboard
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout