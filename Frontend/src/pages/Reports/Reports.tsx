import { useState, useEffect } from 'react'
import './Reports.css'

interface Report {
  id: string
  title: string
  type: string
  period: string
  status: string
  by: string
  size: string
}

interface DownloadFormat {
  id: string
  label: string
  icon: string
  ext: string
  desc: string
}

const REPORTS: Report[] = [
  { id: 'RPT-0095', title: 'Empower Daily Exception Summary',   type: 'Exception',   period: '2024-01-15', status: 'draft',            by: 'System',            size: '2.1 MB' },
  { id: 'RPT-0094', title: 'LIMS Weekly Compliance Report',     type: 'Compliance',  period: 'Week 2 Jan', status: 'published',        by: 'Rajesh Kumar',      size: '3.4 MB' },
  { id: 'RPT-0093', title: 'Bin Blender Batch Review',          type: 'Batch',       period: '2024-01-14', status: 'pending-approval', by: 'System',            size: '1.8 MB' },
  { id: 'RPT-0092', title: 'Monthly Audit Trail',               type: 'Audit',       period: 'Dec 2023',   status: 'published',        by: 'System',            size: '5.2 MB' },
  { id: 'RPT-0091', title: 'Chromeleon Instrument Performance', type: 'Performance', period: 'Q4 2023',    status: 'published',        by: 'Dr. Ananya Sharma', size: '4.0 MB' },
  { id: 'RPT-0090', title: 'SAP QM Monthly Deviation Report',   type: 'Compliance',  period: 'Dec 2023',   status: 'published',        by: 'Sanjay Mehta',      size: '2.7 MB' },
  { id: 'RPT-0089', title: 'Tablet Coater Batch Exception Log', type: 'Exception',   period: '2024-01-10', status: 'draft',            by: 'System',            size: '1.2 MB' },
]

const REPORT_TYPES  = ['Exception Summary', 'Compliance Report', 'Audit Trail', 'Performance', 'Batch Review']
const INSTRUMENTS   = ['All', 'Empower', 'Chromeleon', 'Bin Blender', 'LIMS', 'SAP QM', 'Port Based']
const SCOPE_OPTIONS = ['All Systems', 'Quality / CDS', 'Manufacturing', 'Enterprise']
const SCHEDULE_OPTS = ['One-time only', 'Daily', 'Weekly', 'Monthly']
const FORMAT_OPTS   = ['PDF', 'Excel', 'PDF + Excel']

const DOWNLOAD_FORMATS: DownloadFormat[] = [
  { id: 'pdf',   label: 'PDF Document',      icon: '\uD83D\uDCC4', ext: '.pdf',  desc: 'Best for printing and sharing' },
  { id: 'excel', label: 'Excel Spreadsheet', icon: '\uD83D\uDCCA', ext: '.xlsx', desc: 'Best for data and editing'     },
  { id: 'doc',   label: 'Word Document',     icon: '\uD83D\uDCDD', ext: '.docx', desc: 'Best for editing with text'    },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    'published':        { label: 'Published',       cls: 'badge--green'  },
    'draft':            { label: 'Draft',            cls: 'badge--grey'   },
    'pending-approval': { label: 'Pending Approval', cls: 'badge--yellow' },
  }
  const { label, cls } = map[status] || { label: status, cls: 'badge--grey' }
  return <span className={'badge ' + cls}>{label}</span>
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Exception: 'badge--red', Compliance: 'badge--blue',
    Audit: 'badge--purple',  Performance: 'badge--accent', Batch: 'badge--orange',
  }
  return <span className={'badge ' + (colors[type] || 'badge--grey')}>{type}</span>
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

function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={'tab ' + (active === tab ? 'tab--active' : '')}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function DownloadModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const [selected,    setSelected]    = useState('pdf')
  const [downloading, setDownloading] = useState(false)
  const [done,        setDone]        = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleDownload() {
    setDownloading(true)
    setTimeout(() => {
      const fmt      = DOWNLOAD_FORMATS.find(f => f.id === selected)!
      const safeName = report.title.replace(/\s+/g, '_')
      const fileName = report.id + '_' + safeName + fmt.ext
      const text = [
        'Report:     ' + report.title,
        'ID:         ' + report.id,
        'Type:       ' + report.type,
        'Period:     ' + report.period,
        'Status:     ' + report.status,
        'Created by: ' + report.by,
        '',
        'Generated by Xception.AI Exception Intelligence Platform',
        'Format:     ' + fmt.label,
      ].join('\n')

      const blob = new Blob([text], { type: 'text/plain' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)

      setDownloading(false)
      setDone(true)
      setTimeout(onClose, 1600)
    }, 1200)
  }

  const activeFmt = DOWNLOAD_FORMATS.find(f => f.id === selected)!

  return (
    <div className="dl-backdrop" onClick={handleBackdropClick}>
      <div className="dl-modal">
        <div className="dl-modal__header">
          <div>
            <div className="dl-modal__title">Download Report</div>
            <div className="dl-modal__sub">{report.id} &mdash; {report.title}</div>
          </div>
          <button className="dl-modal__close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="dl-modal__body">
          {done ? (
            <div className="dl-success">
              <div className="dl-success__icon">&#10003;</div>
              <div className="dl-success__title">Download started!</div>
              <div className="dl-success__sub">
                Saving as <strong>{activeFmt.label}</strong>
              </div>
            </div>
          ) : (
            <div>
              <p className="dl-hint">Choose the file format you want to download:</p>
              <div className="dl-options">
                {DOWNLOAD_FORMATS.map(fmt => (
                  <button
                    key={fmt.id}
                    className={'dl-option ' + (selected === fmt.id ? 'dl-option--active' : '')}
                    onClick={() => setSelected(fmt.id)}
                  >
                    <span className="dl-option__icon">{fmt.icon}</span>
                    <div className="dl-option__info">
                      <span className="dl-option__label">{fmt.label}</span>
                      <span className="dl-option__desc">{fmt.desc}</span>
                    </div>
                    <span className="dl-option__ext">{fmt.ext}</span>
                    {selected === fmt.id && (
                      <span className="dl-option__check">&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="dl-preview">
                <span className="dl-preview__name">
                  {report.id}_{report.title.replace(/\s+/g, '_')}{activeFmt.ext}
                </span>
                <span className="dl-preview__size">{report.size}</span>
              </div>
            </div>
          )}
        </div>
        {!done && (
          <div className="dl-modal__footer">
            <button className="btn btn--secondary" onClick={onClose} disabled={downloading}>
              Cancel
            </button>
            <button
              className={'btn btn--primary ' + (downloading ? 'btn--loading' : '')}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading
                ? <><span className="spinner" /> Preparing...</>
                : <>&#8595; Download {activeFmt.ext}</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportLibrary({ search, onDownload }: { search: string; onDownload: (r: Report) => void }) {
  const [typeFilter, setTypeFilter] = useState('All')

  const allTypes = ['All', ...new Set(REPORTS.map(r => r.type))]

  const visible = REPORTS.filter(r => {
    const matchSearch = search
      ? r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase())
      : true
    const matchType = typeFilter === 'All' || r.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="rpt-card">
      <div className="library-filters">
        {allTypes.map(t => (
          <button
            key={t}
            className={'filter-pill ' + (typeFilter === t ? 'filter-pill--active' : '')}
            onClick={() => setTypeFilter(t)}
          >
            {t}
          </button>
        ))}
        <span className="filter-count">{visible.length} reports</span>
      </div>
      <div className="table-wrap">
        <table className="rpt-table">
          <thead>
            <tr>
              <th>Report ID</th><th>Title</th><th>Type</th><th>Period</th>
              <th>Status</th><th>Created By</th><th>Size</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8} className="no-results">No reports match your search</td></tr>
            ) : (
              visible.map(r => (
                <tr key={r.id}>
                  <td className="mono accent">{r.id}</td>
                  <td className="rpt-title">{r.title}</td>
                  <td><TypeBadge type={r.type} /></td>
                  <td className="muted small">{r.period}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="small">{r.by}</td>
                  <td className="mono muted small">{r.size}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn--secondary btn--sm">View</button>
                      <button className="btn btn--primary btn--sm" onClick={() => onDownload(r)}>
                        &#8595; Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GenerateReport() {
  const [submitted,    setSubmitted]    = useState(false)
  const [reportType,   setReportType]   = useState(REPORT_TYPES[0])
  const [instrument,   setInstrument]   = useState('All')
  const [scope,        setScope]        = useState(SCOPE_OPTIONS[0])
  const [fromDate,     setFromDate]     = useState('')
  const [toDate,       setToDate]       = useState('')
  const [format,       setFormat]       = useState('PDF')
  const [schedule,     setSchedule]     = useState('One-time only')
  const [distribution, setDistribution] = useState('')
  const [sections, setSections] = useState<Record<string, boolean>>({
    'Executive Summary':    true,
    'Exception Details':    true,
    'Checklist Audit':      true,
    'Approval Log':         true,
    'Statistical Analysis': false,
  })

  function toggleSection(name: string) {
    setSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  if (submitted) {
    return (
      <div className="rpt-card">
        <div className="success-screen">
          <div className="success-screen__icon">&#9989;</div>
          <div className="success-screen__title">Report generation started!</div>
          <div className="success-screen__sub">
            Your <strong>{reportType}</strong> report is being prepared.
            It will appear in the Report Library when ready.
          </div>
          <button className="btn btn--primary" onClick={() => setSubmitted(false)}>
            Generate Another Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rpt-card">
      <div className="gen-form">
        <div className="form-row form-row--3">
          <div className="form-field">
            <label className="field-label">Report Type</label>
            <select className="field-select" value={reportType} onChange={e => setReportType(e.target.value)}>
              {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Instrument</label>
            <select className="field-select" value={instrument} onChange={e => setInstrument(e.target.value)}>
              {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Scope</label>
            <select className="field-select" value={scope} onChange={e => setScope(e.target.value)}>
              {SCOPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row form-row--3">
          <div className="form-field">
            <label className="field-label">From Date</label>
            <input className="field-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">To Date</label>
            <input className="field-input" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">File Format</label>
            <select className="field-select" value={format} onChange={e => setFormat(e.target.value)}>
              {FORMAT_OPTS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row form-row--2">
          <div>
            <div className="field-label" style={{ marginBottom: 10 }}>Include Sections</div>
            <div className="section-checks">
              {Object.entries(sections).map(([name, checked]) => (
                <label key={name} className="check-row" onClick={() => toggleSection(name)}>
                  <div className={'check-box ' + (checked ? 'check-box--checked' : '')}>
                    {checked ? '\u2713' : ''}
                  </div>
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="schedule-col">
            <div className="form-field">
              <label className="field-label">Schedule</label>
              <select className="field-select" value={schedule} onChange={e => setSchedule(e.target.value)}>
                {SCHEDULE_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ marginTop: 12 }}>
              <label className="field-label">Send to (email addresses)</label>
              <input
                className="field-input"
                placeholder="qa@org.io, manager@org.io..."
                value={distribution}
                onChange={e => setDistribution(e.target.value)}
              />
            </div>
            <div className="gen-preview">
              <div className="gen-preview__label">Report Preview</div>
              <div className="gen-preview__row"><span>Type</span><strong>{reportType}</strong></div>
              <div className="gen-preview__row"><span>Instrument</span><strong>{instrument}</strong></div>
              <div className="gen-preview__row"><span>Format</span><strong>{format}</strong></div>
              <div className="gen-preview__row"><span>Schedule</span><strong>{schedule}</strong></div>
              <div className="gen-preview__row"><span>Sections</span><strong>{Object.values(sections).filter(Boolean).length} selected</strong></div>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn--secondary">Save as Draft</button>
          <button className="btn btn--primary" onClick={() => setSubmitted(true)}>
            &#9654; Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Report Library')
  const [search,    setSearch]    = useState('')
  const [dlReport,  setDlReport]  = useState<Report | null>(null)

  const published       = REPORTS.filter(r => r.status === 'published').length
  const pendingApproval = REPORTS.filter(r => r.status === 'pending-approval').length
  const drafts          = REPORTS.filter(r => r.status === 'draft').length

  return (
    <div className="rpt-page">
      <div className="rpt-page__header">
        <div>
          <h1 className="rpt-page__title">Reports</h1>
          <p className="rpt-page__subtitle">Generate and manage compliance reports</p>
        </div>
        <div className="rpt-search">
          <span className="rpt-search__icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rpt-search__input"
          />
        </div>
      </div>

      <div className="rpt-page__stats">
        <StatCard label="Total Reports"    value={REPORTS.length}  color="var(--accent2)" icon="&#128203;" />
        <StatCard label="Published"        value={published}       color="var(--success)" icon="&#9989;"  />
        <StatCard label="Pending Approval" value={pendingApproval} color="var(--warn)"    icon="&#9203;"  />
        <StatCard label="Drafts"           value={drafts}          color="var(--text3)"   icon="&#128196;" />
      </div>

      <Tabs tabs={['Report Library', 'Generate New']} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Report Library' && (
        <ReportLibrary search={search} onDownload={r => setDlReport(r)} />
      )}
      {activeTab === 'Generate New' && (
        <GenerateReport />
      )}

      {dlReport && (
        <DownloadModal
          report={dlReport}
          onClose={() => setDlReport(null)}
        />
      )}
    </div>
  )
}
