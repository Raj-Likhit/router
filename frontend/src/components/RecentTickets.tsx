import { Ticket } from '../types'
import './RecentTickets.css'

interface RecentTicketsProps {
  tickets: Ticket[]
}

export default function RecentTickets({ tickets }: RecentTicketsProps) {
  return (
    <div className="recent-tickets">
      <div className="recent-header">
        <h2 className="recent-title">RECENTLY ROUTED</h2>
        <span className="recent-count">{tickets.length}</span>
      </div>

      <div className="tickets-list">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-row">
            <div className="ticket-col ticket-id">
              <span className="ticket-id-badge">{ticket.id}</span>
              <span className="ticket-lang">{ticket.detectedLanguage}</span>
            </div>

            <div className="ticket-col ticket-category">
              <span className="category-text">{ticket.complaintCategory}</span>
            </div>

            <div className="ticket-col ticket-complaint">
              <span className="complaint-text">{ticket.translatedText}</span>
            </div>

            <div className="ticket-col ticket-priority">
              <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>

            <div className="ticket-col ticket-department">
              <span className="department-text">{ticket.routedDepartment}</span>
            </div>

            <div className="ticket-col ticket-time">
              <span className="time-text">{ticket.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
