import { ArrowRightIcon } from './UiIcons'
import './ComplaintComposer.css'

interface ComplaintComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (complaint: string) => void
  loading: boolean
}

export default function ComplaintComposer({ value, onChange, onSubmit, loading }: ComplaintComposerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSubmit(value)
  }

  return (
    <div className="complaint-composer">
      <div className="composer-header">
        <h2 className="composer-title">INCOMING COMPLAINT</h2>
        <p className="composer-hint">Paste or type in English or Hindi</p>
      </div>

      <form onSubmit={handleSubmit} className="composer-form">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the customer complaint..."
          disabled={loading}
          className="composer-textarea"
          rows={8}
        />

        <div className="composer-footer">
          <div className="language-auto">
            <span className="auto-label">Language detection</span>
            <span className="auto-value">AUTOMATIC</span>
          </div>

          <button type="submit" disabled={loading || !value.trim()} className="route-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <ArrowRightIcon className="button-arrow" />
                Route Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
