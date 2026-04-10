import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from './components/AdminLayout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import EducationPage from './pages/EducationPage'
import HeroPage from './pages/HeroPage'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import ProjectsPage from './pages/ProjectsPage'
import ResumeSettingsPage from './pages/ResumeSettingsPage'
import SkillsPage from './pages/SkillsPage'

const validPaths = new Set([
  '/',
  '/dashboard',
  '/hero',
  '/about',
  '/skills',
  '/projects',
  '/education',
  '/contact',
  '/messages',
  '/resume',
  '/settings',
])

function getHashPath() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  return validPaths.has(raw) ? raw : '/'
}

export default function App() {
  const [path, setPath] = useState(getHashPath)
  const [messageCount, setMessageCount] = useState(0)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  useEffect(() => {
    const syncPath = () => setPath(getHashPath())
    window.addEventListener('hashchange', syncPath)
    syncPath()
    return () => window.removeEventListener('hashchange', syncPath)
  }, [])

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      if (path === '/') {
        if (isMounted) {
          setIsAuthenticated(false)
          setIsCheckingAuth(false)
        }
        return
      }

      try {
        await axios.get(`${apiBaseUrl}/api/users/me`)

        if (isMounted) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false)
          window.location.hash = '/'
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    setIsCheckingAuth(true)
    checkSession()

    return () => {
      isMounted = false
    }
  }, [apiBaseUrl, path])

  useEffect(() => {
    if (!isAuthenticated) {
      setMessageCount(0)
      return
    }

    let isMounted = true

    const fetchMessageCount = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/message/all`, {
          credentials: 'include',
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (isMounted && Array.isArray(data)) {
          setMessageCount(data.length)
        }
      } catch (error) {
        console.error('Failed to fetch message count:', error)
      }
    }

    fetchMessageCount()
    const intervalId = window.setInterval(fetchMessageCount, 10000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [apiBaseUrl, isAuthenticated])

  const navigate = (nextPath) => {
    window.location.hash = nextPath
  }

  const pageMap = {
    '/dashboard': <DashboardPage />,
    '/hero': <HeroPage />,
    '/about': <AboutPage />,
    '/skills': <SkillsPage />,
    '/projects': <ProjectsPage />,
    '/education': <EducationPage />,
    '/contact': <ContactPage />,
    '/messages': <MessagesPage />,
    '/resume': <ResumeSettingsPage mode="resume" />,
    '/settings': <ResumeSettingsPage mode="settings" />,
  }

  if (path === '/') {
    return <LoginPage navigate={navigate} />
  }

  if (isCheckingAuth) {
    return <div className="login-shell"><main className="login-card"><p>Checking session...</p></main></div>
  }

  if (!isAuthenticated) {
    return <LoginPage navigate={navigate} />
  }

  return (
    <AdminLayout currentPath={path} navigate={navigate} messageCount={messageCount}>
      {pageMap[path] ?? <DashboardPage />}
    </AdminLayout>
  )
}
