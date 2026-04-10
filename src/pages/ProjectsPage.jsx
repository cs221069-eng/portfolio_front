import { useEffect, useState } from 'react'
import axios from 'axios'
import { FormField, MaterialIcon, PageHeader, Panel } from '../components/ui'

const emptyForm = {
  title: '',
  shortDescription: '',
  details: '',
  tags: '',
  technology: '',
  liveUrl: '',
  codeUrl: '',
  screenshot: '',
  iconClass: 'fa-solid fa-clipboard-list',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null)

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/project`

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiBaseUrl}/all`)
      setProjects(response.data)
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }
    setScreenshotFile(file)
    setForm((current) => ({
      ...current,
      screenshot: file.name,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
    setScreenshotFile(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.shortDescription.trim() || !form.details.trim()) {
      setStatus('Title, short description, and details are required.')
      return
    }

    try {
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('shortDescription', form.shortDescription)
      payload.append('details', form.details)
      payload.append('tags', form.tags)
      payload.append('technology', form.technology)
      payload.append('liveUrl', form.liveUrl)
      payload.append('codeUrl', form.codeUrl)
      payload.append('iconClass', form.iconClass)

      if (screenshotFile) {
        payload.append('screenshot', screenshotFile)
      }

      if (editingId) {
        await axios.patch(`${apiBaseUrl}/update/${editingId}`, payload)
        setStatus('Project updated successfully.')
      } else {
        await axios.post(`${apiBaseUrl}/add`, payload)
        setStatus('Project added successfully.')
      }

      resetForm()
      fetchProjects()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save the project.')
    }
  }

  const handleEdit = (project) => {
    setEditingId(project._id)
    setForm({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      details: project.details || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      technology: project.technology || '',
      liveUrl: project.liveUrl || '',
      codeUrl: project.codeUrl || '',
      screenshot: project.screenshot ? 'Current screenshot attached' : '',
      iconClass: project.iconClass || 'fa-solid fa-clipboard-list',
    })
    setScreenshotFile(null)
    setStatus('Edit mode enabled.')
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/delete/${id}`)

      if (editingId === id) {
        resetForm()
      }

      setStatus('Project deleted successfully.')
      fetchProjects()
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete the project.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Module / Projects"
        title="Project Portfolio"
        description="Add, update, and remove portfolio projects that will appear on the public frontend."
      />

      <section className="content-grid content-grid-wide">
        <Panel eyebrow="Collection / Featured" title="Managed Projects">
          {loading ? <p className="status-text">Loading projects...</p> : null}
          {!loading && projects.length === 0 ? <p className="status-text">No projects have been saved yet.</p> : null}

          <div className="card-grid">
            {projects.map((project) => (
              <article key={project._id} className="project-card">
                <div className="panel-header">
                  <div className="skill-name-row">
                    <i className={project.iconClass || 'fa-solid fa-clipboard-list'} aria-hidden="true" />
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                </div>

                <div className="tag-row">
                  {(project.tags || []).map((tag) => (
                    <span key={`${project._id}-${tag}`} className="pill active">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="card-copy">{project.shortDescription}</p>

                <div className="list-stack compact">
                  <div className="signal-row">
                    <span>Technology</span>
                    <strong>{project.technology || 'Not Added'}</strong>
                  </div>
                  <div className="signal-row">
                    <span>Live Link</span>
                    <strong>{project.liveUrl ? 'Connected' : 'Not Added'}</strong>
                  </div>
                  <div className="signal-row">
                    <span>Code Link</span>
                    <strong>{project.codeUrl ? 'Connected' : 'Not Added'}</strong>
                  </div>
                  <div className="signal-row">
                    <span>Screenshot</span>
                    <strong>{project.screenshot ? 'Connected' : 'Not Added'}</strong>
                  </div>
                </div>

                <div className="skill-actions">
                  <button type="button" className="ghost-button" onClick={() => handleEdit(project)}>
                    Update Project
                  </button>
                  <button type="button" className="ghost-button danger-outline" onClick={() => handleDelete(project._id)}>
                    Remove Project
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <div className="page-stack">
          <Panel eyebrow="Manage / Project Form" title={editingId ? 'Update Project' : 'Add Project'}>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="icon-preview-card">
                <div className="icon-preview">
                  {form.iconClass ? <i className={form.iconClass} aria-hidden="true" /> : <MaterialIcon name="account_tree" />}
                </div>
                <div>
                  <strong>{form.title || 'Project Preview'}</strong>
                  <p className="field-hint">Use comma-separated tags, for example `MERN Stack, Academic`.</p>
                </div>
              </div>

              <FormField label="Project Title">
                <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="FYP-Management System" />
              </FormField>

              <FormField label="Short Description">
                <textarea
                  name="shortDescription"
                  rows="3"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="A short summary for the project card..."
                />
              </FormField>

              <FormField label="Project Details">
                <textarea
                  name="details"
                  rows="5"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Full project details that will appear when the project is opened."
                />
              </FormField>

              <FormField label="Tags">
                <input name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="MERN Stack, Academic" />
              </FormField>

              <FormField label="Technology Used">
                <input
                  name="technology"
                  type="text"
                  value={form.technology}
                  onChange={handleChange}
                  placeholder="MERN Stack"
                />
              </FormField>

              <FormField label="Live URL">
                <input name="liveUrl" type="text" value={form.liveUrl} onChange={handleChange} placeholder="https://your-live-project.com" />
              </FormField>

              <FormField label="Code URL">
                <input name="codeUrl" type="text" value={form.codeUrl} onChange={handleChange} placeholder="https://github.com/your-repo" />
              </FormField>

              <FormField label="Screenshot File">
                <input
                  name="screenshotFile"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                />
              </FormField>

              {form.screenshot ? <p className="field-hint">{form.screenshot}</p> : null}

              <FormField label="Icon Class" >
                <input
                  name="iconClass"
                  type="text"
                  value={form.iconClass}
                  onChange={handleChange}
                  placeholder="fa-solid fa-clipboard-list"
                />
              </FormField>

              {status ? <p className="status-text">{status}</p> : null}

              <div className="button-row">
                <button type="submit" className="primary-button">
                  {editingId ? 'Update Project' : 'Add Project'}
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
                <strong>/api/project/all</strong>
              </div>
              <div className="signal-row">
                <span>Add Route</span>
                <strong>/api/project/add</strong>
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
