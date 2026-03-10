import { useState } from 'react';
import './WorkflowConfig.css';

/* ── Constants ── */
const ROLE_OPTIONS = [
  'Any Analyst',
  'Senior Scientist',
  'QA Manager',
  'Head of Lab',
  'Site Director',
];

const LEVEL_COLORS = [
  'linear-gradient(135deg,#06d6a0,#3b82f6)',
  'linear-gradient(135deg,#3b82f6,#8b5cf6)',
  'linear-gradient(135deg,#8b5cf6,#ef4444)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#06d6a0,#8b5cf6)',
];

const DEFAULT_STEPS = [
  { role: 'Analyst',  action: 'Acknowledge Exception', user: 'Any Analyst',      required: true },
  { role: 'Reviewer', action: 'Review & Verify',        user: 'Senior Scientist', required: true },
  { role: 'Approver', action: 'Final Approval',         user: 'QA Manager',       required: true },
];

const ROLE_MAP   = ['Analyst', 'Reviewer', 'Approver', 'Approver', 'Approver'];
const ACTION_MAP = [
  'Acknowledge Exception',
  'Review & Verify',
  'Final Approval',
  'Secondary Approval',
  'Executive Sign-off',
];

/* ── Toast ── */
function Toast({ message, type, visible }) {
  if (!visible) return null;
  return (
    <div className={`wf-toast wf-toast--${type || 'success'}`}>
      {message}
    </div>
  );
}

/* ── Approval Step Row ── */
function ApprovalStepRow({ step, index, onToggleRequired, onChangeUser, onDelete }) {
  const color = LEVEL_COLORS[index % LEVEL_COLORS.length];

  return (
    <div className="wf-step">
      <div className="wf-step__avatar" style={{ background: color }}>
        L{index + 1}
      </div>

      <div className="wf-step__meta">
        <div className="wf-step__meta-header">
          <div>
            <div className="wf-step__role">Level {index + 1} — {step.role}</div>
            <div className="wf-step__action">{step.action}</div>
          </div>
          <label className="wf-toggle" title="Required">
            <input
              type="checkbox"
              checked={step.required}
              onChange={e => onToggleRequired(index, e.target.checked)}
            />
            <span className="wf-toggle__slider" />
          </label>
        </div>

        <select
          className="wf-step__select"
          value={step.user}
          onChange={e => onChangeUser(index, e.target.value)}
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <button
        className="wf-step__del"
        onClick={() => onDelete(index)}
        title="Remove level"
      >
        ✕
      </button>
    </div>
  );
}

/* ── Setting Row ── */
function SettingRow({ label, type = 'toggle', checked, value, onChange }) {
  return (
    <div className="wf-setting-row">
      <span className="wf-setting-label">{label}</span>
      {type === 'toggle' ? (
        <label className="wf-toggle">
          <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
          <span className="wf-toggle__slider" />
        </label>
      ) : (
        <input
          className="wf-setting-input"
          type="number"
          value={value}
          min="1"
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main WorkflowConfig Component
══════════════════════════════════════════ */
export default function WorkflowConfig({ onDirty }) {
  const [steps, setSteps]   = useState(DEFAULT_STEPS.map(s => ({ ...s })));
  const [settings, setSettings] = useState({
    escalateHours:       24,
    emailOnFlag:         true,
    emailOnApproval:     true,
    allowRejection:      true,
    requireDigitalSig:   false,
    lockAfterPublish:    true,
    notifyOnSLABreach:   true,
    ccSupervisor:        false,
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  /* ── Toast helper ── */
  function showToast(message, type = 'success') {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  /* ── Mark dirty (notify parent) ── */
  function markDirty() {
    onDirty && onDirty();
  }

  /* ── Step mutations ── */
  function handleToggleRequired(i, val) {
    setSteps(prev => { const s = [...prev]; s[i] = { ...s[i], required: val }; return s; });
    markDirty();
  }

  function handleChangeUser(i, val) {
    setSteps(prev => { const s = [...prev]; s[i] = { ...s[i], user: val }; return s; });
    markDirty();
  }

  function handleDeleteStep(i) {
    if (steps.length <= 1) {
      showToast('⚠️ At least one workflow level is required.', 'warn');
      return;
    }
    setSteps(prev => prev.filter((_, idx) => idx !== i));
    markDirty();
  }

  function handleAddLevel() {
    const idx = steps.length;
    setSteps(prev => [
      ...prev,
      {
        role:     ROLE_MAP[Math.min(idx, ROLE_MAP.length - 1)],
        action:   ACTION_MAP[Math.min(idx, ACTION_MAP.length - 1)],
        user:     ROLE_OPTIONS[Math.min(idx, ROLE_OPTIONS.length - 1)],
        required: true,
      },
    ]);
    markDirty();
  }

  /* ── Settings mutation ── */
  function updateSetting(key, val) {
    setSettings(prev => ({ ...prev, [key]: val }));
    markDirty();
  }

  return (
    <div className="wf-root">
      {/* Info alert */}
      <div className="wf-alert wf-alert--info">
        <span className="wf-alert__icon">ℹ️</span>
        <span>Configure the approval workflow levels for exception acknowledgement and report publishing.</span>
      </div>

      <div className="wf-grid">

        {/* ── LEFT: Approval Workflow Levels ── */}
        <div className="wf-card">
          <div className="wf-card__title">Approval Workflow Levels</div>

          <div className="wf-steps">
            {steps.map((step, i) => (
              <ApprovalStepRow
                key={i}
                step={step}
                index={i}
                onToggleRequired={handleToggleRequired}
                onChangeUser={handleChangeUser}
                onDelete={handleDeleteStep}
              />
            ))}
          </div>

          <div className="wf-add-row">
            <button className="wf-btn wf-btn--primary wf-btn--sm" onClick={handleAddLevel}>
              + Add Level
            </button>
          </div>
        </div>

        {/* ── RIGHT: Workflow Settings ── */}
        <div className="wf-card">
          <div className="wf-card__title">Workflow Settings</div>

          <SettingRow
            label="Auto-escalate if no action in (hours)"
            type="number"
            value={settings.escalateHours}
            onChange={v => updateSetting('escalateHours', v)}
          />
          <SettingRow
            label="Email notification on exception flag"
            checked={settings.emailOnFlag}
            onChange={v => updateSetting('emailOnFlag', v)}
          />
          <SettingRow
            label="Email notification on approval"
            checked={settings.emailOnApproval}
            onChange={v => updateSetting('emailOnApproval', v)}
          />
          <SettingRow
            label="Allow rejection with comments"
            checked={settings.allowRejection}
            onChange={v => updateSetting('allowRejection', v)}
          />
          <SettingRow
            label="Require digital signature for approval"
            checked={settings.requireDigitalSig}
            onChange={v => updateSetting('requireDigitalSig', v)}
          />
          <SettingRow
            label="Lock record after publish"
            checked={settings.lockAfterPublish}
            onChange={v => updateSetting('lockAfterPublish', v)}
          />
          <SettingRow
            label="Notify on SLA breach"
            checked={settings.notifyOnSLABreach}
            onChange={v => updateSetting('notifyOnSLABreach', v)}
          />
          <SettingRow
            label="CC supervisor on every action"
            checked={settings.ccSupervisor}
            onChange={v => updateSetting('ccSupervisor', v)}
          />
        </div>

      </div>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
}