import { useState } from 'react';
import './Workflowconfig.css';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const WORKFLOWS_DATA = [
  { id: 1, name: 'CDS Exception Approval',      scope: 'Empower, Chromeleon, LabSolutions', steps: 3, status: 'active' },
  { id: 2, name: 'Manufacturing Batch Review',   scope: 'Bin Blender, Coater',               steps: 4, status: 'active' },
  { id: 3, name: 'LIMS Data Review',             scope: 'LIMS',                              steps: 2, status: 'active' },
  { id: 4, name: 'Port-Based Alert Workflow',    scope: 'Port Based',                        steps: 2, status: 'draft'  },
];

const DEFAULT_STEPS = [
  { id: 1, role: 'Analyst',  desc: 'Self-acknowledgement',    trigger: 'Exception Detected', timeout: '4 Hours',  required: true  },
  { id: 2, role: 'Reviewer', desc: 'QA Reviewer validation',  trigger: 'Job Completed',      timeout: '8 Hours',  required: true  },
  { id: 3, role: 'Manager',  desc: 'Lab Manager approval',    trigger: 'Threshold Breach',   timeout: '24 Hours', required: false },
];

const EMPTY_STEP = { role: '', desc: '', trigger: 'Exception Detected', timeout: '4 Hours', required: true };

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */
function EditModal({ workflow, onSave, onClose }) {
  const [name,   setName]   = useState(workflow.name);
  const [scope,  setScope]  = useState(workflow.scope);
  const [status, setStatus] = useState(workflow.status);

  function handleSave() {
    if (!name.trim()) return;
    onSave({ ...workflow, name: name.trim(), scope: scope.trim(), status });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__title">Edit Workflow</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <div className="form-field">
            <label className="field-label">Workflow Name *</label>
            <input className="field-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">Scope (systems)</label>
            <input className="field-input" value={scope} onChange={e => setScope(e.target.value)} placeholder="e.g. Empower, LIMS..." />
          </div>
          <div className="form-field">
            <label className="field-label">Status</label>
            <select className="field-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          {!name.trim() && <div className="form-hint">⚠ Workflow name is required</div>}
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={!name.trim()} style={{ opacity: name.trim() ? 1 : 0.5 }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ConfigWorkflow() {
  const [workflows, setWorkflows] = useState(WORKFLOWS_DATA);
  const [search,    setSearch]    = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);

  // Builder form state
  const [formName,    setFormName]    = useState('');
  const [formScope,   setFormScope]   = useState('');
  const [formTrigger, setFormTrigger] = useState('Exception Detected');
  const [formTimeout, setFormTimeout] = useState('4 Hours');
  const [formNotify,  setFormNotify]  = useState('Email + App');
  const [steps,       setSteps]       = useState([...DEFAULT_STEPS]);

  /* ── Step management ── */
  function addStep() {
    setSteps(prev => [...prev, { ...EMPTY_STEP, id: Date.now() }]);
  }

  function updateStep(id, field, value) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function deleteStep(id) {
    setSteps(prev => prev.filter(s => s.id !== id));
  }

  /* ── Save workflow ── */
  function handleSave() {
    if (!formName.trim()) return;
    const newWf = {
      id:     workflows.length + 1,
      name:   formName.trim(),
      scope:  formScope.trim() || 'All',
      steps:  steps.length,
      status: 'active',
    };
    setWorkflows(prev => [...prev, newWf]);
    // reset
    setFormName(''); setFormScope('');
    setFormTrigger('Exception Detected'); setFormTimeout('4 Hours');
    setSteps([...DEFAULT_STEPS]);
    setShowForm(false);
  }

  /* ── Edit save ── */
  function handleEditSave(updated) {
    setWorkflows(prev => prev.map(w => w.id === updated.id ? updated : w));
    setEditItem(null);
  }

  /* ── Delete ── */
  function deleteWorkflow(id) {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  }

  /* ── Toggle status ── */
  function toggleStatus(id) {
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'draft' : 'active' } : w)
    );
  }

  const filtered = workflows.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.scope.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cw-page">

      {/* ── Header with inline search ── */}
      <div className="cw-page__header">
        <div>
          <h1 className="cw-page__title">Workflow Configuration</h1>
          <p className="cw-page__subtitle">Multi-level approval workflows</p>
        </div>
        <div className="cw-header-right">
          <div className="search-box">
            <span className="search-box__icon">&#128269;</span>
            <input
              className="search-box__input"
              placeholder="Search workflows..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(p => !p)}>
            {showForm ? '✕ Cancel' : '+ Create Workflow'}
          </button>
        </div>
      </div>

      {/* ── Workflow Builder Form ── */}
      {showForm && (
        <div className="cw-form-card">
          <div className="cw-form-card__title">Workflow Builder</div>

          {/* Basic settings */}
          <div className="form-row-3">
            <div className="form-field">
              <label className="field-label">Workflow Name *</label>
              <input className="field-input" placeholder="e.g. CDS Approval Flow" value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">System Scope</label>
              <input className="field-input" placeholder="e.g. Empower, LIMS..." value={formScope} onChange={e => setFormScope(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Notification</label>
              <select className="field-select" value={formNotify} onChange={e => setFormNotify(e.target.value)}>
                <option>Email + App</option>
                <option>Email Only</option>
                <option>App Only</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Trigger Event</label>
              <select className="field-select" value={formTrigger} onChange={e => setFormTrigger(e.target.value)}>
                <option>Exception Detected</option>
                <option>Job Completed</option>
                <option>Threshold Breach</option>
                <option>Scheduled Run</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Escalation Timeout</label>
              <select className="field-select" value={formTimeout} onChange={e => setFormTimeout(e.target.value)}>
                <option>4 Hours</option>
                <option>8 Hours</option>
                <option>24 Hours</option>
                <option>48 Hours</option>
              </select>
            </div>
          </div>

          {/* Steps builder */}
          <div className="steps-builder">
            <div className="steps-builder__header">
              <span className="steps-builder__title">Approval Steps</span>
              <button className="btn btn--secondary btn--sm" onClick={addStep}>+ Add Step</button>
            </div>

            {steps.map((step, index) => (
              <div key={step.id} className="step-row">

                {/* Step number */}
                <div className="step-row__num">{index + 1}</div>

                {/* Fields */}
                <div className="step-row__fields">
                  <div className="form-field">
                    <label className="field-label">Role *</label>
                    <input
                      className="field-input"
                      placeholder="e.g. Analyst"
                      value={step.role}
                      onChange={e => updateStep(step.id, 'role', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Description</label>
                    <input
                      className="field-input"
                      placeholder="e.g. Self-acknowledgement"
                      value={step.desc}
                      onChange={e => updateStep(step.id, 'desc', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Timeout</label>
                    <select className="field-select" value={step.timeout} onChange={e => updateStep(step.id, 'timeout', e.target.value)}>
                      <option>4 Hours</option>
                      <option>8 Hours</option>
                      <option>24 Hours</option>
                      <option>48 Hours</option>
                    </select>
                  </div>
                  <div className="form-field form-field--center">
                    <label className="field-label">Required</label>
                    <div
                      className={'toggle ' + (step.required ? 'toggle--on' : '')}
                      onClick={() => updateStep(step.id, 'required', !step.required)}
                    >
                      <div className="toggle__knob" />
                    </div>
                  </div>
                </div>

                {/* Delete step */}
                {steps.length > 1 && (
                  <button className="step-row__del" onClick={() => deleteStep(step.id)}>✕</button>
                )}

              </div>
            ))}
          </div>

          {!formName.trim() && <div className="form-hint">⚠ Workflow name is required</div>}

          <div className="form-actions">
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={!formName.trim()}
              style={{ opacity: formName.trim() ? 1 : 0.5 }}
            >
              Save Workflow
            </button>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>

        </div>
      )}

      {/* ── Active Workflows ── */}
      <div className="cw-section">
        <div className="cw-section__header">
          <span className="cw-section__title">Active Workflows</span>
          <span className="badge badge--blue">{workflows.length} workflows</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚙️</div>
            <div className="empty-state__text">No workflows found</div>
            <div className="empty-state__sub">Try a different search or create a new workflow</div>
          </div>
        ) : (
          <div className="cw-list">
            {filtered.map(w => (
              <div key={w.id} className="cw-item">
                <div className="cw-item__icon">↔</div>
                <div className="cw-item__info">
                  <div className="cw-item__name">{w.name}</div>
                  <div className="cw-item__scope">{w.scope}</div>
                </div>
                <span className="chip">{w.steps} steps</span>
                <span className={'badge ' + (w.status === 'active' ? 'badge--green' : 'badge--grey')}>
                  {w.status === 'active' ? 'Active' : 'Draft'}
                </span>
                <div className="row-actions">
                  <button
                    className={'btn btn--sm ' + (w.status === 'active' ? 'btn--secondary' : 'btn--accent')}
                    onClick={() => toggleStatus(w.id)}
                  >
                    {w.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn btn--secondary btn--sm" onClick={() => setEditItem(w)}>Edit</button>
                  <button className="btn btn--danger btn--sm"    onClick={() => deleteWorkflow(w.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <EditModal
          workflow={editItem}
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}

    </div>
  );
}