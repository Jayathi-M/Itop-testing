import { useState } from 'react';
import './UserDashboard.css';

// All job data — each job is one scan/check run on a machine
const JOBS = [
  { id: 'JOB-1042', instrument: 'Empower',    site: 'Site A - Lab 1', schedule: 'Daily QC',     status: 'queued',      time: '08:00', checks: 24, anomalies: 3 },
  { id: 'JOB-1043', instrument: 'Chromeleon', site: 'Site A - Lab 2', schedule: 'Weekly Audit', status: 'completed',   time: '07:30', checks: 18, anomalies: 1 },
  { id: 'JOB-1044', instrument: 'Bin Blender',site: 'Site B - Mfg',  schedule: 'Batch Check',  status: 'running',     time: '09:15', checks: 20, anomalies: 5 },
  { id: 'JOB-1045', instrument: 'LIMS',       site: 'Site A - QA',   schedule: 'Daily Review', status: 'pending-ack', time: '06:00', checks: 30, anomalies: 0 },
  { id: 'JOB-1046', instrument: 'Port Based', site: 'Site C - Lab 1',schedule: 'Hourly Check', status: 'completed',   time: '09:00', checks: 12, anomalies: 2 },
];

// Each exception = a check that failed (actual value went outside the allowed limit)
const EXCEPTIONS = [
  { id: 'EX-201', check: 'System Suitability - RSD', instrument: 'Empower',     actual: '2.8%',   limit: '<=2.0%',  severity: 'critical', status: 'pending',      time: '2024-01-15 08:05' },
  { id: 'EX-202', check: 'Peak Tailing Factor',       instrument: 'Empower',     actual: '1.92',   limit: '<=1.5',   severity: 'warning',  status: 'acknowledged', time: '2024-01-15 08:06' },
  { id: 'EX-203', check: 'Column Efficiency (N)',      instrument: 'Empower',     actual: '4210',   limit: '>=5000',  severity: 'critical', status: 'pending',      time: '2024-01-15 08:07' },
  { id: 'EX-204', check: 'Batch Uniformity CV',        instrument: 'Bin Blender', actual: '4.1%',   limit: '<=3.0%',  severity: 'warning',  status: 'pending',      time: '2024-01-15 09:16' },
  { id: 'EX-205', check: 'Blending Time',              instrument: 'Bin Blender', actual: '32 min', limit: '30 min',  severity: 'info',     status: 'acknowledged', time: '2024-01-15 09:17' },
];

// ── Helper: colored pill badge for job status ──
function JobBadge({ status }) {
  const styles = {
    running:      { label: 'Running',      cls: 'badge--blue pulse' },
    queued:       { label: 'Queued',       cls: 'badge--yellow'     },
    'pending-ack':{ label: 'Pending Ack',  cls: 'badge--red'        },
    completed:    { label: 'Done',         cls: 'badge--green'      },
  };
  const { label, cls } = styles[status] || { label: status, cls: 'badge--grey' };
  return <span className={'badge ' + cls}>{label}</span>;
}

// ── Helper: colored pill badge for exception severity ──
function SeverityBadge({ severity }) {
  const styles = {
    critical: { label: 'Critical', cls: 'badge--red'    },
    warning:  { label: 'Warning',  cls: 'badge--yellow' },
    info:     { label: 'Info',     cls: 'badge--blue'   },
  };
  const { label, cls } = styles[severity] || { label: severity, cls: 'badge--grey' };
  return <span className={'badge ' + cls}>{label}</span>;
}

// ── Helper: colored pill badge for acknowledgement status ──
function AckBadge({ status }) {
  return status === 'pending'
    ? <span className="badge badge--red">Pending</span>
    : <span className="badge badge--green">Acknowledged</span>;
}

// ── The 4 big number tiles at the top ──
function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={{ color }}>{value}</div>
    </div>
  );
}

// ──────────────────────────────────────────
// MAIN PAGE COMPONENT
// ──────────────────────────────────────────
export default function UserDashboard() {
  const [search, setSearch] = useState('');

  // Filter exceptions table by whatever the user typed in search
  const visibleExceptions = search
    ? EXCEPTIONS.filter(e =>
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.check.toLowerCase().includes(search.toLowerCase()) ||
        e.instrument.toLowerCase().includes(search.toLowerCase())
      )
    : EXCEPTIONS;

  // Count totals for the stat tiles
  const totalExceptions  = EXCEPTIONS.length;
  const criticalCount    = EXCEPTIONS.filter(e => e.severity === 'critical').length;
  const pendingCount     = EXCEPTIONS.filter(e => e.status === 'pending').length;
  const acknowledgedCount= EXCEPTIONS.filter(e => e.status === 'acknowledged').length;

  return (
    <div className="user-dash">

      {/* ── Page title left, search right — same row ── */}
      <div className="user-dash__header">
        <div>
          <h1 className="user-dash__title">Dashboard</h1>
          <p className="user-dash__subtitle">Live exception and job status across all instruments</p>
        </div>
        <div className="user-dash__search-wrap">
          <span className="user-dash__search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search exceptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="user-dash__search-input"
          />
        </div>
      </div>

      {/* ── 4 stat tiles ── */}
      <div className="user-dash__stats">
        <StatCard label="Total Exceptions" value={totalExceptions}   color="var(--accent2)" icon="&#9888;" />
        <StatCard label="Critical"         value={criticalCount}     color="var(--danger)"  icon="&#128680;" />
        <StatCard label="Pending Review"   value={pendingCount}      color="var(--warn)"    icon="&#9203;" />
        <StatCard label="Acknowledged"     value={acknowledgedCount} color="var(--success)" icon="&#9989;" />
      </div>

      {/* ── Two cards side by side: Active Jobs | Exception Summary ── */}
      <div className="user-dash__mid">

        {/* Active Jobs card */}
        <div className="ud-card">
          <div className="ud-card__header">
            <span className="ud-card__title">Active Jobs</span>
            <span className="badge badge--blue pulse">Live</span>
          </div>
          <div className="job-list">
            {JOBS.map(job => (
              <div key={job.id} className="job-row">
                <div className="job-row__top">
                  <div className="job-row__id">{job.id}</div>
                  <span className="job-row__tag">{job.instrument}</span>
                  <JobBadge status={job.status} />
                </div>
                <div className="job-row__bottom">
                  <span>{job.time}</span>
                  <span>{job.schedule}</span>
                  <span style={{ color: job.anomalies > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {job.anomalies} {job.anomalies === 1 ? 'anomaly' : 'anomalies'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exception Summary card — compact table */}
        <div className="ud-card">
          <div className="ud-card__header">
            <span className="ud-card__title">Exception Summary</span>
          </div>
          <div className="table-wrap">
            <table className="ud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Check</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {EXCEPTIONS.map(ex => (
                  <tr key={ex.id}>
                    <td className="mono accent">{ex.id}</td>
                    <td className="truncate">{ex.check}</td>
                    <td><SeverityBadge severity={ex.severity} /></td>
                    <td><AckBadge status={ex.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Full Exception Detail table ── */}
      <div className="ud-card">
        <div className="ud-card__header">
          <span className="ud-card__title">Exception Detail</span>
          <span className="ud-card__count">{visibleExceptions.length} records</span>
        </div>
        <div className="table-wrap">
          <table className="ud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Check Name</th>
                <th>Instrument</th>
                <th>Actual Value</th>
                <th>Allowed Limit</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {visibleExceptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-results">No exceptions match your search</td>
                </tr>
              ) : (
                visibleExceptions.map(ex => (
                  <tr key={ex.id}>
                    <td className="mono accent">{ex.id}</td>
                    <td>{ex.check}</td>
                    <td><span className="tag">{ex.instrument}</span></td>
                    <td className="mono" style={{ fontWeight: 700, color: ex.severity === 'critical' ? 'var(--danger)' : 'var(--warn)' }}>{ex.actual}</td>
                    <td className="mono muted">{ex.limit}</td>
                    <td><SeverityBadge severity={ex.severity} /></td>
                    <td><AckBadge status={ex.status} /></td>
                    <td className="mono muted small">{ex.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}