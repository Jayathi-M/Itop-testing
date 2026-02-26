import { useState } from 'react';
import './Templateconfig.css';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const REPORT_TEMPLATES_DATA = [
  { id: 1, name: 'Daily Exception Summary', scope: 'All CDS',       format: 'PDF',         modified: '2024-01-10' },
  { id: 2, name: 'Weekly Compliance',        scope: 'All',           format: 'PDF + XLS',   modified: '2024-01-05' },
  { id: 3, name: 'Batch Review',             scope: 'Manufacturing', format: 'PDF',         modified: '2024-01-08' },
];

const CHECKLIST_TEMPLATES_DATA = [
  { id: 1, name: 'CDS System Suitability',    scope: 'Empower / Chromeleon', checkpoints: 12, modified: '2024-01-09' },
  { id: 2, name: 'Blender IPC Checks',        scope: 'Manufacturing',        checkpoints: 8,  modified: '2024-01-07' },
  { id: 3, name: 'Instrument Calibration',    scope: 'All',                  checkpoints: 15, modified: '2024-01-06' },
];

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */
function EditModal({ item, type, onSave, onClose }) {
  const [name,         setName]         = useState(item.name);
  const [scope,        setScope]        = useState(item.scope);
  const [format,       setFormat]       = useState(item.format || 'PDF');
  const [checkpoints,  setCheckpoints]  = useState(item.checkpoints || 0);
  const [content,      setContent]      = useState(item.content || '');

  function handleSave() {
    if (!name.trim()) return;
    const updated = type === 'report'
      ? { ...item, name: name.trim(), scope, format,      modified: new Date().toISOString().slice(0,10) }
      : { ...item, name: name.trim(), scope, checkpoints: Number(checkpoints), modified: new Date().toISOString().slice(0,10) };
    onSave(updated);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <span className="modal__title">Edit {type === 'report' ? 'Report' : 'Checklist'} Template</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-field">
            <label className="field-label">Template Name *</label>
            <input className="field-input" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Scope</label>
              <select className="field-select" value={scope} onChange={e => setScope(e.target.value)}>
                <option>All</option>
                <option>All CDS</option>
                <option>Empower / Chromeleon</option>
                <option>Manufacturing</option>
                <option>Enterprise</option>
                <option>Non-CDS</option>
              </select>
            </div>

            {type === 'report' ? (
              <div className="form-field">
                <label className="field-label">Format</label>
                <select className="field-select" value={format} onChange={e => setFormat(e.target.value)}>
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>PDF + XLS</option>
                  <option>Word</option>
                </select>
              </div>
            ) : (
              <div className="form-field">
                <label className="field-label">Checkpoints</label>
                <input className="field-input" type="number" min="0" value={checkpoints} onChange={e => setCheckpoints(e.target.value)} />
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Template Content</label>
            <textarea
              className="field-textarea"
              rows={5}
              placeholder="Enter template structure or notes..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {!name.trim() && <div className="form-hint">⚠ Template name is required</div>}
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

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ConfigTemplates() {
  const [reportTemplates,    setReportTemplates]    = useState(REPORT_TEMPLATES_DATA);
  const [checklistTemplates, setChecklistTemplates] = useState(CHECKLIST_TEMPLATES_DATA);
  const [search,             setSearch]             = useState('');
  const [editItem,           setEditItem]           = useState(null);   // { item, type }
  const [showForm,           setShowForm]           = useState(false);
  const [newType,            setNewType]            = useState('report');
  const [formName,           setFormName]           = useState('');
  const [formScope,          setFormScope]          = useState('All');
  const [formFormat,         setFormFormat]         = useState('PDF');
  const [formCheckpoints,    setFormCheckpoints]    = useState(5);
  const [formContent,        setFormContent]        = useState('');

  /* ── Save edit ── */
  function handleEditSave(updated) {
    if (editItem.type === 'report') {
      setReportTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      setChecklistTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
    setEditItem(null);
  }

  /* ── Delete ── */
  function deleteTemplate(id, type) {
    if (type === 'report') setReportTemplates(prev => prev.filter(t => t.id !== id));
    else setChecklistTemplates(prev => prev.filter(t => t.id !== id));
  }

  /* ── Create new template ── */
  function handleCreate() {
    if (!formName.trim()) return;
    const today = new Date().toISOString().slice(0,10);
    if (newType === 'report') {
      setReportTemplates(prev => [...prev, {
        id: prev.length + 1, name: formName.trim(), scope: formScope,
        format: formFormat, modified: today,
      }]);
    } else {
      setChecklistTemplates(prev => [...prev, {
        id: prev.length + 1, name: formName.trim(), scope: formScope,
        checkpoints: Number(formCheckpoints), modified: today,
      }]);
    }
    setFormName(''); setFormScope('All'); setFormFormat('PDF');
    setFormCheckpoints(5); setFormContent('');
    setShowForm(false);
  }

  /* ── Filtered lists ── */
  const filteredReports    = reportTemplates.filter(t    => t.name.toLowerCase().includes(search.toLowerCase()));
  const filteredChecklists = checklistTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="ct-page">

      {/* ── Header with inline search ── */}
      <div className="ct-page__header">
        <div>
          <h1 className="ct-page__title">Template Configuration</h1>
          <p className="ct-page__subtitle">Report and checklist templates</p>
        </div>
        <div className="ct-header-right">
          <div className="search-box">
            <span className="search-box__icon">&#128269;</span>
            <input
              className="search-box__input"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(p => !p)}>
            {showForm ? '✕ Cancel' : '+ New Template'}
          </button>
        </div>
      </div>

      {/* ── New Template Form ── */}
      {showForm && (
        <div className="ct-form-card">
          <div className="ct-form-card__title">New Template</div>

          {/* Type selector */}
          <div className="type-selector">
            <div className={'type-btn ' + (newType === 'report'    ? 'type-btn--active' : '')} onClick={() => setNewType('report')}>📋 Report Template</div>
            <div className={'type-btn ' + (newType === 'checklist' ? 'type-btn--active' : '')} onClick={() => setNewType('checklist')}>✅ Checklist Template</div>
          </div>

          <div className="form-row-3">
            <div className="form-field">
              <label className="field-label">Template Name *</label>
              <input className="field-input" placeholder="Enter name..." value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Scope</label>
              <select className="field-select" value={formScope} onChange={e => setFormScope(e.target.value)}>
                <option>All</option>
                <option>All CDS</option>
                <option>Empower / Chromeleon</option>
                <option>Manufacturing</option>
                <option>Enterprise</option>
                <option>Non-CDS</option>
              </select>
            </div>
            {newType === 'report' ? (
              <div className="form-field">
                <label className="field-label">Format</label>
                <select className="field-select" value={formFormat} onChange={e => setFormFormat(e.target.value)}>
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>PDF + XLS</option>
                  <option>Word</option>
                </select>
              </div>
            ) : (
              <div className="form-field">
                <label className="field-label">Checkpoints</label>
                <input className="field-input" type="number" min="1" value={formCheckpoints} onChange={e => setFormCheckpoints(e.target.value)} />
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Template Content</label>
            <textarea className="field-textarea" rows={4} placeholder="Enter template structure..." value={formContent} onChange={e => setFormContent(e.target.value)} />
          </div>

          {!formName.trim() && <div className="form-hint">⚠ Template name is required</div>}

          <div className="form-actions">
            <button className="btn btn--primary" onClick={handleCreate} disabled={!formName.trim()} style={{ opacity: formName.trim() ? 1 : 0.5 }}>
              Save Template
            </button>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── 2-column layout: Report Templates | Checklist Templates ── */}
      <div className="ct-grid">

        {/* Report Templates */}
        <div className="ct-section">
          <div className="ct-section__header">
            <span className="ct-section__title">📋 Report Templates</span>
            <span className="badge badge--blue">{reportTemplates.length}</span>
          </div>
          {filteredReports.length === 0 ? (
            <div className="empty-state"><div className="empty-state__icon">📋</div><div className="empty-state__text">No report templates found</div></div>
          ) : (
            filteredReports.map(t => (
              <div key={t.id} className="ct-item">
                <div className="ct-item__info">
                  <div className="ct-item__name">{t.name}</div>
                  <div className="ct-item__sub">{t.scope} &nbsp;|&nbsp; {t.format}</div>
                  <div className="ct-item__date">Modified: {t.modified}</div>
                </div>
                <div className="row-actions">
                  <button className="btn btn--secondary btn--sm" onClick={() => setEditItem({ item: t, type: 'report' })}>Edit</button>
                  <button className="btn btn--danger btn--sm"    onClick={() => deleteTemplate(t.id, 'report')}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checklist Templates */}
        <div className="ct-section">
          <div className="ct-section__header">
            <span className="ct-section__title">✅ Checklist Templates</span>
            <span className="badge badge--blue">{checklistTemplates.length}</span>
          </div>
          {filteredChecklists.length === 0 ? (
            <div className="empty-state"><div className="empty-state__icon">✅</div><div className="empty-state__text">No checklist templates found</div></div>
          ) : (
            filteredChecklists.map(t => (
              <div key={t.id} className="ct-item">
                <div className="ct-item__info">
                  <div className="ct-item__name">{t.name}</div>
                  <div className="ct-item__sub">{t.scope} &nbsp;|&nbsp; {t.checkpoints} checkpoints</div>
                  <div className="ct-item__date">Modified: {t.modified}</div>
                </div>
                <div className="row-actions">
                  <button className="btn btn--secondary btn--sm" onClick={() => setEditItem({ item: t, type: 'checklist' })}>Edit</button>
                  <button className="btn btn--danger btn--sm"    onClick={() => deleteTemplate(t.id, 'checklist')}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <EditModal
          item={editItem.item}
          type={editItem.type}
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}

    </div>
  );
}