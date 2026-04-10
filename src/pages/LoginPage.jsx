import { useState } from 'react'
import axios from 'axios'
import { MaterialIcon } from '../components/ui'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function LoginPage({ navigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    persistentSession: true,
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Email and password required.')
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      )

      if (!response.data?.user) {
        throw new Error('User session was not created.')
      }

      navigate('/dashboard')
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-orb orb-a" />
      <div className="login-orb orb-b" />

      <main className="login-card">
        <div className="login-brand">
          <div className="brand-mark large">
            <MaterialIcon name="terminal" />
          </div>
          <h1>DevAdmin</h1>
          <p>Developer Portfolio CMS</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Admin Email</span>
            <div className="input-with-icon">
              <MaterialIcon name="alternate_email" />
              <input
                name="email"
                type="email"
                placeholder="admin@portfolio.dev"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Access Key</span>
            <div className="input-with-icon">
              <MaterialIcon name="key" />
              <input
                name="password"
                type="password"
                placeholder="..........."
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </label>

          <label className="checkbox-row">
            <input
              name="persistentSession"
              type="checkbox"
              checked={formData.persistentSession}
              onChange={handleChange}
            />
            <span>Persistent Session</span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button wide" disabled={isLoading}>
            <span>{isLoading ? 'Signing In...' : 'Initialize Session'}</span>
            <MaterialIcon name="login" />
          </button>
        </form>

        <div className="login-footer">
          <p>Authorized access only. All interactions are logged via secure handshake protocols.</p>
        </div>
      </main>
    </div>
  )
}
