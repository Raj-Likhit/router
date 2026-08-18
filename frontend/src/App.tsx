import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import ComplaintComposer from './components/ComplaintComposer'
import TriagePanel from './components/TriagePanel'
import SampleComplaintCard from './components/SampleComplaintCard'
import QueueBoard from './components/QueueBoard'
import RecentTickets from './components/RecentTickets'
import { ArrowRightIcon, CheckIcon, ShieldLockIcon, TechIcon, FinanceIcon } from './components/UiIcons'
import { RouteComplaintResponse, ErrorResponse, QueueCount, Ticket } from './types'
import './App.css'

interface ProcessingStep {
  step: 'language' | 'translation' | 'classification' | 'priority' | 'routing'
  completed: boolean
  value?: string
}

function App() {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { step: 'language', completed: false },
    { step: 'translation', completed: false },
    { step: 'classification', completed: false },
    { step: 'priority', completed: false },
    { step: 'routing', completed: false },
  ])
  const [currentResult, setCurrentResult] = useState<RouteComplaintResponse | ErrorResponse | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [queues, setQueues] = useState<QueueCount>({
    'Finance Team': 0,
    'Tech Support Queue': 0,
    'Security & Access': 0,
    'General Support': 0,
    'Manual Review': 0,
  })
  const [error, setError] = useState<string | null>(null)
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'

  const simulateProcessing = (data: RouteComplaintResponse) => {
    const steps: ProcessingStep[] = [
      { step: 'language', completed: true, value: data.detected_language },
      { step: 'translation', completed: false },
      { step: 'classification', completed: false },
      { step: 'priority', completed: false },
      { step: 'routing', completed: false },
    ]

    setProcessingSteps(steps)

    const delays = [300, 600, 900, 1200]
    delays.forEach((delay, idx) => {
      setTimeout(() => {
        setProcessingSteps(prev => {
          const updated = [...prev]
          updated[idx + 1].completed = true
          if (idx === 0) updated[idx + 1].value = 'Complete'
          if (idx === 1) updated[idx + 1].value = data.complaint_category
          if (idx === 2) updated[idx + 1].value = data.priority
          if (idx === 3) {
            const routedValue = (data as any).fallback_department || (data as any).routed_department || ''
            updated[idx + 1].value = routedValue
          }
          return updated
        })
      }, delay)
    })
  }

  const handleComplaintSubmit = async (complaint: string) => {
    if (!complaint.trim()) return

    setError(null)
    setLoading(true)
    setInputText('')
    setCurrentResult(null)
    setProcessingSteps([
      { step: 'language', completed: false },
      { step: 'translation', completed: false },
      { step: 'classification', completed: false },
      { step: 'priority', completed: false },
      { step: 'routing', completed: false },
    ])

    try {
      const response = await fetch(`${API_URL}/api/route-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint }),
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await response.json()
        : null

      if (response.ok && data && ('routed_department' in data || 'fallback_department' in data)) {
        const isError = 'error' in data
        const department = isError ? data.fallback_department : data.routed_department

        // Simulate processing steps
        simulateProcessing(data as RouteComplaintResponse)

        // After processing animation, set result
        setTimeout(() => {
          setCurrentResult(data as RouteComplaintResponse | ErrorResponse)

          // Update queue
          setQueues(prev => ({
            ...prev,
            [department]: (prev[department] || 0) + 1,
          }))

          // Add to recent tickets if successful
          if (!isError && 'complaint_category' in data) {
            const ticket: Ticket = {
              id: data.id,
              originalText: complaint,
              detectedLanguage: data.detected_language,
              translatedText: data.translated_text,
              complaintCategory: data.complaint_category,
              routedDepartment: data.routed_department,
              priority: data.priority,
              timestamp: data.timestamp,
              source: data.source || 'api',
              status: 'routed',
            }
            setTickets(prev => [ticket, ...prev].slice(0, 10))
          }
        }, 1500)
      } else {
        throw new Error(data?.error || `HTTP ${response.status}`)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(null)
      const fallbackResult: ErrorResponse = {
        id: 'ERROR',
        error: 'Connection failed. Please try again.',
        fallback_department: 'Manual Review',
        timestamp: new Date().toLocaleTimeString(),
      }
      setCurrentResult(fallbackResult)
      setQueues(prev => ({
        ...prev,
        'Manual Review': (prev['Manual Review'] || 0) + 1,
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header totalRouted={Object.values(queues).reduce((a, b) => a + b, 0)} />

      <div className="app-container">
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow">Bilingual intake engine</div>
            <h1>Turn messy complaints into clean departmental action.</h1>
            <p className="hero-text">
              OmniRoute reads English or Hindi, translates the message, classifies the issue, and pushes it to the right queue before your team even blinks.
            </p>

            <div className="hero-actions">
              <button className="primary-cta" onClick={() => document.getElementById('demo-console')?.scrollIntoView({ behavior: 'smooth' })}>
                Launch the demo
                <ArrowRightIcon className="cta-icon" />
              </button>
              <div className="hero-proof">
                <CheckIcon className="proof-icon" />
                <span>Designed for support ops, not generic AI chat</span>
              </div>
            </div>

            <div className="hero-ribbon">
              <span>ENGLISH</span>
              <span>HINDI</span>
              <span>TRANSLATE</span>
              <span>CLASSIFY</span>
              <span>ROUTE</span>
            </div>
          </div>

          <div className="hero-stack">
            <div className="signal-rail">
              <div className="signal-row signal-high">
                <span className="signal-tag">INCOMING</span>
                <strong>“Mera paisa do baar kat gaya”</strong>
                <span className="signal-meta">Hindi complaint</span>
              </div>
              <div className="signal-arrow">
                <ArrowRightIcon className="flow-icon" />
              </div>
              <div className="signal-row signal-mid">
                <span className="signal-tag">UNDERSTOOD</span>
                <strong>My payment was deducted twice.</strong>
                <span className="signal-meta">English translation</span>
              </div>
              <div className="signal-arrow">
                <ArrowRightIcon className="flow-icon" />
              </div>
              <div className="signal-row signal-low">
                <span className="signal-tag">ROUTED</span>
                <strong>Finance Team</strong>
                <span className="signal-meta">Billing & Payments</span>
              </div>
            </div>
            <div className="hero-card hero-card-floating">
              <div className="hero-card-label">Instant visibility</div>
              <div className="hero-card-title">Every complaint gets a language, a category, and a queue</div>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <div className="feature-card feature-card-left">
            <span className="feature-kicker">01</span>
            <h3>Recognize the language instantly.</h3>
            <p>English and Hindi are detected at the door, so support does not start with a guess.</p>
          </div>
          <div className="feature-card feature-card-center">
            <span className="feature-kicker">02</span>
            <h3>Translate into a support-ready signal.</h3>
            <p>The complaint is normalized into English for the internal workflow and team handoff.</p>
          </div>
          <div className="feature-card feature-card-right">
            <span className="feature-kicker">03</span>
            <h3>Route to the right queue with authority.</h3>
            <p>Billing, technical, security, and general issues move into clear operational lanes.</p>
          </div>
        </section>

        <section className="demo-shell" id="demo-console">
          <div className="demo-shell-header">
            <div>
              <div className="eyebrow">Interactive console</div>
              <h2>Watch the intake pipeline in real time</h2>
            </div>
            <p>
              A complaint is captured on the left, classified in the middle, and immediately reflected in the queue board below.
            </p>
          </div>

          <div className="hero-section">
            <div className="hero-left">
              <ComplaintComposer
                value={inputText}
                onChange={setInputText}
                onSubmit={handleComplaintSubmit}
                loading={loading}
              />
              <SampleComplaintCard onSubmit={handleComplaintSubmit} loading={loading} />
            </div>

            <div className="hero-right">
              <TriagePanel
                loading={loading}
                processingSteps={processingSteps}
                result={currentResult}
                error={error}
              />
            </div>
          </div>
        </section>

        {/* Queue Dashboard */}
        <section className="queues-section">
          <QueueBoard queues={queues} />
        </section>

        {/* Recent Tickets */}
        {tickets.length > 0 && (
          <section className="recent-section">
            <RecentTickets tickets={tickets} />
          </section>
        )}
      </div>
    </div>
  )
}

export default App
