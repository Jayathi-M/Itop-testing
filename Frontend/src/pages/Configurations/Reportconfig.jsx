import { useState } from 'react';
import './Reportconfig.css';

const SCHEDULED_REPORTS = [
  { id: 1, name: 'Daily Exception Summary',  freq: 'Daily 06:00',  recipients: 3, fmt: 'PDF',         lastRun: '2024-01-15', status: 'active' },
  { id: 2, name: 'Weekly CDS Compliance',    freq: 'Monday 08:00', recipients: 5, fmt: 'PDF + XLS',    lastRun: '2024-01-08', status: 'active' },
  { id: 3, name: 'Monthly Audit Report',     freq: '1st of Month', recipients: 8, fmt: 'PDF',          lastRun: '2024-01-01', status: 'active' },
  { id: 4, name: 'Batch Completion Report',  freq: 'Per Batch',    recipients: 4, fmt: 'PDF',          lastRun: '2024-01-14', status: 'active' },
  { id: 5, name: 'Management KPI Summary',   freq: 'Monthly',      recipients: 3, fmt: 'PDF',          lastRun: '2024-01-01', status: 'paused' },
];

export default function ConfigReports() {
  const [reports,  setReports]  = useState(SCHEDULED_REPORTS);
  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName,  setFormName]  = useState('');
  const [formType,  setFormType]  = useState('Exception Summary');
  const [formScope, setFormScope] = useState('All');
  const [formFreq,  setFormFreq]  = useState('Daily');
  const [formTime,  setFormTime]  = useState('06:00');
  const [formFmt,   setFormFmt]   = useState('PDF');
  const [formEmail, setFormEmail] = useState('');

  function handleSave() {
    if (!formName.trim()) return;
    const newReport = {
      id:         reports.length + 1,
      name:       formName.trim(),
      freq:       formFreq + (formTime ? ' ' + formTime : ''),
      recipients: formEmail ? formEmail.split(',').length : 0,
      fmt:        formFmt,
      lastRun:    'Never',
      status:     'active',
    };
    setReports(prev => [...prev, newReport]);
    // reset
    setFormName(''); setFormType('Exception Summary'); setFormScope('All');
    setFormFreq('Daily'); setFormTime('06:00'); setFormFmt('PDF'); setFormEmail('');
    setShowForm(false);
  }

  function deleteReport(id) {
    setReports(prev => prev.filter(r => r.id !== id));
  }

  function toggleStatus(id) {
    setReports(prev =>
      prev.map(r => r.id === id
        ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
        : r
      )
    );
  }

  const filtered = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cr-page">

      {/* ── Header with inline search ── */}
      <div className="cr-page__header">
        <div>
          <h1 className="cr-page__title">Report Configuration</h1>
          <p className="cr-page__subtitle">Manage scheduled and on-demand reports</p>
        </div>
        <div className="cr-header-right">
          <div className="search-box">
            <span className="search-box__icon">&#128269;</span>
            <input
              className="search-box__input"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(p => !p)}>
            {showForm ? '✕ Cancel' : '+ Schedule Report'}
          </button>
        </div>
      </div>

      {/* ── New Report Form ── */}
      {showForm && (
        <div className="cr-form-card">
          <div className="cr-form-card__title">New Scheduled Report</div>

          <div className="form-row-3">
            <div className="form-field">
              <label className="field-label">Report Name *</label>
              <input
                className="field-input"
                placeholder="e.g. Daily QC Summary"
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Report Type</label>
              <select className="field-select" value={formType} onChange={e => setFormType(e.target.value)}>
                <option>Exception Summary</option>
                <option>Compliance Report</option>
                <option>Audit Trail</option>
                <option>Performance</option>
                <option>Batch Review</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">System Scope</label>
              <select className="field-select" value={formScope} onChange={e => setFormScope(e.target.value)}>
                <option>All</option>
                <option>Quality / CDS</option>
                <option>Non-CDS</option>
                <option>Manufacturing</option>
                <option>Enterprise</option>
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-field">
              <label className="field-label">Frequency</label>
              <select className="field-select" value={formFreq} onChange={e => setFormFreq(e.target.value)}>
                <option>Per Event</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Per Batch</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Run At</label>
              <input className="field-input" type="time" value={formTime} onChange={e => setFormTime(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Format</label>
              <select className="field-select" value={formFmt} onChange={e => setFormFmt(e.target.value)}>
                <option>PDF</option>
                <option>Excel</option>
                <option>PDF + Excel</option>
                <option>Word</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Distribution Emails</label>
            <input
              className="field-input"
              placeholder="qa@org.io, mgr@org.io..."
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
            />
          </div>

          {!formName.trim() && (
            <div className="form-hint">⚠ Report name is required</div>
          )}

          <div className="form-actions">
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={!formName.trim()}
              style={{ opacity: formName.trim() ? 1 : 0.5 }}
            >
              Save Schedule
            </button>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Scheduled Reports List ── */}
      <div className="cr-section">
        <div className="cr-section__header">
          <span className="cr-section__title">Scheduled Reports</span>
          <span className="badge badge--blue">{reports.length} schedules</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__text">No reports found</div>
            <div className="empty-state__sub">Try a different search or schedule a new report</div>
          </div>
        ) : (
          <div className="cr-list">
            {filtered.map(r => (
              <div key={r.id} className="cr-item">
                <div className="cr-item__icon">📋</div>
                <div className="cr-item__info">
                  <div className="cr-item__name">{r.name}</div>
                  <div className="cr-item__meta-row">
                    <span className="chip">{r.freq}</span>
                    <span className="chip">{r.recipients} recipients</span>
                    <span className="chip">{r.fmt}</span>
                  </div>
                </div>
                <div className="cr-item__last">
                  <span className="small muted">Last Run</span>
                  <span className="small mono">{r.lastRun}</span>
                </div>
                <span className={'badge ' + (r.status === 'active' ? 'badge--green' : 'badge--yellow')}>
                  {r.status === 'active' ? 'Active' : 'Paused'}
                </span>
                <div className="row-actions">
                  <button
                    className={'btn btn--sm ' + (r.status === 'active' ? 'btn--secondary' : 'btn--accent')}
                    onClick={() => toggleStatus(r.id)}
                  >
                    {r.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button className="btn btn--secondary btn--sm">Edit</button>
                  <button className="btn btn--danger btn--sm" onClick={() => deleteReport(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Default Report Sections ── */}
      <div className="cr-section">
        <div className="cr-section__header">
          <span className="cr-section__title">Default Report Sections</span>
          <span className="small muted">Applied to all new scheduled reports</span>
        </div>
        <div className="cr-sections-grid">
          {['Executive Summary','Exception Details','Checklist Audit','Approval Log','Statistical Analysis','Risk Index','Timeline View','Raw Data Export'].map((s, i) => (
            <label key={i} className="cr-section-item">
              <input type="checkbox" defaultChecked={i < 5} className="cr-section-item__check" />
              <span className="cr-section-item__label">{s}</span>
            </label>
          ))}
        </div>
        <div className="form-actions">
          <button className="btn btn--primary">Save Defaults</button>
        </div>
      </div>

    </div>
  );
}