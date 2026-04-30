import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Review.css'
import './AgentLogs.css'

/* ─── Types ─────────────────────────────────────────────────────── */
interface LogEntry {
  sno: number
  dateTime: string
  logType: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' | 'SUCCESS'
  message: string
  additionalInfo: string
}

interface AgentRow {
  id: number
  hostName: string
  plant: string
  module: string
  jobId: string
  scheduler: string
  errorCount: number
  startDate: string
  endDate: string
  status: 'Running' | 'Completed' | 'Failed' | 'Idle' | 'Stopped'
  logs: LogEntry[]
}

/* ─── Mock data ──────────────────────────────────────────────────── */
const AGENT_ROWS: AgentRow[] = [
  {
    id: 1, hostName: 'AGENT-HOST-01', plant: 'Plant A', module: 'Chromeleon',
    jobId: 'BCPID_260319', scheduler: 'Batch', errorCount: 0,
    startDate: 'Apr 17, 09:00 AM', endDate: 'Apr 17, 10:20 AM', status: 'Completed',
    logs: [
      { sno:1, dateTime:'2026-04-17 09:00:01', logType:'INFO',    message:'Agent started successfully',              additionalInfo:'Host: AGENT-HOST-01, PID: 12345' },
      { sno:2, dateTime:'2026-04-17 09:00:05', logType:'INFO',    message:'Connecting to Chromeleon server',         additionalInfo:'Server: chrom-srv-01:8080' },
      { sno:3, dateTime:'2026-04-17 09:00:08', logType:'SUCCESS', message:'Connected to Chromeleon server',          additionalInfo:'Connection latency: 12ms' },
      { sno:4, dateTime:'2026-04-17 09:01:00', logType:'INFO',    message:'Starting batch job BCPID_260319',         additionalInfo:'Sample count: 14, Method: HPLC_QC_01' },
      { sno:5, dateTime:'2026-04-17 09:05:30', logType:'INFO',    message:'Processing sample set FESO_RES_002',      additionalInfo:'Path: 2024\\2025_New\\MAR_2024' },
      { sno:6, dateTime:'2026-04-17 09:30:12', logType:'INFO',    message:'Checkpoint validation in progress',       additionalInfo:'Checkpoint 1 of 8: Risk Level Check' },
      { sno:7, dateTime:'2026-04-17 10:10:44', logType:'INFO',    message:'All checkpoints validated',               additionalInfo:'Pass: 6, Exception: 2' },
      { sno:8, dateTime:'2026-04-17 10:20:00', logType:'SUCCESS', message:'Job BCPID_260319 completed successfully', additionalInfo:'Duration: 1h 20m, Records processed: 14' },
    ],
  },
  {
    id: 2, hostName: 'AGENT-HOST-02', plant: 'Plant B', module: 'Chromeleon',
    jobId: 'BCPID_260320', scheduler: 'Periodic', errorCount: 2,
    startDate: 'Apr 17, 10:00 AM', endDate: 'Apr 17, 11:45 AM', status: 'Failed',
    logs: [
      { sno:1, dateTime:'2026-04-17 10:00:01', logType:'INFO',    message:'Agent started',                           additionalInfo:'Host: AGENT-HOST-02, PID: 23456' },
      { sno:2, dateTime:'2026-04-17 10:01:15', logType:'WARNING', message:'Server response slow, retrying...',       additionalInfo:'Timeout: 5000ms, Retry: 1/3' },
      { sno:3, dateTime:'2026-04-17 11:00:30', logType:'ERROR',   message:'System Suitability check failed',         additionalInfo:'RSD value: 3.8%, Threshold: 2.0%' },
      { sno:4, dateTime:'2026-04-17 11:30:22', logType:'ERROR',   message:'Peak Tailing Factor out of range',        additionalInfo:'Tailing: 2.4, Acceptable: ≤2.0' },
      { sno:5, dateTime:'2026-04-17 11:45:00', logType:'WARNING', message:'Job completed with errors',               additionalInfo:'Errors: 2, Warnings: 1' },
    ],
  },
  {
    id: 3, hostName: 'AGENT-HOST-01', plant: 'Plant A', module: 'Chromeleon',
    jobId: 'BCPID_260321', scheduler: 'Batch', errorCount: 0,
    startDate: 'Apr 17, 11:00 AM', endDate: 'Apr 17, 12:30 PM', status: 'Completed',
    logs: [
      { sno:1, dateTime:'2026-04-17 11:00:00', logType:'INFO',    message:'Agent started for job BCPID_260321',      additionalInfo:'Scheduled by: system' },
      { sno:2, dateTime:'2026-04-17 11:00:05', logType:'SUCCESS', message:'Pre-flight checks passed',                additionalInfo:'Disk space: 45GB, Memory: 8GB' },
      { sno:3, dateTime:'2026-04-17 12:29:55', logType:'SUCCESS', message:'Job completed without errors',            additionalInfo:'Duration: 1h 30m' },
    ],
  },
  {
    id: 4, hostName: 'AGENT-HOST-03', plant: 'Plant C', module: 'Empower',
    jobId: 'BCPID_260322', scheduler: 'Periodic', errorCount: 0,
    startDate: 'Apr 17, 01:00 PM', endDate: '', status: 'Running',
    logs: [
      { sno:1, dateTime:'2026-04-17 13:00:00', logType:'INFO',    message:'Agent started for periodic job',          additionalInfo:'Interval: 60 min' },
      { sno:2, dateTime:'2026-04-17 13:00:15', logType:'SUCCESS', message:'Connected to Empower',                    additionalInfo:'' },
      { sno:3, dateTime:'2026-04-17 13:01:00', logType:'INFO',    message:'Processing in progress...',               additionalInfo:'Elapsed: 1h 20m' },
    ],
  },
  {
    id: 5, hostName: 'AGENT-HOST-02', plant: 'Plant B', module: 'Chromeleon',
    jobId: 'BCPID_260323', scheduler: 'Batch', errorCount: 0,
    startDate: 'Apr 17, 02:00 PM', endDate: 'Apr 17, 03:15 PM', status: 'Completed',
    logs: [
      { sno:1, dateTime:'2026-04-17 14:00:00', logType:'INFO',    message:'Job BCPID_260323 started',                additionalInfo:'' },
      { sno:2, dateTime:'2026-04-17 15:15:00', logType:'SUCCESS', message:'All 14 samples processed successfully',   additionalInfo:'No exceptions found' },
    ],
  },
  {
    id: 6, hostName: 'AGENT-HOST-04', plant: 'Plant D', module: 'Chromeleon',
    jobId: 'BCPID_260324', scheduler: 'Periodic', errorCount: 1,
    startDate: 'Apr 17, 03:00 PM', endDate: 'Apr 17, 04:00 PM', status: 'Completed',
    logs: [
      { sno:1, dateTime:'2026-04-17 15:00:00', logType:'INFO',    message:'Job started',                             additionalInfo:'' },
      { sno:2, dateTime:'2026-04-17 15:20:00', logType:'WARNING', message:'Renamed Sample Set detected',             additionalInfo:'Old: QC_TEST_01, New: QC_TEST_01_v2' },
      { sno:3, dateTime:'2026-04-17 16:00:00', logType:'INFO',    message:'Job completed with 1 warning',            additionalInfo:'' },
    ],
  },
  {
    id: 7, hostName: 'AGENT-HOST-01', plant: 'Plant A', module: 'Empower',
    jobId: 'BCPID_260325', scheduler: 'Batch', errorCount: 0,
    startDate: 'Apr 17, 04:30 PM', endDate: '', status: 'Idle',
    logs: [
      { sno:1, dateTime:'2026-04-17 16:30:00', logType:'INFO',    message:'Agent idle — waiting for next schedule',  additionalInfo:'Next run: Apr 18, 06:00 AM' },
    ],
  },
]

/* ─── Helpers ────────────────────────────────────────────────────── */
function statusCls(s: string) {
  switch (s) {
    case 'Completed': return 'status completed'
    case 'Running':   return 'status running'
    case 'Failed':    return 'status failed'
    case 'Idle':      return 'status idle'
    case 'Stopped':   return 'status stopped'
    default:          return 'status'
  }
}

function logTypeCls(t: string) {
  switch (t) {
    case 'SUCCESS': return 'log-type log-type--success'
    case 'INFO':    return 'log-type log-type--info'
    case 'WARNING': return 'log-type log-type--warning'
    case 'ERROR':   return 'log-type log-type--error'
    case 'DEBUG':   return 'log-type log-type--debug'
    default:        return 'log-type'
  }
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function AgentLogsPage() {
  const [search,        setSearch]        = useState('')
  const [systemFilter,  setSystemFilter]  = useState('All')
  const [dateFilter,    setDateFilter]    = useState('Last 30 days')
  const [page,          setPage]          = useState(1)
  const [logModal,      setLogModal]      = useState<AgentRow | null>(null)
  const ROWS_PER_PAGE = 7

  const filtered = AGENT_ROWS.filter(r => {
    const matchSystem = systemFilter === 'All' || r.module === systemFilter
    const q = search.toLowerCase()
    const matchSearch = !q || Object.values(r).some(v => String(v).toLowerCase().includes(q))
    return matchSystem && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  return (
    <div className="rr-page">

      {/* ── TOP FILTER BAR — same structure as Review.tsx ── */}
      <div className="top-bar">
        <input
          className="search"
          placeholder="Search"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />

        {/* System dropdown */}
        <select
          className="dropdown"
          value={systemFilter}
          onChange={e => { setSystemFilter(e.target.value); setPage(1) }}
        >
          <option value="All">System: All</option>
          <option value="Chromeleon">Chromeleon</option>
          <option value="Empower">Empower</option>
        </select>

        {/* Date dropdown */}
        <select
          className="dropdown"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        >
          <option value="Last 30 days">Date: Last 30 days</option>
          <option value="Last 7 days">Date: Last 7 days</option>
          <option value="Today">Date: Today</option>
        </select>

        <button className="icon-btn">☰</button>
        <button className="icon-btn">⋮</button>
      </div>

      {/* ── READ-ONLY NOTICE ── */}
      {/* <div className="al-notice">
        🔒 This is a read-only table. Each plant will have one agent.
      </div> */}

      {/* ── TABLE — same rr-card / rr-table as Review.tsx ── */}
      <div className="rr-card">
        <table className="rr-table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>Host Name</th>
              <th>Plant</th>
              <th>Module</th>
              <th>Job ID</th>
              <th>Scheduler ↓</th>
              <th>Error Count</th>
              <th>Start Date On ↓</th>
              <th>End Date On ↓</th>
              <th>Status ↓</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>
                  No agent log records found.
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr key={row.id} onClick={() => setLogModal(row)}>
                  <td>{(safePage - 1) * ROWS_PER_PAGE + idx + 1}</td>
                  <td className="al-hostname">{row.hostName}</td>
                  <td>{row.plant}</td>
                  <td>
                    <span className="al-module">{row.module}</span>
                  </td>
                  {/* Job ID — clickable link style */}
                  <td>
                    <span className="link al-jobid">
                      {row.jobId} ↗
                    </span>
                  </td>
                  <td>{row.scheduler}</td>
                  <td>
                    {row.errorCount > 0
                      ? <span className="al-error-count">⚠ {row.errorCount}</span>
                      : <span>{row.errorCount}</span>
                    }
                  </td>
                  <td>{row.startDate || '—'}</td>
                  <td>{row.endDate || '—'}</td>
                  <td>
                    <span className={statusCls(row.status)}>
                      {row.status === 'Running' && <span className="al-pulse" />}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── PAGINATION — same as Review.tsx ── */}
        <div className="pagination-bar">
          <button
            className="btn secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            ← Previous
          </button>

          <div className="pages">
            {[1, 2, 3].map(p => (
              <span
                key={p}
                className={safePage === p ? 'active' : ''}
                onClick={() => setPage(p)}
              >{p}</span>
            ))}
            <span>…</span>
            {[8, 9, 10].map(p => (
              <span key={p} onClick={() => setPage(p)}>{p}</span>
            ))}
          </div>

          <button
            className="btn secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ── BOTTOM BAR — same as Review.tsx ── */}
      <div className="bottom-bar">
        <div className="nav-arrows">
          <button className="circle-btn">←</button>
          <button className="circle-btn">→</button>
        </div>
        <div className="actions">
          <button className="btn cancel">Cancel</button>
          <button className="btn submit">Submit</button>
        </div>
      </div>

      {logModal && (
        <div className="modal-overlay" onClick={() => setLogModal(null)}>
          <div className="al-modal" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="al-modal__header">
              <div>
                <div className="al-modal__title">{logModal.jobId}</div>
                <div className="al-modal__meta">
                  {logModal.hostName} · {logModal.plant} · {logModal.module}
                  &nbsp;·&nbsp;
                  <span className={statusCls(logModal.status)}>{logModal.status}</span>
                </div>
              </div>
              <button className="eye-btn" onClick={() => setLogModal(null)}>✕</button>
            </div>

            {/* Summary */}
            <div className="al-modal__summary">
              <div className="al-summary-item">
                <span className="al-summary-label">Scheduler</span>
                <span className="al-summary-value">{logModal.scheduler}</span>
              </div>
              <div className="al-summary-item">
                <span className="al-summary-label">Start Date</span>
                <span className="al-summary-value">{logModal.startDate || '—'}</span>
              </div>
              <div className="al-summary-item">
                <span className="al-summary-label">End Date</span>
                <span className="al-summary-value">{logModal.endDate || '—'}</span>
              </div>
              <div className="al-summary-item">
                <span className="al-summary-label">Error Count</span>
                <span className={`al-summary-value${logModal.errorCount > 0 ? ' red' : ''}`}>
                  {logModal.errorCount}
                </span>
              </div>
            </div>

            {/* Log table */}
            <div className="al-modal__body">
              <table className="rr-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>S.No.</th>
                    <th style={{ width: 160 }}>Date Time</th>
                    <th style={{ width: 90 }}>Log Type</th>
                    <th>Message</th>
                    <th style={{ width: 260 }}>Additional Info</th>
                  </tr>
                </thead>
                <tbody>
                  {logModal.logs.map(log => (
                    <tr key={log.sno}>
                      <td>{log.sno}</td>
                      <td style={{ fontSize: 12, color: '#6b7280' }}>{log.dateTime}</td>
                      <td>
                        <span className={logTypeCls(log.logType)}>{log.logType}</span>
                      </td>
                      <td>{log.message}</td>
                      <td style={{ fontSize: 12, color: '#6b7280' }}>{log.additionalInfo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal footer */}
            <div className="modal-actions">
              <button className="btn cancel" onClick={() => setLogModal(null)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}