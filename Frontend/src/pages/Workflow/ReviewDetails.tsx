import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useRef } from 'react'
import './ReviewDetails.css'

interface Checkpoint {
  name: string
  desc: string
  exception: string
  justification: string
}

const INITIAL_CHECKPOINTS: Checkpoint[] = [
  { name:'Risk Level Check',         desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'User Access Validation',   desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'Data Integrity Check',     desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'Audit Trail Verification', desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'System Suitability RSD',   desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'Peak Tailing Factor',      desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'Sample Set Finished Date', desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
  { name:'Acquisition Time Breaks',  desc:'Risk Level shows how sensitive a privilege is. Low-risk privileges are mostly view-only, medium-risk privileges allow normal changes, and high-risk', exception:'Yes', justification:'' },
]

export default function RecordReviewDetails() {
  const { state }  = useLocation()
  const { id }     = useParams()
  const navigate   = useNavigate()
  const inputRefs  = useRef<(HTMLInputElement | null)[]>([])

  const recordName  = state?.recordName || 'QC_VALIDATION_210'
  const recordPath  = state?.path       || '2024/Data_Integrity/MAR'

  const [checkpoints,     setCheckpoints]     = useState<Checkpoint[]>(INITIAL_CHECKPOINTS)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [historyModal,    setHistoryModal]    = useState<{ name: string } | null>(null)

  function update(i: number, field: keyof Checkpoint, value: string) {
    setCheckpoints(prev => prev.map((cp, idx) => idx === i ? { ...cp, [field]: value } : cp))
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      const next = inputRefs.current[i + 1]
      if (next) next.focus()
    }
  }

  function handleSubmit() {
    setSubmitAttempted(true)
    const invalid = checkpoints.some(cp => cp.exception && cp.exception !== 'No' && !cp.justification.trim())
    if (invalid) return

    const report = {
      id:           Date.now(),
      path:         recordPath,
      recordName,
      jobId:        state?.jobId        || 'N/A',
      scheduleType: state?.scheduleType || 'N/A',
      validationOn: new Date().toLocaleString(),
      status:       'Completed',
      auditTrail:   checkpoints.map(cp => ({
        checkpoint:    cp.name,
        exception:     cp.exception || 'No',
        justification: cp.justification,
        furtherReview: cp.exception === 'Further Review' ? 'Yes' : 'No',
      })),
    }

    const old = JSON.parse(localStorage.getItem('submittedReports') || '[]')
    localStorage.setItem('submittedReports', JSON.stringify([...old, report]))
    navigate('/audit/report')
  }

  return (
    <div className="rd-page">

      {/* ── Top header bar ── */}
      <div className="rd-header">
        <div className="rd-header__text">
          <div className="rd-header__name">{recordName}</div>
          <div className="rd-header__sub">{recordPath}</div>
        </div>
        <div className="rd-header__actions">
          <button className="rd-icon-btn" onClick={() => navigate(-1)} title="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className="rd-icon-btn" title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button className="rd-icon-btn rd-icon-btn--close" onClick={() => navigate(-1)} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="rd-content">
        <div className="rd-card">

          {/* Card header — "Review" + tool buttons */}
          <div className="rd-card-header">
            <span className="rd-card-title">Review</span>
            <div className="rd-card-tools">
              <button className="rd-icon-btn" title="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
              <button className="rd-icon-btn" title="Filter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="rd-divider" />

          {/* Table */}
          <div className="rd-table-scroll">
            <table className="rd-table">
              <thead>
                <tr>
                  <th className="rd-th rd-th--sno">S.NO.</th>
                  <th className="rd-th rd-th--desc">Check point description</th>
                  <th className="rd-th rd-th--exc">Exception</th>
                  <th className="rd-th rd-th--just">Justification</th>
                  <th className="rd-th rd-th--hist">History</th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp, idx) => {
                  const needsJust = cp.exception && cp.exception !== 'No'
                  const hasError  = submitAttempted && !!needsJust && !cp.justification.trim()
                  const isLast    = idx === checkpoints.length - 1

                  return (
                    <tr key={idx} className={`rd-tr${isLast ? ' rd-tr--alt' : ''}`}>

                      {/* S.NO */}
                      <td className="rd-td rd-td--sno">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Description */}
                      <td className="rd-td rd-td--desc">
                        <p>{cp.desc}</p>
                      </td>

                      {/* Exception dropdown */}
                      <td className="rd-td rd-td--exc">
                        <div className="rd-select-wrap">
                          <select
                            className="rd-select"
                            value={cp.exception}
                            onChange={e => update(idx, 'exception', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Further Review">Further Review</option>
                          </select>
                          <svg className="rd-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>
                      </td>

                      {/* Justification */}
                      <td className="rd-td rd-td--just">
                        <div className="rd-just-cell">
                          {/* Red asterisk badge */}
                          {needsJust && (
                            <span className="rd-asterisk-badge" aria-hidden>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d92d20" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="12" y1="2" x2="12" y2="22"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/>
                              </svg>
                            </span>
                          )}
                          <input
                            ref={el => { inputRefs.current[idx] = el }}
                            className={`rd-just-input${hasError ? ' rd-just-input--error' : ''}${!needsJust ? ' rd-just-input--disabled' : ''}`}
                            placeholder="Enter a justification..."
                            value={cp.justification}
                            disabled={!needsJust}
                            onChange={e => update(idx, 'justification', e.target.value)}
                            onKeyDown={e => handleKeyDown(e, idx)}
                          />
                          {idx === 0 && needsJust && (
                            <span className="rd-key-hint">⌘ + Enter to Next</span>
                          )}
                        </div>
                        {hasError && <div className="rd-err">Justification is required</div>}
                      </td>

                      {/* History */}
                      <td className="rd-td rd-td--hist">
                        <button className="rd-view-btn" onClick={() => setHistoryModal({ name: cp.name })}>
                          View
                        </button>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="rd-divider" />

          {/* Card footer — pagination placeholder (not data-driven, visual only) */}
          <div className="rd-card-footer">
            {submitAttempted && checkpoints.some(cp => cp.exception && cp.exception !== 'No' && !cp.justification.trim()) && (
              <span className="rd-footer-warn">Please fill all required justifications</span>
            )}
          </div>

        </div>
      </div>

      {/* ── Bottom footer — Cancel / Submit ── */}
      <div className="rd-footer">
        <div className="rd-footer__right">
          <button className="rd-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button className="rd-btn-submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {/* ── History Modal ── */}
      {historyModal && (
        <div className="rd-backdrop" onClick={() => setHistoryModal(null)}>
          <div className="rd-modal" onClick={e => e.stopPropagation()}>
            <div className="rd-modal__head">
              <span className="rd-modal__title">History — {historyModal.name}</span>
              <button className="rd-icon-btn rd-icon-btn--close" onClick={() => setHistoryModal(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="rd-modal__body">
              <table className="rd-hist-table">
                <thead>
                  <tr>
                    <th>S.No.</th><th>Exception</th><th>Justification</th><th>Reviewed By</th><th>Reviewed On</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{checkpoints.find(c => c.name === historyModal.name)?.exception || '—'}</td>
                    <td>{checkpoints.find(c => c.name === historyModal.name)?.justification || '—'}</td>
                    <td>system</td>
                    <td className="rd-hist-mono">20-03-2026 10:13:59</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rd-modal__foot">
              <button className="rd-btn-cancel" onClick={() => setHistoryModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}