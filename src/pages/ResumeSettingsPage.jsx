import { useEffect, useState } from 'react'
import axios from 'axios'
import { MaterialIcon, PageHeader, Panel } from '../components/ui'
import { securitySettings } from '../data/adminData'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://portfolio-backend-eight-mu.vercel.app'

export default function ResumeSettingsPage({ mode = 'resume' }) {
  const isSettings = mode === 'settings'

  const [resume, setResume] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(!isSettings)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const token = localStorage.getItem('token') // 🔐 TOKEN ADDED

  const fetchResume = async () => {
    try {
      setIsLoading(true)

      const response = await axios.get(`${API_BASE_URL}/api/resume`)

      setResume(response.data.resume || null)
    } catch (error) {
      setResume(null)
      setStatus(
        error.response?.data?.message ||
          'Unable to load the current resume.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isSettings) {
      fetchResume()
    }
  }, [isSettings])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setResumeFile(file)
    setStatus(file ? `${file.name} selected and ready to upload.` : '')
  }

  // 🔐 UPLOAD (PROTECTED)
  const handleUpload = async () => {
    if (!resumeFile) {
      setStatus('Please select a PDF resume first.')
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await axios.post(
        `${API_BASE_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setResume(response.data.resume || null)
      setResumeFile(null)
      setStatus(response.data.message || 'Resume uploaded successfully.')
    } catch (error) {
      setStatus(
        error.response?.data?.message || 'Unable to upload the resume.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  // 🔐 DELETE (PROTECTED)
  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await axios.delete(
        `${API_BASE_URL}/api/resume/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setResume(null)
      setResumeFile(null)
      setStatus(response.data.message || 'Resume deleted successfully.')
    } catch (error) {
      setStatus(
        error.response?.data?.message || 'Unable to delete the resume.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        meta="Terminal / Resume & System"
        title={isSettings ? 'Security & System' : 'Resume Management'}
        description={
          isSettings
            ? 'Configure secure access, session control, and protected admin workflows.'
            : 'Upload your public resume to ImageKit and manage download availability.'
        }
      />

      {!isSettings && (
        <Panel
          eyebrow="Section / Resume Management"
          title={resume?.fileName || 'No Resume Uploaded'}
        >
          <div className="resume-card">
            <MaterialIcon name="description" className="resume-icon" />
            <div className="resume-copy">
              <strong>
                {resume
                  ? 'Current resume is ready for download'
                  : 'No resume has been uploaded yet'}
              </strong>
              <p>
                {isLoading
                  ? 'Checking resume status...'
                  : resume
                  ? 'This PDF is stored in ImageKit and connected to the public download button.'
                  : 'Upload a PDF resume to make the public CV button downloadable.'}
              </p>
            </div>
          </div>

          <div className="page-stack">
            <label className="field">
              <span className="field-label">Resume File</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </label>

            {status && <p className="status-text">{status}</p>}
          </div>

          <div className="button-row">
            <button
              type="button"
              className="primary-button"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading
                ? 'Uploading...'
                : resume
                ? 'Replace Resume'
                : 'Upload Resume'}
            </button>

            <button
              type="button"
              className="ghost-button"
              onClick={() =>
                window.open(
                  `${API_BASE_URL}/api/resume/download`,
                  '_blank'
                )
              }
            >
              Download Test
            </button>

            <button
              type="button"
              className="ghost-button danger-outline"
              onClick={handleDelete}
              disabled={!resume || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Resume'}
            </button>
          </div>
        </Panel>
      )}

      <Panel eyebrow="Section / Security" title="Security & System">
        <div className="list-stack">
          {securitySettings.map((item) => (
            <div key={item.title} className="setting-row">
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        <button type="button" className="danger-card">
          <div>
            <strong>Terminate Session</strong>
            <p>
              Force logout from all signed-in devices and reset the current
              admin token.
            </p>
          </div>
          <MaterialIcon name="power_settings_new" />
        </button>
      </Panel>
    </div>
  )
}
