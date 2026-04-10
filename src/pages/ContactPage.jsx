import { contactMethods } from '../data/adminData'
import { FormField, MaterialIcon, PageHeader, Panel } from '../components/ui'

export default function ContactPage() {
  return (
    <div className="page-stack">
      <PageHeader
        meta="Section / Contact Management"
        title="Contact Management"
        description="Update public touchpoints, outbound call-to-actions, and social channels shown on the portfolio."
      />

      <section className="content-grid">
        <Panel eyebrow="Directory / Live Links" title="Public Contact Channels">
          <div className="list-stack">
            {contactMethods.map((item) => (
              <div key={item.label} className="contact-row">
                <div className="contact-icon">
                  <MaterialIcon name={item.icon} />
                </div>
                <div className="contact-copy">
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Editor / Outreach" title="Primary Contact Form">
          <form className="form-grid">
            <FormField label="Headline">
              <input type="text" defaultValue="Let's build something bold together." />
            </FormField>
            <FormField label="Response Time">
              <input type="text" defaultValue="Within 24 hours" />
            </FormField>
            <FormField label="CTA Copy">
              <textarea rows="4" defaultValue="Tell me about your project, product, or idea. I will review it and get back with the right next step." />
            </FormField>
            <button type="submit" className="primary-button">
              Save Contact Settings
            </button>
          </form>
        </Panel>
      </section>
    </div>
  )
}
