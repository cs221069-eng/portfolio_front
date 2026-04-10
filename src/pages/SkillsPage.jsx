import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormField, MaterialIcon, PageHeader, Panel } from '../components/ui'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ name: '', icon: '' })
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/skill`

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiBaseUrl}/all`)
      setSkills(response.data)
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to load skills.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setForm({ name: '', icon: '' })
    setEditingId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.icon.trim()) {
      setStatus('Both name and icon are required.')
      return
    }

    try {
      if (editingId) {
        await axios.patch(`${apiBaseUrl}/update/${editingId}`, form)
        setStatus('Skill updated successfully.')
      } else {
        await axios.post(`${apiBaseUrl}/add`, form)
        setStatus('Skill added successfully.')
      }

      resetForm()
      fetchSkills()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save the skill.')
    }
  }

  const handleEdit = (skill) => {
    setEditingId(skill._id)
    setForm({ name: skill.name, icon: skill.icon })
    setStatus('Edit mode enabled.')
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/delete/${id}`)
      if (editingId === id) {
        resetForm()
      }
      setStatus('Skill removed successfully.')
      fetchSkills()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete the skill.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Module / Skills Engine"
        title="Technical Expertise"
        description="Manage the skills shown on the public portfolio with a simple connected editor."
      />

      <section className="content-grid content-grid-wide">
        <Panel eyebrow="Inventory / Skills Grid" title="Skill Cards">
          {loading ? <p className="status-text">Loading skills...</p> : null}
          {!loading && skills.length === 0 ? <p className="status-text">No skills have been saved yet.</p> : null}

          <div className="card-grid">
            {skills.map((skill) => (
              <article key={skill._id} className="skill-card">
                <div className="panel-header">
                  <div className="skill-name-row">
                    <i className={skill.icon} aria-hidden="true" />
                    <h3 className="mini-title">{skill.name}</h3>
                  </div>
                  <span className="skill-badge">Live</span>
                </div>

                <p className="card-copy">This card will appear in the public portfolio skills section.</p>

                <div className="skill-actions">
                  <button type="button" className="ghost-button" onClick={() => handleEdit(skill)}>
                    Update Skill
                  </button>
                  <button type="button" className="ghost-button danger-outline" onClick={() => handleDelete(skill._id)}>
                    Remove Skill
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <div className="page-stack">
          <Panel eyebrow="Manage / Skill Form" title={editingId ? 'Update Skill' : 'Add Skill'}>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="icon-preview-card">
                <div className="icon-preview">
                  {form.icon ? <i className={form.icon} aria-hidden="true" /> : <MaterialIcon name="bolt" />}
                </div>
                <div>
                  <strong>{form.name || 'Skill Preview'}</strong>
                  <p className="field-hint">Use a Font Awesome class here, for example `fa-brands fa-react`.</p>
                </div>
              </div>

              <FormField label="Skill Name">
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="React" />
              </FormField>

              <FormField label="Icon Class">
                <input
                  name="icon"
                  type="text"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="fa-brands fa-react"
                />
              </FormField>

              {status ? <p className="status-text">{status}</p> : null}

              <div className="button-row">
                <button type="submit" className="primary-button">
                  {editingId ? 'Update Skill' : 'Add Skill'}
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
                <strong>/api/skill/all</strong>
              </div>
              <div className="signal-row">
                <span>Add Route</span>
                <strong>/api/skill/add</strong>
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
