import { useState } from 'react';
import './Workflow.css';

const JOBS = [
  { id: 'JOB-1042', instrument: 'Empower',     site: 'Site A - Lab 1', schedule: 'Daily QC',     status: 'queued',      time: '08:00', checks: 24, anomalies: 3 },
  { id: 'JOB-1043', instrument: 'Chromeleon',   site: 'Site A - Lab 2', schedule: 'Weekly Audit', status: 'completed',   time: '07:30', checks: 18, anomalies: 1 },
  { id: 'JOB-1044', instrument: 'Bin Blender',  site: 'Site B - Mfg',  schedule: 'Batch Check',  status: 'running',     time: '09:15', checks: 20, anomalies: 5 },
  { id: 'JOB-1045', instrument: 'LIMS',         site: 'Site A - QA',   schedule: 'Daily Review', status: 'pending-ack', time: '06:00', checks: 30, anomalies: 0 },
  { id: 'JOB-1046', instrument: 'Port Based',   site: 'Site C - Lab 1',schedule: 'Hourly Check', status: 'completed',   time: '09:00', checks: 12, anomalies: 2 },
];

const EXCEPTIONS = [
  { id: 'EX-201', check: 'System Suitability - RSD', instrument: 'Empower',     actual: '2.8%',   limit: '<=2.0%', severity: 'critical' },
  { id: 'EX-202', check: 'Peak Tailing Factor',       instrument: 'Empower',     actual: '1.92',   limit: '<=1.5',  severity: 'warning'  },
  { id: 'EX-203', check: 'Column Efficiency (N)',      instrument: 'Empower',     actual: '4210',   limit: '>=5000', severity: 'critical' },
  { id: 'EX-204', check: 'Batch Uniformity CV',        instrument: 'Bin Blender', actual: '4.1%',   limit: '<=3.0%', severity: 'warning'  },
  { id: 'EX-205', check: 'Blending Time',              instrument: 'Bin Blender', actual: '32 min', limit: '30 min', severity: 'info'     },
];

const STEPS = ['Job Queue', 'Exception Review', 'Approval & Sign', 'Publish Report'];

function JobBadge({ status }) {
  const map = {
    running:       { label: 'Running',     cls: 'badge badge--blue pulse' },
    queued:        { label: 'Queued',      cls: 'badge badge--yellow'     },
    'pending-ack': { label: 'Pending Ack', cls: 'badge badge--red'        },
    completed:     { label: 'Done',        cls: 'badge badge--green'      },
  };
  const { label, cls } = map[status] || { label: status, cls: 'badge badge--grey' };
  return <span className={cls}>{label}</span>;
}

function SeverityBadge({ severity }) {
  const map = {
    critical: { label: 'Critical', cls: 'badge badge--red'    },
    warning:  { label: 'Warning',  cls: 'badge badge--yellow' },
    info:     { label: 'Info',     cls: 'badge badge--blue'   },
  };
  const { label, cls } = map[severity] || { label: severity, cls: 'badge badge--grey' };
  return <span className={cls}>{label}</span>;
}

function StepBar({ currentStep }) {
  return (
    <div className="stepbar">
      {STEPS.map((label, i) => {
        const isDone   = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="stepbar__item">
            {i > 0 && <div className={'stepbar__line ' + (isDone ? 'stepbar__line--done' : '')} />}
            <div className={'stepbar__bubble ' + (isDone ? 'stepbar__bubble--done' : isActive ? 'stepbar__bubble--active' : '')}>
              {isDone ? '✓' : i + 1}
            </div>
            <div className={'stepbar__label ' + (isActive ? 'stepbar__label--active' : isDone ? 'stepbar__label--done' : '')}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── STEP 1 ── */
function Step1JobQueue({ search, onSelectJob }) {
  const visible = search
    ? JOBS.filter(j =>
        [j.id, j.instrument, j.site, j.schedule, j.status].some(v =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : JOBS;

  return (
    <div className="step-content">
      <div className="info-box info-box--blue">
        <span className="info-box__icon">ℹ</span>
        <span>Pick a job from the list below to start the review process.</span>
      </div>

      <div className="card">
        <div className="card__header">
          <span className="card__title">Job Queue</span>
          <span className="badge badge--blue">{JOBS.length} jobs</span>
        </div>

        <div className="table-wrap">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Instrument</th>
                <th>Facility</th>
                <th>Schedule</th>
                <th>Time</th>
                <th>Checks</th>
                <th>Anomalies</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={9} className="no-results">No jobs match your search</td></tr>
              ) : visible.map(job => (
                <tr key={job.id} className="wf-table__row">
                  <td><span className="job-id-cell">{job.id}</span></td>
                  <td><span className="tag">{job.instrument}</span></td>
                  <td className="muted small">{job.site}</td>
                  <td className="small">{job.schedule}</td>
                  <td className="mono small">{job.time}</td>
                  <td className="mono center">{job.checks}</td>
                  <td className="center">
                    <span className={job.anomalies > 0 ? 'anomaly-num anomaly-num--bad' : 'anomaly-num anomaly-num--ok'}>
                      {job.anomalies}
                    </span>
                  </td>
                  <td><JobBadge status={job.status} /></td>
                  <td>
                    <button className="btn btn--primary btn--sm" onClick={() => onSelectJob(job)}>
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 2 ── */
function Step2ExceptionReview({ selectedJob, onBack, onNext }) {
  const [ticked, setTicked] = useState({});

  function toggleTick(id) {
    setTicked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function tickAll() {
    const all = {};
    EXCEPTIONS.forEach(e => { all[e.id] = true; });
    setTicked(all);
  }

  const tickedCount = Object.values(ticked).filter(Boolean).length;
  const allTicked   = tickedCount === EXCEPTIONS.length;
  const pct         = (tickedCount / EXCEPTIONS.length) * 100;

  return (
    <div className="step-content">
      <div className="info-box info-box--yellow">
        <span className="info-box__icon">⚠</span>
        <span>Read each exception carefully and tick the box to confirm you have reviewed it.</span>
      </div>

      {/* Job context strip */}
      <div className="job-strip">
        <div className="job-strip__left">
          <span className="job-strip__id">{selectedJob.id}</span>
          <span className="job-strip__divider">—</span>
          <span className="tag">{selectedJob.instrument}</span>
          <span className="muted small">{selectedJob.site}</span>
          <span className="muted small">· {selectedJob.schedule}</span>
        </div>
        <div className="job-strip__stats">
          <div className="stat-tile stat-tile--danger">
            <span className="stat-tile__val">{selectedJob.anomalies}</span>
            <span className="stat-tile__lbl">Exceptions</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__val">{selectedJob.checks}</span>
            <span className="stat-tile__lbl">Checks</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="card__title">Exception Checklist</span>
            <span className="badge badge--grey">{tickedCount} / {EXCEPTIONS.length}</span>
          </div>
          <button className="btn btn--secondary btn--sm" onClick={tickAll}>Tick All</button>
        </div>

        <div className="checklist">
          {EXCEPTIONS.map((ex, idx) => (
            <div
              key={ex.id}
              className={'checklist__item ' + (ticked[ex.id] ? 'checklist__item--ticked' : '')}
              onClick={() => toggleTick(ex.id)}
            >
              <span className="checklist__num">{String(idx + 1).padStart(2, '0')}</span>

              <div className={'checklist__box ' + (ticked[ex.id] ? 'checklist__box--ticked' : '')}>
                {ticked[ex.id] ? '✓' : ''}
              </div>

              <div className="checklist__body">
                <div className="checklist__name">
                  {ex.check}
                  <SeverityBadge severity={ex.severity} />
                </div>
                <div className="checklist__detail">
                  <span>Actual: <strong style={{ color: ex.severity === 'critical' ? 'var(--danger)' : 'var(--warn)' }}>{ex.actual}</strong></span>
                  <span className="meta-dot">·</span>
                  <span>Limit: <strong>{ex.limit}</strong></span>
                  <span className="meta-dot">·</span>
                  <span className="muted">{ex.instrument}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="checklist__footer">
          <div className="checklist__progress-labels">
            <span>{tickedCount} of {EXCEPTIONS.length} reviewed</span>
            <span style={{ color: allTicked ? 'var(--success)' : 'var(--text3)' }}>
              {allTicked ? '✓ All done!' : `${EXCEPTIONS.length - tickedCount} remaining`}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: pct + '%' }} />
          </div>
        </div>

        <div className="card__footer">
          <button className="btn btn--secondary" onClick={onBack}>← Back</button>
          <button
            className={'btn btn--primary' + (!allTicked ? ' btn--disabled' : '')}
            onClick={allTicked ? onNext : undefined}
          >
            Go to Approval →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 3 ── */
function Step3Approval({ onBack, onNext }) {
  const [comment,  setComment]  = useState('');
  const [password, setPassword] = useState('');

  const approvers = [
    { step: 1, role: 'Analyst (Self)', name: 'Dr. Ananya Sharma', status: 'done'    },
    { step: 2, role: 'Reviewer',       name: 'Rajesh Kumar',      status: 'pending' },
    { step: 3, role: 'QA Manager',     name: 'Sanjay Mehta',      status: 'waiting' },
  ];

  const canSubmit = comment.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="step-content">
      <div className="info-box info-box--green">
        <span className="info-box__icon">✓</span>
        <span>All exceptions reviewed! Fill in your comment and password to sign off.</span>
      </div>

      <div className="two-col-layout">
        {/* Approval chain */}
        <div className="card">
          <div className="card__header">
            <span className="card__title">Approval Chain</span>
          </div>
          <div className="approval-chain">
            {approvers.map((ap, i) => (
              <div key={ap.step} className="approver-row">
                <div className="approver-row__left">
                  <div className={
                    'approver-circle ' +
                    (ap.status === 'done' ? 'approver-circle--done' : ap.status === 'pending' ? 'approver-circle--pending' : 'approver-circle--waiting')
                  }>
                    {ap.status === 'done' ? '✓' : ap.step}
                  </div>
                  {i < approvers.length - 1 && (
                    <div className={'approver-vline' + (ap.status === 'done' ? ' approver-vline--done' : '')} />
                  )}
                </div>
                <div className="approver-row__body">
                  <div className="approver-role">{ap.role}</div>
                  <div className="approver-name">{ap.name}</div>
                </div>
                <span className={
                  'badge ' +
                  (ap.status === 'done' ? 'badge--green' : ap.status === 'pending' ? 'badge--yellow' : 'badge--grey')
                }>
                  {ap.status === 'done' ? 'Signed' : ap.status === 'pending' ? 'Pending' : 'Waiting'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off form */}
        <div className="card">
          <div className="card__header">
            <span className="card__title">Electronic Signature</span>
          </div>
          <div className="sign-form">
            <div className="form-field">
              <label className="form-label">Your Comment</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Write your review comments here…"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Username</label>
                <input className="form-input form-input--locked" value="a.sharma@xcept.io" readOnly />
              </div>
              <div className="form-field">
                <label className="form-label">Password / PIN</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter your password to sign"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card__footer">
            <button className="btn btn--secondary" onClick={onBack}>← Back</button>
            <button
              className={'btn btn--primary' + (!canSubmit ? ' btn--disabled' : '')}
              onClick={canSubmit ? onNext : undefined}
            >
              Sign & Submit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── STEP 4 ── */
function Step4Publish({ selectedJob, onBack, onRestart }) {
  const [published, setPublished] = useState(false);

  const summaryRows = [
    ['Report ID',       'RPT-0096'],
    ['Instrument',      selectedJob?.instrument || 'Empower'],
    ['Date',            '2024-01-15'],
    ['Total Exceptions','5'],
    ['Reviewed',        '5'],
    ['Approved by',     'Rajesh Kumar'],
  ];

  if (published) {
    return (
      <div className="step-content">
        <div className="success-screen">
          <div className="success-screen__icon">🎉</div>
          <div className="success-screen__title">Report Published!</div>
          <div className="success-screen__sub">RPT-0096 has been sent to the distribution list.</div>
          <button className="btn btn--primary" onClick={onRestart}>Start a New Review</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content">
      <div className="info-box info-box--green">
        <span className="info-box__icon">✓</span>
        <span>All approvals complete. Review the summary below and publish when ready.</span>
      </div>

      <div className="two-col-layout">
        <div className="card">
          <div className="card__header">
            <span className="card__title">Report Summary</span>
          </div>
          <div className="summary-grid">
            {summaryRows.map(([label, value]) => (
              <div key={label} className="summary-cell">
                <div className="summary-cell__label">{label}</div>
                <div className="summary-cell__value">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <span className="card__title">Distribution Settings</span>
          </div>
          <div className="sign-form">
            <div className="form-field">
              <label className="form-label">Send Report To</label>
              <input className="form-input" placeholder="qa@org.io, manager@org.io…" />
            </div>
            <div className="form-field">
              <label className="form-label">File Format</label>
              <select className="form-input form-select">
                <option>PDF</option>
                <option>Excel</option>
                <option>PDF + Excel</option>
              </select>
            </div>
          </div>
          <div className="card__footer">
            <button className="btn btn--secondary" onClick={onBack}>← Back</button>
            <button className="btn btn--secondary">Preview</button>
            <button className="btn btn--primary" onClick={() => setPublished(true)}>
              Publish Report ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedJob,  setSelectedJob]  = useState(null);
  const [search,       setSearch]       = useState('');

  function handleSelectJob(job) {
    setSelectedJob(job);
    setCurrentStep(1);
  }

  function handleRestart() {
    setCurrentStep(0);
    setSelectedJob(null);
    setSearch('');
  }

  return (
    <div className="wf-page">
      <div className="wf-page__header">
        <div>
          <h1 className="wf-page__title">User Workflows</h1>
          <p className="wf-page__subtitle">Review jobs step by step: Queue → Review → Approve → Publish</p>
        </div>
        {currentStep === 0 && (
          <div className="search-box">
            <span className="search-box__icon">🔍</span>
            <input
              type="text"
              className="search-box__input"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-box__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        )}
      </div>

      <StepBar currentStep={currentStep} />

      {currentStep === 0 && <Step1JobQueue search={search} onSelectJob={handleSelectJob} />}
      {currentStep === 1 && (
        <Step2ExceptionReview
          selectedJob={selectedJob}
          onBack={() => setCurrentStep(0)}
          onNext={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 2 && (
        <Step3Approval
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
        <Step4Publish
          selectedJob={selectedJob}
          onBack={() => setCurrentStep(2)}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}