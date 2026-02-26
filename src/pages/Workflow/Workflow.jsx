import { useState } from 'react';
import './Workflow.css';

// ── All jobs waiting to be reviewed ──
const JOBS = [
  { id: 'JOB-1042', instrument: 'Empower',     site: 'Site A - Lab 1', schedule: 'Daily QC',     status: 'queued',      time: '08:00', checks: 24, anomalies: 3 },
  { id: 'JOB-1043', instrument: 'Chromeleon',   site: 'Site A - Lab 2', schedule: 'Weekly Audit', status: 'completed',   time: '07:30', checks: 18, anomalies: 1 },
  { id: 'JOB-1044', instrument: 'Bin Blender',  site: 'Site B - Mfg',  schedule: 'Batch Check',  status: 'running',     time: '09:15', checks: 20, anomalies: 5 },
  { id: 'JOB-1045', instrument: 'LIMS',         site: 'Site A - QA',   schedule: 'Daily Review', status: 'pending-ack', time: '06:00', checks: 30, anomalies: 0 },
  { id: 'JOB-1046', instrument: 'Port Based',   site: 'Site C - Lab 1',schedule: 'Hourly Check', status: 'completed',   time: '09:00', checks: 12, anomalies: 2 },
];

// ── Exceptions that need to be checked off in Step 2 ──
const EXCEPTIONS = [
  { id: 'EX-201', check: 'System Suitability - RSD', instrument: 'Empower',     actual: '2.8%',   limit: '<=2.0%', severity: 'critical' },
  { id: 'EX-202', check: 'Peak Tailing Factor',       instrument: 'Empower',     actual: '1.92',   limit: '<=1.5',  severity: 'warning'  },
  { id: 'EX-203', check: 'Column Efficiency (N)',      instrument: 'Empower',     actual: '4210',   limit: '>=5000', severity: 'critical' },
  { id: 'EX-204', check: 'Batch Uniformity CV',        instrument: 'Bin Blender', actual: '4.1%',   limit: '<=3.0%', severity: 'warning'  },
  { id: 'EX-205', check: 'Blending Time',              instrument: 'Bin Blender', actual: '32 min', limit: '30 min', severity: 'info'     },
];

// ── The 4 steps in the workflow ──
const STEPS = ['Job Queue', 'Exception Review', 'Approval & Sign', 'Publish Report'];

// ── Colored badge for job status ──
function JobBadge({ status }) {
  const map = {
    running:       { label: 'Running',      cls: 'badge--blue pulse' },
    queued:        { label: 'Queued',       cls: 'badge--yellow'     },
    'pending-ack': { label: 'Pending Ack',  cls: 'badge--red'        },
    completed:     { label: 'Done',         cls: 'badge--green'      },
  };
  const { label, cls } = map[status] || { label: status, cls: 'badge--grey' };
  return <span className={'badge ' + cls}>{label}</span>;
}

// ── Colored badge for exception severity ──
function SeverityBadge({ severity }) {
  const map = {
    critical: { label: 'Critical', cls: 'badge--red'    },
    warning:  { label: 'Warning',  cls: 'badge--yellow' },
    info:     { label: 'Info',     cls: 'badge--blue'   },
  };
  const { label, cls } = map[severity] || { label: severity, cls: 'badge--grey' };
  return <span className={'badge ' + cls}>{label}</span>;
}

// ── Step progress bar at the top ──
function StepBar({ currentStep }) {
  return (
    <div className="step-bar">
      {STEPS.map((label, i) => {
        const isDone   = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="step-bar__item">
            {/* Connecting line between steps — skip before first step */}
            {i > 0 && <div className={'step-bar__line ' + (isDone ? 'step-bar__line--done' : '')} />}

            <div className={'step-bar__circle ' + (isDone ? 'step-bar__circle--done' : isActive ? 'step-bar__circle--active' : '')}>
              {/* Show a checkmark if step is already done */}
              {isDone ? '✓' : i + 1}
            </div>
            <div className={'step-bar__label ' + (isActive ? 'step-bar__label--active' : isDone ? 'step-bar__label--done' : '')}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP 1 — Job Queue
// Shows a table of all jobs. Click "Review" to pick one.
// ──────────────────────────────────────────────────
function Step1JobQueue({ search, onSelectJob }) {
  const visible = search
    ? JOBS.filter(j =>
        j.id.toLowerCase().includes(search.toLowerCase()) ||
        j.instrument.toLowerCase().includes(search.toLowerCase()) ||
        j.site.toLowerCase().includes(search.toLowerCase())
      )
    : JOBS;

  return (
    <div className="step-content">
      <div className="info-box info-box--blue">
        Pick a job from the list below to start the review process.
      </div>

      <div className="wf-card">
        <div className="wf-card__header">
          <span className="wf-card__title">Job Queue</span>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={9} className="no-results">No jobs match your search</td></tr>
              ) : (
                visible.map(job => (
                  <tr key={job.id}>
                    <td className="mono accent">{job.id}</td>
                    <td><span className="tag">{job.instrument}</span></td>
                    <td className="muted small">{job.site}</td>
                    <td className="small">{job.schedule}</td>
                    <td className="mono small">{job.time}</td>
                    <td className="mono">{job.checks}</td>
                    <td className="mono" style={{ fontWeight: 700, color: job.anomalies > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {job.anomalies}
                    </td>
                    <td><JobBadge status={job.status} /></td>
                    <td>
                      <button className="btn btn--primary btn--sm" onClick={() => onSelectJob(job)}>
                        Review &rarr;
                      </button>
                    </td>
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

// ──────────────────────────────────────────────────
// STEP 2 — Exception Review
// Tick off each exception to say you've reviewed it.
// ──────────────────────────────────────────────────
function Step2ExceptionReview({ selectedJob, onBack, onNext }) {
  // Keep track of which exceptions have been ticked
  const [ticked, setTicked] = useState({});

  function toggleTick(id) {
    setTicked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function tickAll() {
    const all = {};
    EXCEPTIONS.forEach(e => { all[e.id] = true; });
    setTicked(all);
  }

  const tickedCount   = Object.values(ticked).filter(Boolean).length;
  const allTicked     = tickedCount === EXCEPTIONS.length;

  return (
    <div className="step-content">
      <div className="info-box info-box--yellow">
        Read each exception carefully and tick the box to confirm you have reviewed it.
      </div>

      {/* Selected job info */}
      <div className="wf-card" style={{ marginBottom: 14 }}>
        <div className="wf-card__header">
          <div>
            <div className="wf-card__title">{selectedJob.id} &mdash; {selectedJob.instrument}</div>
            <div className="wf-card__sub">{selectedJob.site} &nbsp;|&nbsp; {selectedJob.schedule}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge--red">{selectedJob.anomalies} exceptions</span>
            <span className="badge badge--grey">{selectedJob.checks} checks</span>
          </div>
        </div>
      </div>

      {/* Exception checklist */}
      <div className="wf-card">
        <div className="wf-card__header">
          <span className="wf-card__title">Exception Checklist</span>
          <button className="btn btn--secondary btn--sm" onClick={tickAll}>
            Tick All
          </button>
        </div>

        <div className="checklist">
          {EXCEPTIONS.map(ex => (
            <div
              key={ex.id}
              className={'checklist__item ' + (ticked[ex.id] ? 'checklist__item--ticked' : '')}
              onClick={() => toggleTick(ex.id)}
            >
              {/* Tick box */}
              <div className={'checklist__box ' + (ticked[ex.id] ? 'checklist__box--ticked' : '')}>
                {ticked[ex.id] ? '✓' : ''}
              </div>

              {/* Exception details */}
              <div className="checklist__body">
                <div className="checklist__name">
                  {ex.check}
                  <SeverityBadge severity={ex.severity} />
                </div>
                <div className="checklist__detail">
                  Actual: <strong style={{ color: ex.severity === 'critical' ? 'var(--danger)' : 'var(--warn)' }}>{ex.actual}</strong>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  Allowed: <strong>{ex.limit}</strong>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  {ex.instrument}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar showing how many have been ticked */}
        <div className="checklist__progress">
          <div className="checklist__progress-label">
            <span>{tickedCount} of {EXCEPTIONS.length} reviewed</span>
            <span style={{ color: allTicked ? 'var(--success)' : 'var(--text3)' }}>
              {allTicked ? 'All done!' : `${EXCEPTIONS.length - tickedCount} remaining`}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: (tickedCount / EXCEPTIONS.length * 100) + '%' }}
            />
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn--secondary" onClick={onBack}>&larr; Back</button>
          <button
            className={'btn btn--primary ' + (!allTicked ? 'btn--disabled' : '')}
            onClick={allTicked ? onNext : undefined}
          >
            Go to Approval &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP 3 — Approval & Electronic Signature
// Shows the approval chain and a sign-off form.
// ──────────────────────────────────────────────────
function Step3Approval({ onBack, onNext }) {
  const [comment, setComment]   = useState('');
  const [password, setPassword] = useState('');

  const approvers = [
    { step: 1, role: 'Analyst (Self)',  name: 'Dr. Ananya Sharma', status: 'done'    },
    { step: 2, role: 'Reviewer',        name: 'Rajesh Kumar',      status: 'pending' },
    { step: 3, role: 'QA Manager',      name: 'Sanjay Mehta',      status: 'waiting' },
  ];

  const canSubmit = comment.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="step-content">
      <div className="info-box info-box--green">
        All exceptions reviewed! Fill in your comment and password below to sign off.
      </div>

      {/* Approval chain */}
      <div className="wf-card" style={{ marginBottom: 14 }}>
        <div className="wf-card__header">
          <span className="wf-card__title">Approval Chain</span>
        </div>
        <div className="approval-chain">
          {approvers.map((ap) => (
            <div key={ap.step} className="approver-row">
              {/* Step number circle */}
              <div className={
                'approver-num ' +
                (ap.status === 'done' ? 'approver-num--done' : ap.status === 'pending' ? 'approver-num--pending' : 'approver-num--waiting')
              }>
                {ap.status === 'done' ? '✓' : ap.step}
              </div>
              <div className="approver-info">
                <div className="approver-role">{ap.role}</div>
                <div className="approver-name">{ap.name}</div>
              </div>
              <span className={
                'badge ' +
                (ap.status === 'done' ? 'badge--green' : ap.status === 'pending' ? 'badge--yellow' : 'badge--grey')
              }>
                {ap.status === 'done' ? 'Signed' : ap.status === 'pending' ? 'Waiting' : 'Not yet'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-off form */}
      <div className="wf-card">
        <div className="wf-card__header">
          <span className="wf-card__title">Electronic Signature</span>
        </div>

        <div className="sign-form">
          <div className="sign-form__row">
            <div className="sign-form__field">
              <label className="field-label">Your Comment</label>
              <textarea
                className="field-textarea"
                rows={3}
                placeholder="Write your review comments here..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            <div>
              <div className="sign-form__field">
                <label className="field-label">Username</label>
                <input className="field-input" value="a.sharma@xcept.io" readOnly />
              </div>
              <div className="sign-form__field" style={{ marginTop: 10 }}>
                <label className="field-label">Password / PIN</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="Enter your password to sign"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn--secondary" onClick={onBack}>&larr; Back</button>
          <button
            className={'btn btn--primary ' + (!canSubmit ? 'btn--disabled' : '')}
            onClick={canSubmit ? onNext : undefined}
          >
            Sign &amp; Submit &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP 4 — Publish Report
// Shows a summary and lets the user publish the report.
// ──────────────────────────────────────────────────
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
        <div className="published-screen">
          <div className="published-screen__icon">&#127881;</div>
          <div className="published-screen__title">Report Published!</div>
          <div className="published-screen__sub">RPT-0096 has been sent to the distribution list.</div>
          <button className="btn btn--primary" onClick={onRestart}>Start a New Review</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content">
      <div className="info-box info-box--green">
        All approvals are complete. Review the summary below and publish when ready.
      </div>

      <div className="wf-card">
        <div className="wf-card__header">
          <span className="wf-card__title">Report Summary</span>
        </div>

        {/* Summary grid */}
        <div className="summary-grid">
          {summaryRows.map(([label, value]) => (
            <div key={label} className="summary-cell">
              <div className="summary-cell__label">{label}</div>
              <div className="summary-cell__value">{value}</div>
            </div>
          ))}
        </div>

        {/* Distribution settings */}
        <div className="publish-fields">
          <div className="sign-form__field">
            <label className="field-label">Send report to (email addresses)</label>
            <input className="field-input" placeholder="qa@org.io, manager@org.io..." />
          </div>
          <div className="sign-form__field">
            <label className="field-label">File format</label>
            <select className="field-input">
              <option>PDF</option>
              <option>Excel</option>
              <option>PDF + Excel</option>
            </select>
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn--secondary" onClick={onBack}>&larr; Back</button>
          <button className="btn btn--secondary">Preview</button>
          <button className="btn btn--primary" onClick={() => setPublished(true)}>
            Publish Report &#10003;
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// MAIN PAGE COMPONENT — brings all 4 steps together
// ──────────────────────────────────────────────────
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

      {/* ── Title left, search right ── */}
      <div className="wf-page__header">
        <div>
          <h1 className="wf-page__title">User Workflows</h1>
          <p className="wf-page__subtitle">Review jobs step by step: Queue &rarr; Review &rarr; Approve &rarr; Publish</p>
        </div>
        {/* Only show search on step 1 where there's a table to filter */}
        {currentStep === 0 && (
          <div className="wf-search">
            <span className="wf-search__icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="wf-search__input"
            />
          </div>
        )}
      </div>

      {/* ── 4-step progress bar ── */}
      <StepBar currentStep={currentStep} />

      {/* ── Current step content ── */}
      {currentStep === 0 && (
        <Step1JobQueue search={search} onSelectJob={handleSelectJob} />
      )}
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