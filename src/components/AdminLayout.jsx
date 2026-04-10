import { useState } from 'react'
import { navItems } from '../data/adminData'
import { MaterialIcon } from './ui'

function Sidebar({ currentPath, onNavigate, messageCount, isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand-block">
        <div className="brand-mark">
          <MaterialIcon name="bolt" />
        </div>
        <div>
          <h2>Portfolio CMS</h2>
          <p>Admin Console</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <MaterialIcon name={item.icon} />
            <span>{item.label}</span>
            {item.path === '/messages' && messageCount > 0 ? <span className="nav-badge">{messageCount}</span> : null}
          </button>
        ))}
      </nav>

      <button type="button" className="nav-item nav-logout" onClick={() => onNavigate('/')}>
        <MaterialIcon name="logout" />
        <span>Logout</span>
      </button>
    </aside>
  )
}

function Topbar({ currentPath, navigate, messageCount, onMenuToggle }) {
  const activeItem = navItems.find((item) => item.path === currentPath) ?? navItems[0]

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <button type="button" className="mobile-menu-button" onClick={onMenuToggle} aria-label="Toggle navigation">
          <MaterialIcon name="menu" />
        </button>
        <span className="topbar-logo">DevAdmin</span>
        <span className="topbar-chip">{activeItem.label}</span>
      </div>

      <div className="topbar-actions">
        <label className="search-box">
          <MaterialIcon name="search" />
          <input type="text" placeholder="Search admin modules..." />
        </label>
        <button type="button" className="icon-button notification-button">
          <MaterialIcon name="notifications" />
          {messageCount > 0 ? <span className="icon-badge">{messageCount}</span> : null}
        </button>
        <button type="button" className="icon-button" onClick={() => navigate('/')}> 
          <MaterialIcon name="apps" />
        </button>
        <div className="avatar-ring">
          <div className="avatar-core">MS</div>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children, currentPath, navigate, messageCount }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleNavigate = (nextPath) => {
    navigate(nextPath)
    setIsSidebarOpen(false)
  }

  return (
    <div className="admin-shell">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} messageCount={messageCount} isOpen={isSidebarOpen} />
      <div className={`nav-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <div className="admin-content">
        <Topbar currentPath={currentPath} navigate={navigate} messageCount={messageCount} onMenuToggle={() => setIsSidebarOpen((value) => !value)} />
        <main className="page-shell">{children}</main>
      </div>
    </div>
  )
}
