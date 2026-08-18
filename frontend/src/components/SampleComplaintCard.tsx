import { FinanceIcon, ShieldLockIcon, SupportIcon, TechIcon } from './UiIcons'
import './SampleComplaintCard.css'

interface SampleComplaintCardProps {
  onSubmit: (complaint: string) => void
  loading: boolean
}

const SAMPLES = [
  { id: 'sample-1', Icon: FinanceIcon, text: 'मेरा पैसा दो बार कट गया है।', label: 'Payment charged twice', language: 'Hindi' },
  { id: 'sample-2', Icon: ShieldLockIcon, text: 'I cannot log into my account and password reset is not working.', label: 'Cannot access account', language: 'English' },
  { id: 'sample-3', Icon: SupportIcon, text: 'What are your customer service hours?', label: 'General inquiry', language: 'English' },
  { id: 'sample-4', Icon: TechIcon, text: 'डेटाबेस कनेक्शन त्रुटि है।', label: 'Database connection error', language: 'Hindi' },
]

export default function SampleComplaintCard({ onSubmit, loading }: SampleComplaintCardProps) {
  return (
    <div className="sample-card">
      <div className="sample-header">
        <h3 className="sample-title">QUICK TEST</h3>
        <p className="sample-subtitle">Click any example to test the system</p>
      </div>

      <div className="sample-grid">
        {SAMPLES.map((sample) => (
          <button key={sample.id} className="sample-item" onClick={() => onSubmit(sample.text)} disabled={loading} title={sample.text}>
            <div className="sample-emoji"><sample.Icon className="sample-svg" /></div>
            <div className="sample-info">
              <span className="sample-label">{sample.label}</span>
              <span className="sample-lang">{sample.language}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
