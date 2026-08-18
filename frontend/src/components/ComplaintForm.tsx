import { useState } from 'react'
import './ComplaintForm.css'

interface ComplaintFormProps {
  onSubmit: (complaint: string) => void
  loading: boolean
}

export default function ComplaintForm({ onSubmit, loading }: ComplaintFormProps) {
  const [complaint, setComplaint] = useState('')
  const charCount = complaint.length
  const maxChars = 1000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (complaint.trim()) {
      onSubmit(complaint)
      setComplaint('')
    }
  }

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">New Complaint</h2>
        <p className="form-description">
          Submit a complaint in English or Hindi. Our AI will detect the language, translate it, classify the issue, and route it to the appropriate team.
        </p>
      </div>

      <div className="form-field">
        <label htmlFor="complaint" className="form-label">
          Complaint Description
          <span className="required">*</span>
        </label>
        <textarea
          id="complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value.slice(0, maxChars))}
          placeholder="Describe your issue here... (English or Hindi)"
          disabled={loading}
          rows={6}
          className="complaint-textarea"
          aria-label="Complaint textarea"
        />
        <div className="form-meta">
          <span className={`char-count ${charCount > maxChars * 0.9 ? 'warning' : ''}`}>
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !complaint.trim()}
        className="submit-button"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          <>
            <span className="icon">→</span>
            Route Complaint
          </>
        )}
      </button>

      <div className="form-hint">
        <p>💡 Supported languages: English, Hindi</p>
      </div>
    </form>
  )
}
