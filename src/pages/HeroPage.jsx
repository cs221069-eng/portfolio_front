import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormField, MaterialIcon, PageHeader, Panel } from '../components/ui'
import { heroForm as defaultHeroForm } from '../data/adminData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function HeroPage() {
  const fallbackHeroForm = {
    status: defaultHeroForm.status,
    description: defaultHeroForm.description,
  }

  const [heroForm, setHeroForm] = useState(fallbackHeroForm)
  const [savedHeroForm, setSavedHeroForm] = useState(fallbackHeroForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchHero = async () => {
      try {
        setError('')
        setIsLoading(true)

        const response = await axios.get(`${API_BASE_URL}/api/hero`)
        const nextHeroForm = {
          status: response.data?.hero?.status || fallbackHeroForm.status,
          description: response.data?.hero?.description || fallbackHeroForm.description,
        }

        if (isMounted) {
          setHeroForm(nextHeroForm)
          setSavedHeroForm(nextHeroForm)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.message || 'Unable to load the hero section.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchHero()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSuccess('')
    setHeroForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleDiscard = () => {
    setError('')
    setSuccess('')
    setHeroForm(savedHeroForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setIsSaving(true)

      const response = await axios.patch(
        `${API_BASE_URL}/api/hero/update`,
        {
          status: heroForm.status,
          description: heroForm.description,
        },
        {
          withCredentials: true,
        }
      )

      setSavedHeroForm(heroForm)
      setSuccess(response.data.message || 'Hero updated successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the hero section.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Section / Hero Management"
        title="Hero Section Control"
        description="Manage your portfolio's first impression and professional presence."
      />

      <section className="content-grid content-grid-wide">
        <Panel eyebrow="Editor / Identity Configuration" title="Identity Configuration">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="two-col">
              <FormField label="Work Status">
                <select
                  name="status"
                  value={heroForm.status}
                  onChange={handleChange}
                  disabled={isSaving || isLoading}
                >
                  <option>Available for Work</option>
                  <option>Currently Working</option>
                </select>
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                name="description"
                rows="5"
                value={heroForm.description}
                onChange={handleChange}
                disabled={isSaving || isLoading}
              />
            </FormField>

            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="form-success">{success}</p> : null}

            <div className="action-row">
              <span className="field-hint">{isLoading ? 'Loading hero data from database...' : 'This form is synced with the latest hero record.'}</span>
              <div className="button-row">
                <button type="button" className="ghost-button" onClick={handleDiscard} disabled={isSaving || isLoading}>
                  Discard
                </button>
                <button type="submit" className="primary-button" disabled={isSaving || isLoading}>
                  {isLoading ? 'Loading...' : isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </Panel>

        <div className="page-stack">
          <Panel eyebrow="Preview / Live" title="Live Preview">
            <div className="preview-card">
              <div className="preview-chip">
                <span className="status-dot" />
                {heroForm.status} @ {defaultHeroForm.company}
              </div>
              <h3>
                Alexander <span>Sterling</span>
              </h3>
              <p className="preview-role">{defaultHeroForm.role}</p>
              <p className="preview-copy">{heroForm.description}</p>
              <div className="button-row">
                <button type="button" className="primary-button">
                  Hire Me
                </button>
                <button type="button" className="ghost-button">
                  View Work
                </button>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Shortcuts / Hero" title="Quick Controls">
            <div className="shortcut-grid">
              <button type="button" className="shortcut-card">
                <MaterialIcon name="attachment" />
                <div>
                  <strong>Resume Link</strong>
                  <span>Manage external file link</span>
                </div>
              </button>
              <button type="button" className="shortcut-card">
                <MaterialIcon name="smart_button" />
                <div>
                  <strong>CTA Actions</strong>
                  <span>Configure hero buttons</span>
                </div>
              </button>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  )
}
