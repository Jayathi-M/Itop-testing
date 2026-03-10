import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ChecklistConfig.css";

const STAGE_OPTIONS  = ["Initial", "Pending", "Approved"];
const STATUS_OPTIONS = ["Active", "Inactive"];

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

const ChecklistConfig = ({ onStatsChange }) => {
  const [rows,            setRows]            = useState(INITIAL_ROWS);
  const [newRow,          setNewRow]          = useState(null);
  const [isFilterMode,    setIsFilterMode]    = useState(false);
  const [isEnabled,       setIsEnabled]       = useState(true);
  const [stageFilter,     setStageFilter]     = useState("All");
  const [search,          setSearch]          = useState("");
  const [showHistory,     setShowHistory]     = useState(false);
  const [showEditDialog,  setShowEditDialog]  = useState(false);
  const [historyFilter,   setHistoryFilter]   = useState("Signed");
  const [selectedRow,     setSelectedRow]     = useState(null);
  const [isDialogEditable,setIsDialogEditable]= useState(false);
  const [isDirty,         setIsDirty]         = useState(false);

  // Push stage stats to Empower header on every row change
  useEffect(() => {
    if (!onStatsChange) return;
    const initial  = rows.filter(r => r.stage === "Initial").length;
    const pending  = rows.filter(r => r.stage === "Pending").length;
    const approved = rows.filter(r => r.stage === "Approved").length;
    onStatsChange([
      { label: "Initial",  value: initial,  cls: ""                           },
      { label: "Pending",  value: pending,  cls: "empower-stat__val--warn"    },
      { label: "Approved", value: approved, cls: "empower-stat__val--success" },
    ]);
  }, [rows, onStatsChange]);

  /* ── Filtering logic ── */
  const statusFiltered = !isFilterMode
    ? rows
    : rows.filter(r => r.status === (isEnabled ? "Active" : "Inactive"));

  const stageFiltered = stageFilter === "All"
    ? statusFiltered
    : statusFiltered.filter(r => r.stage === stageFilter);

  const displayedRows = search.trim() === ""
    ? stageFiltered
    : stageFiltered.filter(r => {
        const q = search.toLowerCase();
        return (
          String(r.id).includes(q)            ||
          r.shortDis.toLowerCase().includes(q) ||
          r.fullDis.toLowerCase().includes(q)  ||
          r.type.toLowerCase().includes(q)     ||
          r.stage.toLowerCase().includes(q)    ||
          r.status.toLowerCase().includes(q)
        );
      });

  /* ── Handlers ── */
  const handleToggle = () => {
    if (!isFilterMode) { setIsFilterMode(true); setIsEnabled(true); }
    else               { setIsEnabled(prev => !prev); }
  };

  const addRow = () => {
    if (newRow) return;
    setNewRow({ shortDis:"", fullDis:"", type:"", stage:"Initial", status:"Active" });
  };

  const saveRow = () => {
    if (!newRow.shortDis || !newRow.fullDis || !newRow.type || !newRow.stage || !newRow.status) {
      alert("Please fill all fields"); return;
    }
    setRows(prev => [...prev, {
      id: prev.length + 1,
      ...newRow,
      history: [{ version:"v1.0", action:"New Entry Added", user:"Current User",
        date: new Date().toLocaleString(), reason:`${newRow.shortDis} created`, status:"Signed" }]
    }]);
    setNewRow(null);
  };

  const cancelRow = () => setNewRow(null);

  const handleDialogSave = () => {
    const newHistoryEntry = {
      version: `v${(selectedRow.history?.length || 0) + 1}.0`,
      action: "Updated", user: "Current User",
      date: new Date().toLocaleString(),
      reason: "Row details modified", status: "Signed"
    };
    const updatedRow = { ...selectedRow, history: [...(selectedRow.history || []), newHistoryEntry] };
    setRows(prev => prev.map(r => r.id === updatedRow.id ? updatedRow : r));
    setSelectedRow(updatedRow);
    setIsDialogEditable(false);
    setIsDirty(false);
    setShowEditDialog(false);
  };

  const openEdit = (row) => {
    setSelectedRow({ ...row });
    setIsDialogEditable(false);
    setIsDirty(false);
    setShowEditDialog(true);
  };

  const openHistory = (row) => {
    setSelectedRow(row);
    setHistoryFilter("Signed");
    setShowHistory(true);
  };

  const filteredHistory = selectedRow?.history?.filter(h => h.status === historyFilter) || [];

  const toggleLabel = !isFilterMode ? "All" : isEnabled ? "Active" : "Inactive";
  const toggleLabelCls = !isFilterMode ? "" : isEnabled ? "clc__toggle-label--on" : "clc__toggle-label--off";

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

            {/* Stage filter */}
            <select className="clc__select" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
              <option value="All">All Stages</option>
              {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Search bar */}
            <div className="clc__search-wrap">
              <i className="fa-solid fa-magnifying-glass clc__search-icon" />
              <input
                className="clc__search"
                placeholder="Search all columns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <i className="fa-solid fa-xmark clc__search-clear" onClick={() => setSearch("")} />
              )}
            </div>

            {/* Active/Inactive toggle */}
            {/* <div className="clc__toggle-wrap">
              <span className={`clc__toggle-label ${toggleLabelCls}`}>{toggleLabel}</span>
              <label className="clc__switch">
                <input type="checkbox" checked={isFilterMode ? isEnabled : false} onChange={handleToggle} />
                <span className="clc__slider" />
              </label>
            </div> */}

            <button className="clc__add-btn" onClick={addRow}>+ Add</button>
          </div>
        </div>

        {/* Sub-heading */}
        {/* <div className="clc__sub-heading">
          {!isFilterMode ? "All Checklists" : isEnabled ? "Active Checklists" : "Inactive Checklists"}
        </div> */}

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
              {displayedRows.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
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
                  <td className="clc__row-actions">
                    <i className="fa-solid fa-clock-rotate-left" title="History" onClick={() => openHistory(row)} />
                    <i className="fa-solid fa-pen" title="Edit" onClick={() => openEdit(row)} />
                  </td>
                </tr>
              ))}

              {/* ── New row with dropdowns ── */}
              {newRow && (
                <tr className="clc__new-row">
                  <td>{rows.length + 1}</td>
                  <td><input className="clc__inline-input" placeholder="Short Dis" onChange={e => setNewRow({...newRow, shortDis: e.target.value})} /></td>
                  <td><input className="clc__inline-input" placeholder="Full Dis"  onChange={e => setNewRow({...newRow, fullDis:  e.target.value})} /></td>
                  <td><input className="clc__inline-input" placeholder="Type"      onChange={e => setNewRow({...newRow, type:     e.target.value})} /></td>
                  <td>
                    <select className="clc__inline-select" value={newRow.stage} onChange={e => setNewRow({...newRow, stage: e.target.value})}>
                      {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="clc__inline-select" value={newRow.status} onChange={e => setNewRow({...newRow, status: e.target.value})}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="clc__row-actions">
                    <button className="clc__save-inline"   onClick={saveRow}>Save</button>
                    <button className="clc__cancel-inline" onClick={cancelRow}>Cancel</button>
                  </td>
                </tr>
              )}

              {displayedRows.length === 0 && !newRow && (
                <tr>
                  <td colSpan={7} className="clc__empty-row">No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════
          EDIT DIALOG (portal)
      ══════════════════════════════ */}
      {showEditDialog && selectedRow && createPortal(
        <div className="clc__overlay" onClick={() => setShowEditDialog(false)}>
          <div className="clc__dialog" onClick={e => e.stopPropagation()}>
            <div className="clc__dialog-header">
              <h3>Host Name</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowEditDialog(false)} />
            </div>

            {/* Connection */}
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

            {/* Project Mapping */}
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

            {/* System Info */}
            <div className="clc__section">
              <h4>System Info</h4>
              <div className="clc__field">
                <label>Location</label>
                <input value="Germany" disabled />
              </div>
              <div className="clc__field">
                <label>Login Date-Time</label>
                <input value="April 24, 2024 14:45" disabled />
              </div>
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
                  onClick={() => setHistoryFilter(f)}>
                  {f}
                </button>
              ))}
            </div>

            <div className="clc__history-list">
              {filteredHistory.length === 0 ? (
                <div className="clc__empty-row" style={{textAlign:"center", padding:"30px"}}>
                  No {historyFilter} records found.
                </div>
              ) : filteredHistory.map((h, i) => (
                <div key={i} className="clc__history-card">
                  <div className="clc__history-badge">{h.version}</div>
                  <div className="clc__history-content">
                    <div className="clc__history-title">{h.action}</div>
                    <div className="clc__history-meta">
                      <span>{h.user}</span>
                      <span>{h.date}</span>
                    </div>
                    <div className="clc__history-reason">{h.reason}</div>
                  </div>
                  <div className={`clc__history-status clc__history-status--${h.status.toLowerCase()}`}>
                    {h.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChecklistConfig;