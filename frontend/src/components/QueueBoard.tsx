import { QueueCount } from '../types'
import { FinanceIcon, ShieldLockIcon, SupportIcon, TechIcon, UserSearchIcon } from './UiIcons'
import './QueueBoard.css'

interface QueueBoardProps {
  queues: QueueCount
}

const QUEUE_CONFIG: Record<string, { color: string; label: string; icon: JSX.Element }> = {
  'Finance Team': { color: '#0ea5e9', icon: <FinanceIcon className="queue-svg" />, label: 'FINANCE' },
  'Tech Support Queue': { color: '#f59e0b', icon: <TechIcon className="queue-svg" />, label: 'TECHNICAL' },
  'Security & Access': { color: '#ef4444', icon: <ShieldLockIcon className="queue-svg" />, label: 'SECURITY' },
  'General Support': { color: '#10b981', icon: <SupportIcon className="queue-svg" />, label: 'GENERAL' },
  'Manual Review': { color: '#64748b', icon: <UserSearchIcon className="queue-svg" />, label: 'REVIEW' },
}

export default function QueueBoard({ queues }: QueueBoardProps) {
  const totalTickets = Object.values(queues).reduce((a, b) => a + b, 0)

  return (
    <div className="queue-board">
      <div className="board-header">
        <h2 className="board-title">LIVE ROUTING QUEUES</h2>
        <div className="board-total">
          <span className="total-label">TOTAL</span>
          <span className="total-count">{totalTickets}</span>
        </div>
      </div>

      <div className="queues-container">
        <div className="queue-grid">
          {Object.entries(queues).map(([department, count]) => {
            const config = QUEUE_CONFIG[department]
            return (
              <div
                key={department}
                className={`queue-tile ${count > 0 ? 'active' : ''}`}
                style={{ '--queue-color': config.color } as React.CSSProperties}
              >
                <div className="tile-icon">{config.icon}</div>
                <div className="tile-label">{config.label}</div>
                <div className="tile-count">{count}</div>
                {count > 0 && <div className="tile-pulse"></div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
