import { useState } from 'react'
import './AuditTrail.css'

interface AuditLog {
  id: number
  time: string
  user: string
  action: string
  record: string
  module: string
  ip: string
  reason: string
}

interface ExportFormat {
  id: string
  label: string
  icon: string
  ext: string
  desc: string
}

const AUDIT_LOGS: AuditLog[] = [
  { id: 1,  time: '2024-01-15 10:45:22', user: 'Rajesh Kumar',        action: 'Reviewed exception',      record: 'JOB-1043',        module: 'Workflows',     ip: '10.1.2.5',  reason: 'Scheduled review'    },
  { id: 2,  time: '2024-01-15 10:12:05', user: 'Dr. Ananya Sharma',   action: 'Updated system config',   record: 'Empower',         module: 'System Config', ip: '10.1.2.3',  reason: 'Config change'       },
  { id: 3,  time: '2024-01-15 09:55:10', user: 'Priya Nair',          action: 'Acknowledged exception',  record: 'JOB-1044',        module: 'Workflows',     ip: '10.1.2.8',  reason: 'Verified manually'   },
  { id: 4,  time: '2024-01-15 09:22:33', user: 'Dr. Ananya Sharma',   action: 'User login',              record: '-',               module: 'Auth',          ip: '10.1.2.3',  reason: '-'                   },
  { id: 5,  time: '2024-01-15 09:00:00', user: 'System',              action: 'Scheduled job ran',       record: 'JOB-1044',        module: 'Scheduler',     ip: 'localhost', reason: 'Automated'           },
  { id: 6,  time: '2024-01-14 17:30:45', user: 'Sanjay Mehta',        action: 'Approved report',         record: 'RPT-0092',        module: 'Reports',       ip: '10.1.2.9',  reason: 'QC sign-off'         },
  { id: 7,  time: '2024-01-14 16:15:00', user: 'Priya Nair',          action: 'Created new report',      record: 'RPT-0093',        module: 'Reports',       ip: '10.1.2.8',  reason: 'Batch completed'     },
  { id: 8,  time: '2024-01-14 14:05:33', user: 'Rajesh Kumar',        action: 'Added new user',          record: 'Divya Reddy',     module: 'Users',         ip: '10.1.2.5',  reason: 'Onboarding'          },
  { id: 9,  time: '2024-01-14 11:44:10', user: 'Dr. Ananya Sharma',   action: 'Changed security policy', record: 'Password Expiry', module: 'Security',      ip: '10.1.2.3',  reason: 'Policy update'       },
  { id: 10, time: '2024-01-14 10:22:00', user: 'System',              action: 'Scheduled job ran',       record: 'JOB-1042',        module: 'Scheduler',     ip: 'localhost', reason: 'Automated'           },
  { id: 11, time: '2024-01-13 15:30:00', user: 'Sanjay Mehta',        action: 'User login',              record: '-',               module: 'Auth',          ip: '10.1.2.9',  reason: '-'                   },
  { id: 12, time: '2024-01-13 09:10:00', user: 'Divya Reddy',         action: 'Acknowledged exception',  record: 'JOB-1046',        module: 'Workflows',     ip: '10.1.2.11', reason: 'Checked on site'     },
]

const ALL_MODULES = ['All', ...new Set(AUDIT_LOGS.map(l => l.module))]
const ALL_USERS   = ['All', ...new Set(AUDIT_LOGS.map(l => l.user))]

const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'csv',   label: 'CSV File',          icon: '📋', ext: '.csv',  desc: 'Open in any spreadsheet app'  },
  { id: 'excel', label: 'Excel Spreadsheet', icon: '📊', ext: '.xlsx', desc: 'Best for filtering and charts' },
  { id: 'pdf',   label: 'PDF Document',      icon: '📄', ext: '.pdf',  desc: 'Best for printing and sharing' },
  { id: 'doc',   label: 'Word Document',     icon: '📝', ext: '.docx', desc: 'Best for editing with text'   },
]

function ModuleBadge({ module }: { module: string }) {
  const colors: Record<string, string> = {
    Workflows:       'badge--blue',
    'System Config': 'badge--purple',
    Auth:            'badge--yellow',
    Scheduler:       'badge--grey',
    Reports:         'badge--green',
    Users:           'badge--accent',
    Security:        'badge--red',
  }
  return <span className={'badge ' + (colors[module] || 'badge--grey')}>{module}</span>
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={{ color }}>{value}</div>
    </div>
  )
}

function ExportMenu({ logs, onClose }: { logs: AuditLog[]; onClose: () => void }) {
  const [done, setDone] = useState<string | null>(null)

  function onBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleExport(fmt: ExportFormat) {
    const header = 'ID,Timestamp,User,Action,Record,Module,IP Address,Reason\n'
    const rows = logs.map(l =>
      [l.id, l.time, l.user, l.action, l.record, l.module, l.ip, l.reason]
        .map(v => '"' + String(v).replace(/"/g, '""') + '"')
        .join(',')
    ).join('\n')

    const fileName = 'audit_trail_' + new Date().toISOString().slice(0, 10) + fmt.ext
    const blob = new Blob([header + rows], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)

    setDone(fmt.id)
    setTimeout(onClose, 1800)
  }

  return (
    <div className="export-backdrop" onClick={onBackdrop}>
      <div className="export-menu">

        <div className="export-menu__header">
          <span className="export-menu__title">Export Audit Trail</span>
          <button className="export-menu__close" onClick={onClose}>&#10005;</button>
        </div>

        <p className="export-menu__hint">
          {logs.length} record{logs.length !== 1 ? 's' : ''} will be exported
        </p>

        <div className="export-options">
          {EXPORT_FORMATS.map(fmt => (
            <button
              key={fmt.id}
              className={'export-option ' + (done === fmt.id ? 'export-option--done' : '')}
              onClick={() => handleExport(fmt)}
              disabled={!!done}
            >
              <span className="export-option__icon">{fmt.icon}</span>
              <div className="export-option__info">
                <span className="export-option__label">{fmt.label}</span>
                <span className="export-option__desc">{fmt.desc}</span>
              </div>
              <span className="export-option__ext">{fmt.ext}</span>
              {done === fmt.id && <span className="export-option__check">&#10003;</span>}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default function AuditTrail() {
  const [search,       setSearch]       = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [userFilter,   setUserFilter]   = useState('All')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')
  const [showFilters,  setShowFilters]  = useState(false)
  const [showExport,   setShowExport]   = useState(false)

  const visible = AUDIT_LOGS.filter(log => {
    const q = search.toLowerCase()
    const matchSearch = q
      ? log.user.toLowerCase().includes(q)   ||
        log.action.toLowerCase().includes(q) ||
        log.record.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      : true
    const matchModule = moduleFilter === 'All' || log.module === moduleFilter
    const matchUser   = userFilter   === 'All' || log.user   === userFilter
    const matchFrom   = dateFrom ? log.time >= dateFrom : true
    const matchTo     = dateTo   ? log.time <= dateTo + ' 99' : true
    return matchSearch && matchModule && matchUser && matchFrom && matchTo
  })

  const activeFilterCount = [
    moduleFilter !== 'All',
    userFilter   !== 'All',
    !!dateFrom,
    !!dateTo,
  ].filter(Boolean).length

  function clearFilters() {
    setModuleFilter('All')
    setUserFilter('All')
    setDateFrom('')
    setDateTo('')
  }

  const todayStr   = '2024-01-15'
  const todayCount = AUDIT_LOGS.filter(l => l.time.startsWith(todayStr)).length
  const activeUsers = new Set(AUDIT_LOGS.map(l => l.user)).size
  const moduleCount = new Set(AUDIT_LOGS.map(l => l.module)).size

  return (
    <div className="at-page">

      <div className="at-page__header">
        <div>
          <h1 className="at-page__title">Audit Trail</h1>
          <p className="at-page__subtitle">Every action recorded - nothing can be changed or deleted</p>
        </div>

        <div className="at-header-right">
          <div className="at-search">
            <span className="at-search__icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="at-search__input"
            />
          </div>

          <button
            className={'btn btn--secondary ' + (showFilters ? 'btn--outline-active' : '')}
            onClick={() => setShowFilters(v => !v)}
          >
            &#9881; Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              className={'btn btn--primary ' + (showExport ? 'btn--export-open' : '')}
              onClick={() => setShowExport(v => !v)}
            >
              &#8595; Export
            </button>

            {showExport && (
              <ExportMenu
                logs={visible}
                onClose={() => setShowExport(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="notice notice--yellow">
        &#128274; These records are locked and cannot be changed or deleted, as required by 21 CFR Part 11.
      </div>

      <div className="at-page__stats">
        <StatCard label="Total Events" value={AUDIT_LOGS.length} color="var(--accent2)" icon="&#128203;" />
        <StatCard label="Today"        value={todayCount}        color="var(--success)" icon="&#128197;" />
        <StatCard label="Users Active" value={activeUsers}       color="var(--accent)"  icon="&#128101;" />
        <StatCard label="Modules"      value={moduleCount}       color="var(--warn)"    icon="&#128268;" />
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-panel__row">

            <div className="form-field">
              <label className="field-label">Module</label>
              <select className="field-select" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
                {ALL_MODULES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">User</label>
              <select className="field-select" value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                {ALL_USERS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">From Date</label>
              <input className="field-input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>

            <div className="form-field">
              <label className="field-label">To Date</label>
              <input className="field-input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>

            <div className="filter-panel__clear">
              {activeFilterCount > 0 && (
                <button className="btn btn--secondary btn--sm" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
              <span className="filter-result-count">
                Showing <strong>{visible.length}</strong> of {AUDIT_LOGS.length} records
              </span>
            </div>

          </div>
        </div>
      )}

      <div className="at-card">
        <div className="at-card__header">
          <span className="at-card__title">Activity Log</span>
          <span className="at-card__count">{visible.length} records</span>
        </div>

        <div className="table-wrap">
          <table className="at-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Record</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-results">
                    <div>&#128269;</div>
                    No log entries match your filters
                  </td>
                </tr>
              ) : (
                visible.map(log => (
                  <tr key={log.id}>
                    <td className="mono muted small">{String(log.id).padStart(4, '0')}</td>
                    <td className="mono accent-time small">{log.time}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-dot" />
                        <span>{log.user}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.action}</td>
                    <td>
                      {log.record !== '-'
                        ? <span className="record-tag">{log.record}</span>
                        : <span className="muted">-</span>
                      }
                    </td>
                    <td><ModuleBadge module={log.module} /></td>
                    <td className="mono muted small">{log.ip}</td>
                    <td className="muted small">{log.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
