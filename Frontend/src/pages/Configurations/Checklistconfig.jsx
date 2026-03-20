import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Checklistconfig.css";

const STAGE_OPTIONS  = ["Initial", "Pending", "Approved"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const PAGE_SIZES     = [5, 10, 20, 50];

const INITIAL_ROWS = [
  { id:1,  shortDis:"Item A1", fullDis:"Active full dis 1",   type:"GxP",     stage:"Initial",  status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-10 09:00", reason:"Initial entry", status:"Signed" }] },
  { id:2,  shortDis:"Item A2", fullDis:"Active full dis 2",   type:"Non-GxP", stage:"Pending",  status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-11 10:00", reason:"Initial entry", status:"Signed" }] },
  { id:3,  shortDis:"Item A3", fullDis:"Active full dis 3",   type:"GxP",     stage:"Approved", status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-12 11:00", reason:"Initial entry", status:"Signed" }] },
  { id:4,  shortDis:"Item A4", fullDis:"Active full dis 4",   type:"GxP",     stage:"Initial",  status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-13 12:00", reason:"Initial entry", status:"Signed" }] },
  { id:5,  shortDis:"Item A5", fullDis:"Active full dis 5",   type:"Non-GxP", stage:"Pending",  status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-14 13:00", reason:"Initial entry", status:"Signed" }] },
  { id:6,  shortDis:"Item A6", fullDis:"Active full dis 6",   type:"GxP",     stage:"Approved", status:"Active",   history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-15 14:00", reason:"Initial entry", status:"Signed" }] },
  { id:7,  shortDis:"Item I1", fullDis:"Inactive full dis 1", type:"GxP",     stage:"Initial",  status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-16 09:00", reason:"Initial entry", status:"Signed" }] },
  { id:8,  shortDis:"Item I2", fullDis:"Inactive full dis 2", type:"Non-GxP", stage:"Pending",  status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-17 10:00", reason:"Initial entry", status:"Signed" }] },
  { id:9,  shortDis:"Item I3", fullDis:"Inactive full dis 3", type:"GxP",     stage:"Approved", status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-18 11:00", reason:"Initial entry", status:"Signed" }] },
  { id:10, shortDis:"Item I4", fullDis:"Inactive full dis 4", type:"GxP",     stage:"Initial",  status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-19 12:00", reason:"Initial entry", status:"Signed" }] },
  { id:11, shortDis:"Item I5", fullDis:"Inactive full dis 5", type:"Non-GxP", stage:"Pending",  status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-20 13:00", reason:"Initial entry", status:"Signed" }] },
  { id:12, shortDis:"Item I6", fullDis:"Inactive full dis 6", type:"GxP",     stage:"Approved", status:"Inactive", history:[{ version:"v1.0", action:"Created", user:"Admin", date:"2026-01-21 14:00", reason:"Initial entry", status:"Signed" }] },
];

const EMPTY_FORM = { shortDis:"", fullDis:"", type:"", stage:"Initial", status:"Active" };

const ChecklistConfig = ({ onStatsChange }) => {
  const [rows,             setRows]            = useState(INITIAL_ROWS);
  const [showAddModal,     setShowAddModal]    = useState(false);
  const [addForm,          setAddForm]         = useState(EMPTY_FORM);
  const [addErrors,        setAddErrors]       = useState({});
  const [isFilterMode,     setIsFilterMode]    = useState(false);
  const [isEnabled,        setIsEnabled]       = useState(true);
  const [stageFilter,      setStageFilter]     = useState("All");
  const [search,           setSearch]          = useState("");
  const [page,             setPage]            = useState(1);
  const [pageSize,         setPageSize]        = useState(5);
  const [showHistory,      setShowHistory]     = useState(false);
  const [showEditDialog,   setShowEditDialog]  = useState(false);
  const [historyFilter,    setHistoryFilter]   = useState("Signed");
  const [selectedRow,      setSelectedRow]     = useState(null);
  const [isDialogEditable, setIsDialogEditable]= useState(false);
  const [isDirty,          setIsDirty]         = useState(false);

  /* Push stats up */
  useEffect(() => {
    if (!onStatsChange) return;
    onStatsChange([
      { label:"Initial",  value: rows.filter(r => r.stage === "Initial").length,  cls:"" },
      { label:"Pending",  value: rows.filter(r => r.stage === "Pending").length,  cls:"empower-stat__val--warn" },
      { label:"Approved", value: rows.filter(r => r.stage === "Approved").length, cls:"empower-stat__val--success" },
    ]);
  }, [rows, onStatsChange]);

  /* ── Filtering ── */
  const statusFiltered = !isFilterMode
    ? rows
    : rows.filter(r => r.status === (isEnabled ? "Active" : "Inactive"));

  const stageFiltered = stageFilter === "All"
    ? statusFiltered
    : statusFiltered.filter(r => r.stage === stageFilter);

  const filteredRows = search.trim() === ""
    ? stageFiltered
    : stageFiltered.filter(r => {
        const q = search.toLowerCase();
        return (
          r.shortDis.toLowerCase().includes(q) ||
          r.fullDis.toLowerCase().includes(q)  ||
          r.type.toLowerCase().includes(q)     ||
          r.stage.toLowerCase().includes(q)    ||
          r.status.toLowerCase().includes(q)
        );
      });

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const pagedRows  = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function goPage(p) { setPage(Math.max(1, Math.min(totalPages, p))); }

  function resetPage() { setPage(1); }

  function pagePills() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pills = new Set([1, 2, 3]);
    if (safePage > 4) pills.add('..a');
    for (let i = Math.max(4, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pills.add(i);
    if (safePage < totalPages - 3) pills.add('..b');
    pills.add(totalPages - 1);
    pills.add(totalPages);
    return [...pills];
  }

  /* ── Add modal ── */
  function openAddModal() { setAddForm(EMPTY_FORM); setAddErrors({}); setShowAddModal(true); }
  function closeAddModal() { setShowAddModal(false); setAddErrors({}); }
  function handleAddField(key, val) {
    setAddForm(prev => ({ ...prev, [key]: val }));
    setAddErrors(prev => ({ ...prev, [key]: '' }));
  }
  function handleAddSubmit() {
    const errs = {};
    if (!addForm.shortDis.trim()) errs.shortDis = "Required";
    if (!addForm.fullDis.trim())  errs.fullDis  = "Required";
    if (!addForm.type.trim())     errs.type     = "Required";
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setRows(prev => [{
      id: Date.now(),
      ...addForm,
      history: [{ version:"v1.0", action:"Created", user:"Current User",
        date: new Date().toLocaleString(), reason:`${addForm.shortDis} added`, status:"Signed" }],
    }, ...prev]);
    setPage(1);
    setShowAddModal(false);
  }

  /* ── Edit / history handlers ── */
  const handleDialogSave = () => {
    const entry = {
      version: `v${(selectedRow.history?.length || 0) + 1}.0`,
      action:"Updated", user:"Current User",
      date: new Date().toLocaleString(), reason:"Row details modified", status:"Signed",
    };
    const updated = { ...selectedRow, history: [...(selectedRow.history || []), entry] };
    setRows(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRow(updated);
    setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(false);
  };
  const openEdit = (row) => {
    setSelectedRow({ ...row }); setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(true);
  };
  const openHistory = (row) => {
    setSelectedRow(row); setHistoryFilter("Signed"); setShowHistory(true);
  };
  const filteredHistory = selectedRow?.history?.filter(h => h.status === historyFilter) || [];

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  return (
    <div className="clc">
      <div className="clc__card">

        {/* ── Card Header ── */}
        <div className="clc__card-header">
          <div>
            <h3 className="clc__card-title">Checklist - CDS</h3>
            <p className="clc__card-sub">Create and manage GxP checklists</p>
          </div>
          <div className="clc__actions">
            <select className="clc__select" value={stageFilter}
              onChange={e => { setStageFilter(e.target.value); resetPage(); }}>
              <option value="All">All Stages</option>
              {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="clc__search-wrap">
              <i className="fa-solid fa-magnifying-glass clc__search-icon" />
              <input className="clc__search" placeholder="Search all columns..."
                value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} />
              {search && <i className="fa-solid fa-xmark clc__search-clear"
                onClick={() => { setSearch(''); resetPage(); }} />}
            </div>
            <button className="clc__add-btn" onClick={openAddModal}>+ Add</button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="clc__table-wrap">
          <table className="clc__table">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Short Dis</th>
                <th>Full Dis</th>
                <th>Type</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, idx) => (
                <tr key={row.id} className={idx === 0 && page === 1 && rows[0]?.id === row.id ? "clc__row--new" : ""}>
                  <td>{(safePage - 1) * pageSize + idx + 1}</td>
                  <td>{row.shortDis}</td>
                  <td>{row.fullDis}</td>
                  <td>{row.type}</td>
                  <td>
                    <span className={`clc__stage-badge clc__stage-badge--${row.stage.toLowerCase()}`}>
                      {row.stage}
                    </span>
                  </td>
                  <td>
                    <span className={`clc__status ${row.status === "Active" ? "clc__status--active" : "clc__status--inactive"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="clc__row-actions">
                      <i className="fa-solid fa-clock-rotate-left" title="History" onClick={() => openHistory(row)} />
                      <i className="fa-solid fa-pen" title="Edit" onClick={() => openEdit(row)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="clc__empty-row">No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination bar ── */}
        <div className="clc__pagination">

          {/* Left: rows-per-page selector */}
          <div className="clc__pg-left">
            <select className="clc__page-size"
              value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); resetPage(); }}>
              {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>

          {/* Center: prev + pills + next */}
          <div className="clc__pg-center">
            <button className="clc__pg-nav" onClick={() => goPage(safePage - 1)} disabled={safePage === 1}>
              ← Previous
            </button>

            <div className="clc__pg-pills">
              {pagePills().map((p, i) =>
                typeof p === 'string'
                  ? <span key={p} className="clc__pg-dot">…</span>
                  : <button key={p}
                      className={`clc__pg-pill ${safePage === p ? 'clc__pg-pill--active' : ''}`}
                      onClick={() => goPage(p)}>{p}</button>
              )}
            </div>

            <button className="clc__pg-nav" onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}>
              Next →
            </button>
          </div>

          {/* Right: record count */}
          <div className="clc__pg-right">
            <span className="clc__pg-info">
              {filteredRows.length === 0
                ? '0 records'
                : `${(safePage-1)*pageSize+1}–${Math.min(safePage*pageSize, filteredRows.length)} of ${filteredRows.length}`}
            </span>
          </div>

        </div>

      </div>{/* end clc__card */}

      {/* ══════════════════════════════
          ADD MODAL
      ══════════════════════════════ */}
      {showAddModal && createPortal(
        <div className="clc__modal-backdrop" onClick={closeAddModal}>
          <div className="clc__modal" onClick={e => e.stopPropagation()}>
            <div className="clc__modal-header">
              <h3>Add New Checklist</h3>
              <i className="fa-solid fa-xmark" onClick={closeAddModal} />
            </div>
            <div className="clc__modal-body">
              <div className="clc__modal-field">
                <label>Short Description <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.shortDis ? "clc__modal-input--error" : ""}`}
                  placeholder="Enter short description" value={addForm.shortDis}
                  onChange={e => handleAddField("shortDis", e.target.value)} />
                {addErrors.shortDis && <span className="clc__field-error">{addErrors.shortDis}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Full Description <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.fullDis ? "clc__modal-input--error" : ""}`}
                  placeholder="Enter full description" value={addForm.fullDis}
                  onChange={e => handleAddField("fullDis", e.target.value)} />
                {addErrors.fullDis && <span className="clc__field-error">{addErrors.fullDis}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Type <span className="clc__required">*</span></label>
                <input className={`clc__modal-input ${addErrors.type ? "clc__modal-input--error" : ""}`}
                  placeholder="e.g. GxP, Non-GxP" value={addForm.type}
                  onChange={e => handleAddField("type", e.target.value)} />
                {addErrors.type && <span className="clc__field-error">{addErrors.type}</span>}
              </div>
              <div className="clc__modal-field">
                <label>Stage</label>
                <select className="clc__modal-select" value={addForm.stage}
                  onChange={e => handleAddField("stage", e.target.value)}>
                  {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="clc__modal-footer">
              <button className="clc__modal-btn clc__modal-btn--cancel" onClick={closeAddModal}>Cancel</button>
              <button className="clc__modal-btn clc__modal-btn--submit" onClick={handleAddSubmit}>Submit</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════════════════════════
          EDIT DIALOG
      ══════════════════════════════ */}
      {showEditDialog && selectedRow && createPortal(
        <div className="clc__overlay" onClick={() => setShowEditDialog(false)}>
          <div className="clc__dialog" onClick={e => e.stopPropagation()}>
            <div className="clc__dialog-header">
              <h3>Host Name</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowEditDialog(false)} />
            </div>
            <div className="clc__section">
              <div className="clc__section-header">
                <h4>Connection</h4>
                <div className="clc__section-actions">
                  <button className="clc__btn clc__btn--edit" onClick={() => { setIsDialogEditable(true); setIsDirty(false); }}>Edit</button>
                  <button className="clc__btn clc__btn--save" disabled={!isDirty || !isDialogEditable} onClick={handleDialogSave}>Save</button>
                </div>
              </div>
              <div className="clc__field">
                <label>Empower Data Source</label>
                <input value={selectedRow.shortDis} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, shortDis: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Empower User Name</label>
                <input value={selectedRow.fullDis} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, fullDis: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Empower Password</label>
                <input type="password" value={selectedRow.type} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, type: e.target.value}); setIsDirty(true); }} />
              </div>
            </div>
            <div className="clc__section">
              <h4>Project Mapping</h4>
              <div className="clc__field">
                <label>Project Name</label>
                <input value={selectedRow.stage} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, stage: e.target.value}); setIsDirty(true); }} />
              </div>
              <div className="clc__field">
                <label>Location</label>
                <input value={selectedRow.status} disabled={!isDialogEditable}
                  onChange={e => { setSelectedRow({...selectedRow, status: e.target.value}); setIsDirty(true); }} />
              </div>
            </div>
            <div className="clc__section">
              <h4>System Info</h4>
              <div className="clc__field"><label>Location</label><input value="Germany" disabled /></div>
              <div className="clc__field"><label>Login Date-Time</label><input value="April 24, 2024 14:45" disabled /></div>
            </div>
            <div className="clc__dialog-footer">
              <button className="clc__btn clc__btn--test">Test Connection</button>
              <button className="clc__btn clc__btn--edit" onClick={() => setShowEditDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════════════════════════
          HISTORY PANEL
      ══════════════════════════════ */}
      {showHistory && createPortal(
        <div className="clc__overlay" onClick={() => setShowHistory(false)}>
          <div className="clc__history" onClick={e => e.stopPropagation()}>
            <div className="clc__dialog-header">
              <h3>History</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowHistory(false)} />
            </div>
            <p className="clc__history-sub">Audit trail for: {selectedRow?.shortDis}</p>
            <div className="clc__filters">
              {["Signed","Rejected","Pending"].map(f => (
                <button key={f} className={`clc__filter-btn ${historyFilter === f ? "clc__filter-btn--active" : ""}`}
                  onClick={() => setHistoryFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="clc__history-list">
              {filteredHistory.length === 0
                ? <div className="clc__empty-row" style={{textAlign:"center",padding:"30px"}}>No {historyFilter} records found.</div>
                : filteredHistory.map((h, i) => (
                  <div key={i} className="clc__history-card">
                    <div className="clc__history-badge">{h.version}</div>
                    <div className="clc__history-content">
                      <div className="clc__history-title">{h.action}</div>
                      <div className="clc__history-meta"><span>{h.user}</span><span>{h.date}</span></div>
                      <div className="clc__history-reason">{h.reason}</div>
                    </div>
                    <div className={`clc__history-status clc__history-status--${h.status.toLowerCase()}`}>{h.status}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ChecklistConfig;