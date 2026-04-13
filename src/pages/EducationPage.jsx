import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormField, PageHeader, Panel } from '../components/ui'

const emptyForm = {
  title: '',
  place: '',
  period: '',
  cgpa: '',
  detail: '',
}

export default function EducationPage() {
  const [educationItems, setEducationItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://portfolio-backend-eight-mu.vercel.app'}/api/education`

  const fetchEducationItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiBaseUrl}/all`)
      setEducationItems(response.data)
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to load education entries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEducationItems()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.place.trim() || !form.period.trim() || !form.cgpa.trim() || !form.detail.trim()) {
      setStatus('All education fields are required.')
      return
    }

    try {
      if (editingId) {
        await axios.patch(`${apiBaseUrl}/update/${editingId}`, form)
        setStatus('Education entry updated successfully.')
      } else {
        await axios.post(`${apiBaseUrl}/add`, form)
        setStatus('Education entry added successfully.')
      }

      resetForm()
      fetchEducationItems()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save the education entry.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setForm({
      title: item.title || '',
      place: item.place || '',
      period: item.period || '',
      cgpa: item.cgpa || '',
      detail: item.detail || '',
    })
    setStatus('Edit mode enabled.')
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/delete/${id}`)

      if (editingId === id) {
        resetForm()
      }

      setStatus('Education entry removed successfully.')
      fetchEducationItems()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete the education entry.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Section / Education"
        title="Education Profile"
        description="Manage the academic entries displayed in the public education section."
      />

      <section className="content-grid content-grid-wide">
        <Panel eyebrow="Profile / Academic Details" title="Academic Details">
          {loading ? <p className="status-text">Loading education entries...</p> : null}
          {!loading && educationItems.length === 0 ? (
            <p className="status-text">No education entries have been saved yet.</p>
          ) : null}

          <div className="timeline">
            {educationItems.map((item) => (
              <article key={item._id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-copy">
                  <div className="timeline-head">
                    <h3>{item.title}</h3>
                    <span>{item.period}</span>
                  </div>
                  <strong>{item.place}</strong>
                  <p>
                    <strong>CGPA:</strong> {item.cgpa}
                  </p>
                  <p>{item.detail}</p>

                  <div className="button-row">
                    <button type="button" className="ghost-button" onClick={() => handleEdit(item)}>
                      Update Entry
                    </button>
                    <button type="button" className="ghost-button danger-outline" onClick={() => handleDelete(item._id)}>
                      Remove Entry
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <div className="page-stack">
          <Panel eyebrow="Manage / Education Form" title={editingId ? 'Update Education' : 'Add Education'}>
            <form className="form-grid" onSubmit={handleSubmit}>
              <FormField label="Degree / Title">
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="BS in Computer Science"
                />
              </FormField>

              <FormField label="Institute / Place">
                <input
                  name="place"
                  type="text"
                  value={form.place}
                  onChange={handleChange}
                  placeholder="DHA Suffa University"
                />
              </FormField>

              <FormField label="Duration / Period">
                <input
                  name="period"
                  type="text"
                  value={form.period}
                  onChange={handleChange}
                  placeholder="2022 - 2026"
                />
              </FormField>

              <FormField label="CGPA">
                <input
                  name="cgpa"
                  type="text"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="3.54 / 4.0"
                />
              </FormField>

              <FormField
                label="Details"
              >
                <textarea
                  name="detail"
                  rows="5"
                  value={form.detail}
                  onChange={handleChange}
                  placeholder="Current semester, expected graduation, or a short summary..."
                />
              </FormField>

              {status ? <p className="status-text">{status}</p> : null}

              <div className="button-row">
                <button type="submit" className="primary-button">
                  {editingId ? 'Update Entry' : 'Add Entry'}
                </button>
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Clear Form
                </button>
              </div>
            </form>
          </Panel>

          <Panel eyebrow="Sync / Portfolio" title="Connection Status">
            <div className="list-stack compact">
              <div className="signal-row">
                <span>GET Route</span>
                <strong>/api/education/all</strong>
              </div>
              <div className="signal-row">
                <span>Add Route</span>
                <strong>/api/education/add</strong>
              </div>
              <div className="signal-row">
                <span>Update / Delete</span>
                <strong>Connected</strong>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  )
}
