import { RouteComplaintResponse, ErrorResponse } from '../types'
import { CheckIcon, WarningIcon } from './UiIcons'
import './ResultCard.css'

interface ResultCardProps {
  result: RouteComplaintResponse | ErrorResponse
}

function isError(result: RouteComplaintResponse | ErrorResponse): result is ErrorResponse {
  return 'error' in result
}

export default function ResultCard({ result }: ResultCardProps) {
  if (isError(result)) {
    return (
      <div className="result-card error-card">
        <div className="result-badge error">
          <span className="badge-icon"><WarningIcon className="badge-svg" /></span>
          <span className="badge-text">Routing Failed</span>
        </div>
        <div className="result-content">
          <div className="ticket-header">
            <span className="ticket-label">Ticket</span>
            <span className="ticket-id">{result.id}</span>
          </div>
          <div className="error-section"><p className="error-message">{result.error}</p></div>
          <div className="result-row"><span className="row-label">Fallback Queue</span><span className="row-value fallback-queue">{result.fallback_department}</span></div>
          <div className="result-row"><span className="row-label">Timestamp</span><span className="row-value">{result.timestamp}</span></div>
        </div>
      </div>
    )
  }

  const response = result as RouteComplaintResponse
  const priorityConfig = {
    High: { color: '#ef4444', bg: '#fee2e2' },
    Medium: { color: '#f59e0b', bg: '#fef3c7' },
    Low: { color: '#10b981', bg: '#ecfdf5' },
  }
  const priority = priorityConfig[response.priority as keyof typeof priorityConfig] || priorityConfig.Medium

  return (
    <div className="result-card success-card">
      <div className="result-badge success">
        <span className="badge-icon"><CheckIcon className="badge-svg" /></span>
        <span className="badge-text">Routed Successfully</span>
      </div>
      <div className="result-content">
        <div className="ticket-header">
          <span className="ticket-label">Ticket</span>
          <span className="ticket-id">{response.id}</span>
        </div>
        <div className="primary-result">
          <div className="department-block">
            <span className="block-label">Routed To</span>
            <span className="block-value department">{response.routed_department}</span>
          </div>
          <div className="priority-block" style={{ background: priority.bg, borderLeftColor: priority.color }}>
            <span className="block-label">Priority</span>
            <span className="block-value" style={{ color: priority.color }}>{response.priority}</span>
          </div>
        </div>
        <div className="analysis-section">
          <div className="section-title">AI Analysis</div>
          <div className="result-row"><span className="row-label">Language Detected</span><span className="row-value language-badge">{response.detected_language}</span></div>
          <div className="result-row"><span className="row-label">Category</span><span className="row-value">{response.complaint_category}</span></div>
          <div className="result-row full-width"><span className="row-label">Translation</span><p className="translation-text">{response.translated_text}</p></div>
        </div>
        <div className="metadata-section">
          <div className="result-row"><span className="row-label">AI Confidence</span><div className="confidence-container"><div className="confidence-bar"><div className="confidence-fill" style={{ width: `${response.confidence * 100}%` }}></div></div><span className="confidence-text">{(response.confidence * 100).toFixed(0)}%</span></div></div>
          <div className="result-row"><span className="row-label">Processing Source</span><span className={`source-badge ${response.source || 'api'}`}>{(response.source || 'api').toUpperCase()}</span></div>
          <div className="result-row"><span className="row-label">Timestamp</span><span className="row-value">{response.timestamp}</span></div>
        </div>
      </div>
    </div>
  )
}
