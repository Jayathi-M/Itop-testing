import { useState } from 'react'
import './Review.css'
import './AuditTrail.css'

/* ─── Types ──────────────────────────────────────────────────────── */
type ActionType = 'Create' | 'Update' | 'Status Change'
type Section    = 'User' | 'Role' | 'Report Builder' | 'Asset' | 'Plant' | 'Workflow' | 'Template' | 'Policy'

interface AuditRow {
  id: number
  section: Section
  action: ActionType
  objectUUID: string       
  feature: string          
  oldValue: string
  newValue: string
  changedOn: string        
  user: string
}

/* ─── Mock data — covers all spec scenarios ──────────────────────── */
const AUDIT_ROWS: AuditRow[] = [
  {
    id: 1,
    section: 'User', action: 'Status Change',
    objectUUID: 'USR-7f3a2b19', feature: 'Status',
    oldValue: 'Active', newValue: 'Inactive',
    changedOn: 'Apr 17, 2026 10:20 AM', user: 'admin@cds.com',
  },
  {
    id: 2,
    section: 'User', action: 'Create',
    objectUUID: 'USR-4d8c1e02', feature: 'User',
    oldValue: '—', newValue: 'harshita@cds.com',
    changedOn: 'Apr 17, 2026 09:45 AM', user: 'admin@cds.com',
  },
  {
    id: 3,
    section: 'Role', action: 'Update',
    objectUUID: 'ROL-2a9f4c77', feature: 'Permissions',
    oldValue: 'Read Only', newValue: 'Read + Write',
    changedOn: 'Apr 16, 2026 03:12 PM', user: 'sysadmin@cds.com',
  },
  {
    id: 4,
    section: 'Role', action: 'Create',
    objectUUID: 'ROL-5b3e8d14', feature: 'Role',
    oldValue: '—', newValue: 'QC Reviewer',
    changedOn: 'Apr 16, 2026 02:00 PM', user: 'admin@cds.com',
  },
  {
    id: 5,
    section: 'Report Builder', action: 'Update',
    objectUUID: 'RPT-9c1d6f33', feature: 'Report Name',
    oldValue: 'Monthly QC Report', newValue: 'Monthly QC Summary Report',
    changedOn: 'Apr 15, 2026 11:30 AM', user: 'reporter@cds.com',
  },
  {
    id: 6,
    section: 'Report Builder', action: 'Status Change',
    objectUUID: 'RPT-1e7a2b88', feature: 'Status',
    oldValue: 'Draft', newValue: 'Published',
    changedOn: 'Apr 15, 2026 10:05 AM', user: 'reporter@cds.com',
  },
  {
    id: 7,
    section: 'Asset', action: 'Update',
    objectUUID: 'AST-3f6c9d21', feature: 'Asset Name',
    oldValue: 'HPLC-01', newValue: 'HPLC-01-Revised',
    changedOn: 'Apr 14, 2026 04:50 PM', user: 'engineer@cds.com',
  },
  {
    id: 8,
    section: 'Plant', action: 'Update',
    objectUUID: 'PLT-6b2e4a09', feature: 'Plant Location',
    oldValue: 'Building A, Floor 1', newValue: 'Building B, Floor 2',
    changedOn: 'Apr 14, 2026 01:20 PM', user: 'admin@cds.com',
  },
  {
    id: 9,
    section: 'Workflow', action: 'Status Change',
    objectUUID: 'WFL-8d4f7c55', feature: 'Status',
    oldValue: 'Inactive', newValue: 'Active',
    changedOn: 'Apr 13, 2026 09:00 AM', user: 'sysadmin@cds.com',
  },
  {
    id: 10,
    section: 'Template', action: 'Create',
    objectUUID: 'TPL-2c5a1b44', feature: 'Template',
    oldValue: '—', newValue: 'Batch Review Template v2',
    changedOn: 'Apr 12, 2026 05:30 PM', user: 'admin@cds.com',
  },
  {
    id: 11,
    section: 'Policy', action: 'Update',
    objectUUID: 'POL-7e3d9f12', feature: 'Retention Period',
    oldValue: '30 days', newValue: '90 days',
    changedOn: 'Apr 11, 2026 02:45 PM', user: 'compliance@cds.com',
  },
  {
    id: 12,
    section: 'User', action: 'Update',
    objectUUID: 'USR-9a1c3b66', feature: 'Email',
    oldValue: 'raj@old.com', newValue: 'raj@cds.com',
    changedOn: 'Apr 10, 2026 11:10 AM', user: 'admin@cds.com',
  },
  {
    id: 13,
    section: 'Role', action: 'Status Change',
    objectUUID: 'ROL-4d8f2e91', feature: 'Status',
    oldValue: 'Active', newValue: 'Inactive',
    changedOn: 'Apr 09, 2026 03:30 PM', user: 'sysadmin@cds.com',
  },
  {
    id: 14,
    section: 'Asset', action: 'Create',
    objectUUID: 'AST-6f1b5c27', feature: 'Asset',
    oldValue: '—', newValue: 'GC-FID-03',
    changedOn: 'Apr 08, 2026 10:00 AM', user: 'engineer@cds.com',
  },
]

/* ─── Action badge helper ─────────────────────────────────────────── */
function actionCls(a: ActionType) {
  switch (a) {
    case 'Create':        return 'at-action at-action--create'
    case 'Update':        return 'at-action at-action--update'
    case 'Status Change': return 'at-action at-action--status'
    default:              return 'at-action'
  }
}

/* ─── Detail cell — shows: Feature: Old → New ────────────────────── */
function DetailCell({ row }: { row: AuditRow }) {
  return (
    <div className="at-detail">
      <div className="at-detail__uuid">
        <span className="at-detail__uuid-label">Object:</span>
        <span className="at-detail__uuid-val">{row.objectUUID}</span>
      </div>
      <div className="at-detail__change">
        <span className="at-detail__feature">{row.feature}:</span>
        <span className="at-detail__old">{row.oldValue}</span>
        {row.oldValue !== '—' && <span className="at-detail__arrow">→</span>}
        <span className="at-detail__new">{row.newValue}</span>
      </div>
    </div>
  )
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function AuditTrailPage() {
  const [search,       setSearch]       = useState('')
  const [sectionFilter,setSectionFilter]= useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [dateFilter,   setDateFilter]   = useState('Last 30 days')
  const [page,         setPage]         = useState(1)
  const ROWS_PER_PAGE = 7

  const SECTIONS: string[] = ['All', 'User', 'Role', 'Report Builder', 'Asset', 'Plant', 'Workflow', 'Template', 'Policy']
  const ACTIONS:  string[] = ['All', 'Create', 'Update', 'Status Change']

  const filtered = AUDIT_ROWS.filter(r => {
    const matchSection = sectionFilter === 'All' || r.section === sectionFilter
    const matchAction  = actionFilter  === 'All' || r.action  === actionFilter
    const q = search.toLowerCase()
    const matchSearch  = !q || [r.section, r.action, r.objectUUID, r.feature, r.oldValue, r.newValue, r.user]
      .some(v => v.toLowerCase().includes(q))
    return matchSection && matchAction && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  /* Page numbers: 1 2 3 … 8 9 10 */
  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showPages: (number | '…')[] = totalPages <= 7
    ? allPages
    : [
        ...allPages.slice(0, 3),
        '…',
        ...allPages.slice(-3),
      ]

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

        {/* Section filter */}
        <select
          className="dropdown"
          value={sectionFilter}
          onChange={e => { setSectionFilter(e.target.value); setPage(1) }}
        >
          {SECTIONS.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'Section: All' : s}</option>
          ))}
        </select>

        {/* Action filter */}
        <select
          className="dropdown"
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1) }}
        >
          {ACTIONS.map(a => (
            <option key={a} value={a}>{a === 'All' ? 'Action: All' : a}</option>
          ))}
        </select>

        {/* Date filter */}
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
      {/* <div className="at-notice">
        🔒 This is a read-only table. Records are system-generated and cannot be modified.
      </div> */}

      {/* ── TABLE — same rr-card / rr-table as Review.tsx ── */}
      <div className="rr-card">
        <table className="rr-table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>Section</th>
              <th>Action</th>
              <th>Details (Reason)</th>
              <th>Date + Time Changed On ↓</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>
                  No audit trail records found.
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr key={row.id}>
                  <td>{(safePage - 1) * ROWS_PER_PAGE + idx + 1}</td>
                  <td>
                    <span className="at-section">{row.section}</span>
                  </td>
                  <td>
                    <span className={actionCls(row.action)}>{row.action}</span>
                  </td>
                  <td>
                    <DetailCell row={row} />
                  </td>
                  <td className="at-datetime">{row.changedOn}</td>
                  <td className="at-user">{row.user}</td>
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
            {showPages.map((p, i) =>
              p === '…'
                ? <span key={`ellipsis-${i}`}>…</span>
                : (
                  <span
                    key={p}
                    className={safePage === p ? 'active' : ''}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </span>
                )
            )}
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
          <button className="btn submit">Export</button>
        </div>
      </div>

    </div>
  )
}