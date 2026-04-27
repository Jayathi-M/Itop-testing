import { useState } from 'react';
import './Businessruleconfig.css';

interface Rule {
  id: number;
  name: string;
  system: string;
  condition: string;
  action: string;
  severity: string;
  status: string;
}

interface RuleLine {
  id: number;
  system: string;
  parameter: string;
  operator: string;
  value: string;
  action: string;
  severity: string;
}

const RULES_DATA: Rule[] = [
  { id: 1, name: 'RSD Threshold Breach',     system: 'Empower',       condition: 'rsd_value > 2.0%',        action: 'Raise Exception',  severity: 'high',   status: 'active' },
  { id: 2, name: 'Tailing Factor Alert',     system: 'Chromeleon',    condition: 'tailing_factor > 1.5',    action: 'Notify Analyst',   severity: 'medium', status: 'active' },
  { id: 3, name: 'Batch CV Out of Range',    system: 'Bin Blender',   condition: 'batch_cv > 3.0%',         action: 'Raise Exception',  severity: 'high',   status: 'active' },
  { id: 4, name: 'LIMS Sync Delay',          system: 'LIMS',          condition: 'sync_delay > 1 hour',     action: 'Notify Admin',     severity: 'low',    status: 'active' },
  { id: 5, name: 'File Received Delay',      system: 'File Based',    condition: 'file_delay > 30 min',     action: 'Raise Exception',  severity: 'medium', status: 'paused' },
];

const EMPTY_RULE: Omit<RuleLine, 'id'> = { system: '', parameter: '', operator: '>', value: '', action: 'Raise Exception', severity: 'medium' };

const SEVERITY_MAP: Record<string, string> = {
  high:   'badge--red',
  medium: 'badge--yellow',
  low:    'badge--blue',
};

function EditModal({ rule, onSave, onClose }: { rule: Rule; onSave: (r: Rule) => void; onClose: () => void }) {
  const [name,      setName]      = useState(rule.name);
  const [system,    setSystem]    = useState(rule.system);
  const [condition, setCondition] = useState(rule.condition);
  const [action,    setAction]    = useState(rule.action);
  const [severity,  setSeverity]  = useState(rule.severity);
  const [status,    setStatus]    = useState(rule.status);

  function handleSave() {
    if (!name.trim()) return;
    onSave({ ...rule, name: name.trim(), system, condition, action, severity, status });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__title">Edit Business Rule</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <div className="form-field">
            <label className="field-label">Rule Name *</label>
            <input className="field-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">System</label>
              <input className="field-input" value={system} onChange={e => setSystem(e.target.value)} placeholder="e.g. Empower" />
            </div>
            <div className="form-field">
              <label className="field-label">Action</label>
              <select className="field-select" value={action} onChange={e => setAction(e.target.value)}>
                <option>Raise Exception</option>
                <option>Notify Analyst</option>
                <option>Notify Admin</option>
                <option>Block Job</option>
                <option>Log Only</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">Condition</label>
            <input className="field-input" value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. rsd_value > 2.0%" />
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Severity</label>
              <select className="field-select" value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Status</label>
              <select className="field-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          {!name.trim() && <div className="form-hint">⚠ Rule name is required</div>}
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={!name.trim()}
            style={{ opacity: name.trim() ? 1 : 0.5 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfigBusinessRules() {
  const [rules,    setRules]    = useState<Rule[]>(RULES_DATA);
  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Rule | null>(null);

  const [formName,   setFormName]   = useState('');
  const [formScope,  setFormScope]  = useState('');
  const [formNotify, setFormNotify] = useState('Email + App');

  const [ruleLines, setRuleLines] = useState<RuleLine[]>([{ ...EMPTY_RULE, id: Date.now() }]);

  function addRuleLine() {
    setRuleLines(prev => [...prev, { ...EMPTY_RULE, id: Date.now() }]);
  }

  function updateRuleLine(id: number, field: keyof RuleLine, value: string) {
    setRuleLines(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function deleteRuleLine(id: number) {
    setRuleLines(prev => prev.filter(r => r.id !== id));
  }

  function handleSave() {
    if (!formName.trim()) return;
    const validLines = ruleLines.filter(r => r.system.trim() && r.parameter.trim() && r.value.trim());
    if (validLines.length === 0) return;

    const newRules: Rule[] = validLines.map((r, i) => ({
      id:        Date.now() + i,
      name:      validLines.length === 1 ? formName.trim() : `${formName.trim()} #${i + 1}`,
      system:    r.system,
      condition: `${r.parameter} ${r.operator} ${r.value}`,
      action:    r.action,
      severity:  r.severity,
      status:    'active',
    }));

    setRules(prev => [...prev, ...newRules]);
    setFormName(''); setFormScope(''); setFormNotify('Email + App');
    setRuleLines([{ ...EMPTY_RULE, id: Date.now() }]);
    setShowForm(false);
  }

  function handleEditSave(updated: Rule) {
    setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditItem(null);
  }

  function deleteRule(id: number) {
    setRules(prev => prev.filter(r => r.id !== id));
  }

  function toggleStatus(id: number) {
    setRules(prev =>
      prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r)
    );
  }

  const filtered = rules.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.system.toLowerCase().includes(search.toLowerCase())
  );

  const canSave = formName.trim() && ruleLines.some(r => r.system.trim() && r.parameter.trim() && r.value.trim());

  return (
    <div className="cbr-page">

      <div className="cbr-page__header">
        <div>
          <h1 className="cbr-page__title">Business Rules</h1>
          <p className="cbr-page__subtitle">Define threshold and exception trigger rules</p>
        </div>
        <div className="cbr-header-right">
          <div className="search-box">
            <span className="search-box__icon">&#128269;</span>
            <input
              className="search-box__input"
              placeholder="Search rules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(p => !p)}>
            {showForm ? '✕ Cancel' : '+ Create Rule'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="cbr-form-card">
          <div className="cbr-form-card__title">Rule Builder</div>

          <div className="form-row-3">
            <div className="form-field">
              <label className="field-label">Rule Set Name *</label>
              <input
                className="field-input"
                placeholder="e.g. CDS Threshold Rules"
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label">System Scope</label>
              <input
                className="field-input"
                placeholder="e.g. Empower, LIMS..."
                value={formScope}
                onChange={e => setFormScope(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Notification</label>
              <select className="field-select" value={formNotify} onChange={e => setFormNotify(e.target.value)}>
                <option>Email + App</option>
                <option>Email Only</option>
                <option>App Only</option>
                <option>None</option>
              </select>
            </div>
          </div>

          <div className="rule-builder">
            <div className="rule-builder__header">
              <span className="rule-builder__title">Rule Conditions</span>
              <button className="btn btn--secondary btn--sm" onClick={addRuleLine}>+ Add Rule</button>
            </div>

            {ruleLines.map((rule, index) => (
              <div key={rule.id} className="rule-row">
                <div className="rule-row__num">{index + 1}</div>
                <div className="rule-row__fields">
                  <div className="form-field">
                    <label className="field-label">System *</label>
                    <input className="field-input" placeholder="e.g. Empower" value={rule.system}
                      onChange={e => updateRuleLine(rule.id, 'system', e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Parameter *</label>
                    <input className="field-input" placeholder="e.g. rsd_value" value={rule.parameter}
                      onChange={e => updateRuleLine(rule.id, 'parameter', e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Operator</label>
                    <select className="field-select" value={rule.operator} onChange={e => updateRuleLine(rule.id, 'operator', e.target.value)}>
                      <option value=">">{'>'} (Greater than)</option>
                      <option value="<">{'<'} (Less than)</option>
                      <option value=">=">{'>='} (Greater or equal)</option>
                      <option value="<=">{'<='} (Less or equal)</option>
                      <option value="==">== (Equals)</option>
                      <option value="!=">!= (Not equal)</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="field-label">Value *</label>
                    <input className="field-input" placeholder="e.g. 2.0%" value={rule.value}
                      onChange={e => updateRuleLine(rule.id, 'value', e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Action</label>
                    <select className="field-select" value={rule.action} onChange={e => updateRuleLine(rule.id, 'action', e.target.value)}>
                      <option>Raise Exception</option>
                      <option>Notify Analyst</option>
                      <option>Notify Admin</option>
                      <option>Block Job</option>
                      <option>Log Only</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="field-label">Severity</label>
                    <select className="field-select" value={rule.severity} onChange={e => updateRuleLine(rule.id, 'severity', e.target.value)}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                {ruleLines.length > 1 && (
                  <button className="rule-row__del" onClick={() => deleteRuleLine(rule.id)} title="Remove rule">✕</button>
                )}
              </div>
            ))}
          </div>

          {!formName.trim() && <div className="form-hint">⚠ Rule set name is required</div>}
          {formName.trim() && !ruleLines.some(r => r.system.trim() && r.parameter.trim() && r.value.trim()) && (
            <div className="form-hint">⚠ At least one rule must have System, Parameter, and Value filled</div>
          )}

          <div className="form-actions">
            <button className="btn btn--primary" onClick={handleSave} disabled={!canSave} style={{ opacity: canSave ? 1 : 0.5 }}>
              Save Rules
            </button>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="cbr-section">
        <div className="cbr-section__header">
          <span className="cbr-section__title">Active Rules</span>
          <span className="badge badge--blue">{rules.length} rules</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📐</div>
            <div className="empty-state__text">No rules found</div>
            <div className="empty-state__sub">Try a different search or create a new rule</div>
          </div>
        ) : (
          <div className="cbr-list">
            {filtered.map(r => (
              <div key={r.id} className="cbr-item">
                <div className="cbr-item__left">
                  <div className="cbr-item__name">{r.name}</div>
                  <div className="cbr-item__condition">
                    <span className="cbr-item__system">{r.system}</span>
                    <span className="mono cbr-item__cond-text">{r.condition}</span>
                    <span className="cbr-item__arrow">→</span>
                    <span className="cbr-item__action">{r.action}</span>
                  </div>
                </div>
                <div className="cbr-item__right">
                  <span className={'badge ' + SEVERITY_MAP[r.severity]}>
                    {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                  </span>
                  <span className={'badge ' + (r.status === 'active' ? 'badge--green' : 'badge--grey')}>
                    {r.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                  <div className="row-actions">
                    <button
                      className={'btn btn--sm ' + (r.status === 'active' ? 'btn--secondary' : 'btn--accent')}
                      onClick={() => toggleStatus(r.id)}
                    >
                      {r.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button className="btn btn--secondary btn--sm" onClick={() => setEditItem(r)}>Edit</button>
                    <button className="btn btn--danger btn--sm"    onClick={() => deleteRule(r.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editItem && (
        <EditModal
          rule={editItem}
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}

    </div>
  );
}
