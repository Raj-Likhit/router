import { FinanceIcon, ShieldLockIcon, SupportIcon, TechIcon } from './UiIcons'
import './SampleButtons.css'

interface SampleButtonsProps {
  onSubmit: (complaint: string) => void
  loading: boolean
}

const SAMPLES = [
  { id: 'sample-1', text: 'मेरा पैसा दो बार कट गया है।', label: 'Billing Issue', sublabel: 'Hindi', Icon: FinanceIcon },
  { id: 'sample-2', text: 'I cannot log into my account and password reset is not working.', label: 'Security Issue', sublabel: 'English', Icon: ShieldLockIcon },
  { id: 'sample-3', text: 'What are your customer service hours?', label: 'General Question', sublabel: 'English', Icon: SupportIcon },
  { id: 'sample-4', text: 'डेटाबेस कनेक्शन त्रुटि है।', label: 'Technical Support', sublabel: 'Hindi', Icon: TechIcon },
]

export default function SampleButtons({ onSubmit, loading }: SampleButtonsProps) {
  return (
    <div className="sample-buttons">
      <div className="samples-header">
        <h3 className="samples-title">Try Examples</h3>
        <p className="samples-subtitle">Click any example to test the routing system</p>
      </div>
      <div className="button-grid">
        {SAMPLES.map((sample) => (
          <button key={sample.id} onClick={() => onSubmit(sample.text)} disabled={loading} className="sample-button" title={sample.text}>
            <span className="sample-icon"><sample.Icon className="sample-svg" /></span>
            <div className="sample-content">
              <div className="sample-label">{sample.label}</div>
              <div className="sample-lang">{sample.sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
