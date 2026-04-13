import { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Panel } from '../components/ui'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://portfolio-backend-eight-mu.vercel.app'}/api/message`

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiBaseUrl}/all`)
      setMessages(response.data)
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/delete/${id}`)
      setStatus('Message deleted successfully.')
      fetchMessages()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete the message.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Inbox / Communications"
        title="Inbound Inquiries"
        description="Every message sent through the portfolio contact form will appear here automatically."
      />

      <Panel eyebrow="Feed / Message Queue" title="Latest Messages">
        {loading ? <p className="status-text">Loading messages...</p> : null}
        {!loading && messages.length === 0 ? <p className="status-text">No messages have been received yet.</p> : null}
        {status ? <p className="status-text">{status}</p> : null}

        <div className="list-stack">
          {messages.map((message) => (
            <article key={message._id} className="inbox-card">
              <div className="panel-header">
                <div>
                  <h3 className="mini-title">{message.name}</h3>
                  <p className="field-hint">{message.subject}</p>
                </div>
                <span className="pill active">{message.status || 'Unread'}</span>
              </div>

              <p className="card-copy">{message.message}</p>
              <p className="field-hint">{message.email}</p>

              <div className="button-row">
                <button type="button" className="ghost-button danger-outline" onClick={() => handleDelete(message._id)}>
                  Delete Message
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}
