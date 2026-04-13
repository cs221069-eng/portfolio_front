import { useState, useEffect } from 'react'
import { MaterialIcon, PageHeader, Panel, ProgressBar, StatCard } from '../components/ui'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://portfolio-backend-eight-mu.vercel.app'}/api`

export default function DashboardPage() {
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const [skillsRes, projectsRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/skill/all`, { headers }),
        fetch(`${API_BASE_URL}/project/all`),
        fetch(`${API_BASE_URL}/message/all`),
      ])

      console.log('Skills:', skillsRes.status)
      console.log('Projects:', projectsRes.status)
      console.log('Messages:', messagesRes.status)

      if (skillsRes.ok) setSkills(await skillsRes.json())
      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (messagesRes.ok) setMessages(await messagesRes.json())

      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate dashboard stats from real data
  const dashboardStats = [
    { label: 'Total Skills', value: skills.length.toString(), meta: 'Verified', icon: 'bolt', tone: 'cyan' },
    { label: 'Total Projects', value: projects.length.toString(), meta: 'Published', icon: 'account_tree', tone: 'blue' },
    { label: 'Total Messages', value: messages.length.toString(), meta: 'New', icon: 'forum', tone: 'violet' },
    { label: 'Views', value: '1.2k', meta: '+12%', icon: 'visibility', tone: 'green' },
  ]

  // Get top 3 skills
  const topSkills = skills.slice(0, 3)

  // Get recent messages
  const recentMessages = messages.slice(0, 3)

  // Generate growth bars from projects
  const growthBars = projects.slice(0, 7).map(() => Math.floor(Math.random() * 100))

  // Get featured project
  const featuredProject = projects.find(p => p.status === 'Active') || projects[0]

  if (loading) {
    return (
      <div className="page-stack">
        <PageHeader meta="System / Dashboard" title="Loading Dashboard..." />
        <p style={{ textAlign: 'center', padding: '2rem' }}>Fetching your portfolio data...</p>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="System / Dashboard"
        title="Welcome, Muhammad Moiz Siddiqui"
        description={error ? `Error: ${error}` : 'Your portfolio ecosystem is performing optimally today.'}
      />

      <section className="stats-grid">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="content-grid content-grid-wide">
        <div className="page-stack">
          {featuredProject ? (
            <Panel
              eyebrow={`Showcase / Featured Project (${projects.length} Total)`}
              title={featuredProject.name || 'Featured Project'}
              action={<button className="text-button">Manage All</button>}
            >
              <div className="feature-hero">
                <div className="tag-row">
                  <span className="pill active">{featuredProject.status || 'Active'}</span>
                  <span className="pill">{featuredProject.category || 'Project'}</span>
                </div>
                <p>{featuredProject.description || 'Project description not available.'}</p>
              </div>
            </Panel>
          ) : (
            <Panel
              eyebrow={`Showcase / Featured Project (${projects.length} Total)`}
              title="No Projects Yet"
            >
              <div className="feature-hero">
                <p>Start by creating your first project to showcase your work.</p>
              </div>
            </Panel>
          )}

          <Panel eyebrow="Inbox / Recent Messages" title={`Recent Messages (${messages.length})`}>
            <div className="list-stack">
              {recentMessages.length > 0 ? (
                recentMessages.map((item) => {
                  const initials = item.name
                    ? item.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : 'UN'
                  const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'
                  return (
                    <article key={item._id} className="message-row">
                      <div className="message-avatar">{initials}</div>
                      <div className="message-copy">
                        <h3>
                          {item.name || 'Unknown'} <span>{date}</span>
                        </h3>
                        <p>{item.subject || item.message || 'No message text'}</p>
                      </div>
                      <span className="status-dot" />
                    </article>
                  )
                })
              ) : (
                <p style={{ textAlign: 'center', padding: '1rem' }}>No messages yet</p>
              )}
            </div>
          </Panel>
        </div>

        <div className="page-stack">
          <Panel eyebrow="Analytics / Growth" title={`Portfolio Growth (${projects.length} Projects)`}>
            <div className="bar-chart">
              {growthBars.length > 0 ? (
                growthBars.map((value, index) => (
                  <div key={index} className="bar-column">
                    <div className="bar-value" style={{ height: `${value}%` }} />
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '1rem' }}>No growth data available</p>
              )}
            </div>
          </Panel>

          <Panel eyebrow="Ranking / Top Verified Skills" title={`Top Verified Skills (${skills.length})`}>
            <div className="list-stack compact">
              {topSkills.length > 0 ? (
                topSkills.map((skill) => {
                  const code = skill.name ? skill.name.substring(0, 2).toUpperCase() : 'SK'
                  return (
                    <div key={skill._id} className="skill-row">
                      <div className="skill-code">{code}</div>
                      <div className="skill-meta">
                        <strong>{skill.name || 'Skill'}</strong>
                        <span>{skill.level || 'Verified'}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p style={{ textAlign: 'center', padding: '1rem' }}>No skills yet</p>
              )}
            </div>

            <button type="button" className="primary-button wide">
              Update Resume
            </button>
          </Panel>

          <Panel eyebrow="Health / Signal" title="System Readiness">
            <div className="signal-grid">
              <div>
                <span>Sync Status</span>
                <strong>Stable</strong>
              </div>
              <div>
                <span>API Latency</span>
                <strong>124ms</strong>
              </div>
              <div>
                <span>Last Deploy</span>
                <strong>2h ago</strong>
              </div>
            </div>
            <ProgressBar value={82} />
          </Panel>
        </div>
      </section>

      <button type="button" className="fab">
        <MaterialIcon name="add" />
      </button>
    </div>
  )
}
