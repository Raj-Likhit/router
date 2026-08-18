import { CircleDotIcon } from './UiIcons'
import './Header.css'

interface HeaderProps {
  totalRouted: number
}

export default function Header({ totalRouted }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="brand-name">OMNIROUTE AI</h1>
          <p className="brand-subtitle">Multilingual Complaint Intelligence</p>
        </div>

        <div className="header-status">
          <div className="status-item">
            <span className="status-indicator">
              <CircleDotIcon className="status-icon" />
            </span>
            <span className="status-text">SYSTEM ONLINE</span>
          </div>
          <div className="status-divider"></div>
          <div className="status-item">
            <span className="status-label">ROUTED</span>
            <span className="status-value">{totalRouted}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
