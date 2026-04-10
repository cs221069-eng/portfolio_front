import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormField, PageHeader, Panel } from '../components/ui'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const fallbackDescription =
  'I am an 8th-semester Computer Science student at DHA Suffa University with a dedicated focus on software engineering and web technologies. Maintaining a CGPA of 3.54, I have balanced academic excellence with practical application. I specialize in the MERN stack and am dedicated to creating efficient, user-centric digital solutions that solve real-world problems.'

export default function AboutPage() {
  const [description, setDescription] = useState(fallbackDescription)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/about`)
        setDescription(response.data.description || fallbackDescription)
      } catch (error) {
        setStatus(error.response?.data?.message || 'Unable to load about content.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')

    try {
      setIsSaving(true)
      await axios.patch(
        `${API_BASE_URL}/api/about/update`,
        { description },
        { withCredentials: true }
      )
      setStatus('About section updated successfully.')
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update the about section.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Section / About"
        title="About Section Control"
        description="Update the public about section content while keeping the same frontend presentation."
      />

      <section className="content-grid content-grid-wide">
        <Panel eyebrow="Editor / About Copy" title="Update About Content">
          <form className="form-grid" onSubmit={handleSubmit}>
            <FormField label="About Description">
              <textarea
                rows="10"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={isSaving || isLoading}
              />
            </FormField>

            {status ? <p className="status-text">{status}</p> : null}

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Update About'}
              </button>
            </div>
          </form>
        </Panel>

        <Panel eyebrow="Preview / Frontend Style" title="About Section Preview">
          <div className="about-preview">
            <div className="about-preview-title">
              <h3>About Me</h3>
            </div>
            <div className="about-preview-copy">
              <p>{description}</p>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  )
}
