export function MaterialIcon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>
}

export function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || eyebrow || action) && (
        <div className="panel-header">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="panel-title">{title}</h2> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}

export function PageHeader({ title, description, meta }) {
  return (
    <header className="page-header">
      <div>
        {meta ? <p className="eyebrow">{meta}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-copy">{description}</p> : null}
      </div>
    </header>
  )
}

export function StatCard({ label, value, meta, icon, tone = 'cyan' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon-wrap">
        <MaterialIcon name={icon} className="stat-icon" />
      </div>
      <p className="stat-label">{label}</p>
      <div className="stat-row">
        <strong>{value}</strong>
        <span>{meta}</span>
      </div>
    </div>
  )
}

export function FormField({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  )
}

export function ProgressBar({ value }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  )
}
