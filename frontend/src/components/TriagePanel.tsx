import { RouteComplaintResponse, ErrorResponse } from '../types'
import { ArrowRightIcon, CircleDotIcon, EmptyIcon, UserSearchIcon, WarningIcon } from './UiIcons'
import './TriagePanel.css'

interface TriagePanelProps {
  loading: boolean
  processingSteps: Array<{
    step: string
    completed: boolean
    value?: string
  }>
  result: RouteComplaintResponse | ErrorResponse | null
  error: string | null
}

function isError(result: RouteComplaintResponse | ErrorResponse): result is ErrorResponse {
  return 'error' in result
}

const stepLabels: Record<string, string> = {
  language: 'Language Detected',
  translation: 'Translation',
  classification: 'Classification',
  priority: 'Priority',
  routing: 'Routing',
}

export default function TriagePanel({ loading, processingSteps, result, error }: TriagePanelProps) {
  if (error) {
    return (
      <div className="triage-panel error-state">
        <div className="triage-header">
          <h2 className="triage-title">AI TRIAGE</h2>
        </div>
        <div className="error-content">
          <div className="error-icon">
            <WarningIcon className="panel-icon" />
          </div>
          <p className="error-text">{error}</p>
          <div className="fallback-notice">
            <span className="notice-label">FALLBACK</span>
            <span className="notice-value">Manual Review</span>
          </div>
        </div>
      </div>
    )
  }

  if (!result && !loading) {
    return (
      <div className="triage-panel empty-state">
        <div className="triage-header">
          <h2 className="triage-title">AI TRIAGE</h2>
        </div>
        <div className="empty-content">
          <div className="empty-icon">
            <EmptyIcon className="panel-icon" />
          </div>
          <p className="empty-title">NO ACTIVE TRIAGE</p>
          <p className="empty-subtitle">Submit a complaint to begin intelligent analysis</p>
        </div>
      </div>
    )
  }

  if (loading || !result) {
    return (
      <div className="triage-panel processing-state">
        <div className="triage-header">
          <h2 className="triage-title">AI TRIAGE</h2>
        </div>
        <div className="processing-rail">
          {processingSteps.map((step, idx) => (
            <div key={step.step} className="processing-step">
              <div className={`step-indicator ${step.completed ? 'completed' : ''}`}>
                <CircleDotIcon className={`step-icon ${step.completed ? 'completed' : ''}`} />
              </div>
              <div className="step-content">
                <span className="step-label">{stepLabels[step.step]}</span>
                {step.value && <span className="step-value">{step.value}</span>}
              </div>
              {idx < processingSteps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isErrorResult = isError(result)

  if (isErrorResult) {
    return (
      <div className="triage-panel manual-review-state">
        <div className="triage-header">
          <h2 className="triage-title">HUMAN REVIEW REQUIRED</h2>
        </div>
        <div className="manual-content">
          <div className="review-icon">
            <UserSearchIcon className="panel-icon" />
          </div>
          <p className="review-text">The system could not safely classify this complaint.</p>
          <div className="review-queue">
            <span className="queue-arrow">
              <ArrowRightIcon className="queue-icon" />
            </span>
            <span className="queue-destination">MANUAL REVIEW</span>
          </div>
          <div className="ticket-footer">
            <span className="ticket-id">{result.id}</span>
            <span className="timestamp">{result.timestamp}</span>
          </div>
        </div>
      </div>
    )
  }

  const routedResult = result as RouteComplaintResponse
  const priorityClass = routedResult.priority.toLowerCase()

  return (
    <div className="triage-panel result-state">
      <div className="triage-header">
        <h2 className="triage-title">ROUTING COMPLETE</h2>
      </div>

      <div className="triage-content">
        <div className="routing-result">
          <div className="result-box">
            <span className="result-label">ROUTED TO</span>
            <span className="result-department">{routedResult.routed_department}</span>
            <div className="result-meta">
              <span className="meta-category">{routedResult.complaint_category}</span>
              <span className={`meta-priority priority-${priorityClass}`}>
                {routedResult.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-details">
          <div className="detail-row">
            <span className="detail-label">Language</span>
            <span className="detail-value">{routedResult.detected_language}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Translation</span>
            <span className="detail-value translation">{routedResult.translated_text}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Confidence</span>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${((routedResult.confidence || 0.85) * 100).toFixed(0)}%`,
                }}
              ></div>
              <span className="confidence-text">
                {((routedResult.confidence || 0.85) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="result-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Ticket</span>
            <span className="metadata-value ticket-id-display">{routedResult.id}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Source</span>
            <span className={`metadata-value source-badge source-${routedResult.source || 'api'}`}>
              {(routedResult.source || 'API').toUpperCase()}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Time</span>
            <span className="metadata-value">{routedResult.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
