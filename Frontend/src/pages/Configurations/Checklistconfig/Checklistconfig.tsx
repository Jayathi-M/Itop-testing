import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Checklistconfig.css";

interface HistoryEntry {
  version: string;
  action: string;
  user: string;
  date: string;
  reason: string;
  status: string;
}

interface ChecklistRow {
  id: number;
  shortDis: string;
  fullDis: string;
  type: string;
  stage: string;
  status: string;
  system: string;
  module: string;
  digital: string;
  isFromAuditTrail: string;
  generationType: string;
  history: HistoryEntry[];
}

interface AddForm {
  shortDis: string;
  fullDis: string;
  type: string;
  stage: string;
  status: string;
}

interface AddErrors {
  shortDis?: string;
  fullDis?: string;
  type?: string;
}

interface StatItem {
  label: string;
  value: number;
  cls: string;
}

const STAGE_OPTIONS  = ["Initial", "Pending", "Approved"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const PAGE_SIZES     = [5, 10, 20, 50];

const INITIAL_ROWS: ChecklistRow[] = [
  { id:1, shortDis:"Are the privileges group created and privileges...", fullDis:"Are the privileges group created and privileges assigned to groups as per the SOP?  (With the help of software Administrator)", type:"CHR_SAT", stage:"High", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:2, shortDis:"Are the user management security settings set a...", fullDis:"Are the user management security settings set as per SOP?   (With the help of software Administrator)", type:"CHR_SAT", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:3, shortDis:"Are the User ID's (Including Hardware engineer)...", fullDis:"Are the User ID's (Including Hardware engineer) and Guest user created as per the procedure (With the help of software Administrator) and locked after completion of the activity.", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:4, shortDis:"Are the following user ID's disabled: Left the ...", fullDis:"Are the following user ID's disabled: Left the organization, Guest User", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:5, shortDis:"Review of following events in audit trail of Da...", fullDis:"Review of following events in audit trail of Datavault manager, apart from database mentioned in 1035-D-0007: Datavault Mounted, Datavault Dismounted, Datavault Created, Change in Organization unit", type:"CHR_SAT_DIG", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:6, shortDis:"Review of Domain Resource audit trail The works...", fullDis:"Review of Domain Resource audit trail The workstations which are discontinued, to be removed from the admin console", type:"CHR_SAT_DIG", stage:"Low", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:7, shortDis:"Are the privileges group created and privileges...", fullDis:"Are the privileges group created and privileges assigned to groups as per the SOP?  (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:8, shortDis:"Are the user management Global security setting...", fullDis:"Are the user management Global security settings set as per SOP?  (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:9, shortDis:"Are the User ID's (Including service engineer) ...", fullDis:"Are the User ID's (Including service engineer) and Guest user created/deactivated/retired as per defined procedure and Training Pre-requisites is available. (As applicable)   (With the help of Global software Administrator)", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:10, shortDis:"Review of Global audit trail, Site datavault in...", fullDis:"Review of Global audit trail, Site datavault in the Global, Site workstation configured in Global, Other activities getting captured in Global audit trail related to site specific", type:"CHR_SAT_DIG", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:11, shortDis:"Others If Any", fullDis:"Others If Any", type:"CHR_SAT", stage:"Low", status:"Active", system:"CDS", module:"Chromeleon", digital:"-", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:12, shortDis:"Check audit trail for sequence interruptions, a...", fullDis:"Check audit trail for sequence interruptions, abort sequence etc. is handled as per SOP 1035-L-0147?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:13, shortDis:"Are the prohibited parameters like Inhibit Inte...", fullDis:"Are the prohibited parameters like Inhibit Integration, Peak Group start, Peak group end and Lock Baseline point is used in the processing method as per SOP 1035-L-0142?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:14, shortDis:"Check, in case of updation of the processing me...", fullDis:"Check, in case of updation of the processing method processing method is renamed with suffix \"@\" after approval.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:15, shortDis:"Check any deletion details captured in audit tr...", fullDis:"Check any deletion details captured in audit trail, after completion of sequence", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:16, shortDis:"Check appropriate Comments under the Reviewer...", fullDis:"Check appropriate Comments under the Reviewer Remark column is added by reviewer wherever interruption of injection or abort information is getting captured in the audit trail", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:17, shortDis:"Is the Sample Weight, Standard Weight, sample o...", fullDis:"Is the Sample Weight, Standard Weight, sample or standard dilution factor, Batch number, AR Number, Average weight, Purity, Multiplication factor, Label Claim, Conversion factor and other calculations variables are changed after completion of sequence/respective injections by the user?", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:18, shortDis:"Replicate Standards added in the Calibration ta...", fullDis:"Replicate Standards added in the Calibration tab page in the processing method is of the same sequence.", type:"CHR_DIG", stage:"-", status:"Inactive", system:"CDS", module:"Chromeleon", digital:"True", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:19, shortDis:"Run a query to check the same Sample ID number ...", fullDis:"Run a query to check the same Sample ID number injected earlier for same test.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:20, shortDis:"All Master Data modification ex. Report templat...", fullDis:"All Master Data modification ex. Report template, processing method, Instrument method etc. should be captured.", type:"CHR_SATR", stage:"-", status:"Active", system:"CDS", module:"Chromeleon", digital:"False", isFromAuditTrail:"-", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:27, shortDis:"Pending for Sign-Off Level-", fullDis:"Pending for Sign-Off Level-", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:28, shortDis:"Unprocessed Channels", fullDis:"Unprocessed Channels", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:29, shortDis:"Sample Set Finished Date incomplete", fullDis:"Sample Set Finished Date incomplete", type:"SATR", stage:"High", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:30, shortDis:"There are no Major breaks in the acquisition ti...", fullDis:"There are no Major breaks in the acquisition times", type:"SATR", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:31, shortDis:"All the samples and standards are processed wit...", fullDis:"All the samples and standards are processed with the same processing method", type:"SATR", stage:"Low", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
  { id:125, shortDis:"No of injections and results", fullDis:"No of injections and results", type:"SATR", stage:"medium", status:"Active", system:"undefined", module:"Empower", digital:"False", isFromAuditTrail:"False", generationType:"-", history:[{"version": "v1.0", "action": "Created", "user": "Admin", "date": "2026-01-10 09:00", "reason": "Initial entry", "status": "Signed"}] },
];

const EMPTY_FORM: AddForm = { shortDis:"", fullDis:"", type:"", stage:"Initial", status:"Active" };

const ChecklistConfig = ({ onStatsChange }: { onStatsChange?: (stats: StatItem[]) => void }) => {
  const [rows,             setRows]            = useState<ChecklistRow[]>(INITIAL_ROWS);
  const [showAddModal,     setShowAddModal]    = useState(false);
  const [addForm,          setAddForm]         = useState<AddForm>(EMPTY_FORM);
  const [addErrors,        setAddErrors]       = useState<AddErrors>({});
  const [isFilterMode,     setIsFilterMode]    = useState(false);
  const [isEnabled,        setIsEnabled]       = useState(true);
  const [severityFilter,   setSeverityFilter]  = useState("All");
  const [search,           setSearch]          = useState("");
  const [page,             setPage]            = useState(1);
  const [pageSize,         setPageSize]        = useState(5);
  const [showHistory,      setShowHistory]     = useState(false);
  const [showEditDialog,   setShowEditDialog]  = useState(false);
  const [historyFilter,    setHistoryFilter]   = useState("Signed");
  const [selectedRow,      setSelectedRow]     = useState<ChecklistRow | null>(null);
  const [isDialogEditable, setIsDialogEditable]= useState(false);
  const [isDirty,          setIsDirty]         = useState(false);

  useEffect(() => {
    if (!onStatsChange) return;
    onStatsChange([
      { label:"High",     value: rows.filter(r => (r.stage||"").toLowerCase() === "high").length,   cls:"empower-stat__val--danger"  },
      { label:"Medium",   value: rows.filter(r => (r.stage||"").toLowerCase() === "medium").length, cls:"empower-stat__val--warn"    },
      { label:"Low",      value: rows.filter(r => (r.stage||"").toLowerCase() === "low").length,    cls:"empower-stat__val--info"    },
      { label:"CDS",      value: rows.filter(r => (r.system||"").toUpperCase() === "CDS").length,   cls:""                           },
      { label:"Non-CDS",  value: rows.filter(r => (r.system||"").toUpperCase() !== "CDS").length,   cls:""                           },
      { label:"Active",   value: rows.filter(r => r.status === "Active").length,                    cls:"empower-stat__val--success" },
      { label:"Inactive", value: rows.filter(r => r.status === "Inactive").length,                  cls:"empower-stat__val--muted"   },
    ]);
  }, [rows, onStatsChange]);

  const statusFiltered = !isFilterMode
    ? rows
    : rows.filter(r => r.status === (isEnabled ? "Active" : "Inactive"));

  const severityFiltered = severityFilter === "All"
    ? statusFiltered
    : statusFiltered.filter(r => (r.stage || "").toLowerCase() === severityFilter.toLowerCase());

  const filteredRows = search.trim() === ""
    ? severityFiltered
    : severityFiltered.filter(r => {
        const q = search.toLowerCase();
        return (
          String(r.id).includes(q)                                ||
          (r.shortDis         || "").toLowerCase().includes(q)    ||
          (r.fullDis          || "").toLowerCase().includes(q)    ||
          (r.type             || "").toLowerCase().includes(q)    ||
          (r.stage            || "").toLowerCase().includes(q)    ||
          (r.status           || "").toLowerCase().includes(q)    ||
          (r.system           || "").toLowerCase().includes(q)    ||
          (r.module           || "").toLowerCase().includes(q)    ||
          (r.digital          || "").toLowerCase().includes(q)    ||
          (r.isFromAuditTrail || "").toLowerCase().includes(q)    ||
          (r.generationType   || "").toLowerCase().includes(q)
        );
      });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const pagedRows  = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function goPage(p: number) { setPage(Math.max(1, Math.min(totalPages, p))); }
  function resetPage() { setPage(1); }

  function pagePills(): (number | string)[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pills = new Set<number | string>([1, 2, 3]);
    if (safePage > 4) pills.add('..a');
    for (let i = Math.max(4, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pills.add(i);
    if (safePage < totalPages - 3) pills.add('..b');
    pills.add(totalPages - 1);
    pills.add(totalPages);
    return [...pills];
  }

  function openAddModal() { setAddForm(EMPTY_FORM); setAddErrors({}); setShowAddModal(true); }
  function closeAddModal() { setShowAddModal(false); setAddErrors({}); }
  function handleAddField(key: keyof AddForm, val: string) {
    setAddForm(prev => ({ ...prev, [key]: val }));
    setAddErrors(prev => ({ ...prev, [key]: '' }));
  }
  function handleAddSubmit() {
    const errs: AddErrors = {};
    if (!addForm.shortDis.trim()) errs.shortDis = "Required";
    if (!addForm.fullDis.trim())  errs.fullDis  = "Required";
    if (!addForm.type.trim())     errs.type     = "Required";
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setRows(prev => [{
      id: Date.now(), ...addForm,
      system: '', module: '', digital: '-', isFromAuditTrail: '-', generationType: '-',
      history: [{ version:"v1.0", action:"Created", user:"Current User",
        date: new Date().toLocaleString(), reason:`${addForm.shortDis} added`, status:"Signed" }],
    }, ...prev]);
    setPage(1);
    setShowAddModal(false);
  }

  const handleDialogSave = () => {
    if (!selectedRow) return;
    const entry: HistoryEntry = {
      version: `v${(selectedRow.history?.length || 0) + 1}.0`,
      action:"Updated", user:"Current User",
      date: new Date().toLocaleString(), reason:"Row details modified", status:"Signed",
    };
    const updated = { ...selectedRow, history: [...(selectedRow.history || []), entry] };
    setRows(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRow(updated);
    setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(false);
  };
  const openEdit = (row: ChecklistRow) => {
    setSelectedRow({ ...row }); setIsDialogEditable(false); setIsDirty(false); setShowEditDialog(true);
  };
  const openHistory = (row: ChecklistRow) => {
    setSelectedRow(row); setHistoryFilter("Signed"); setShowHistory(true);
  };
  const filteredHistory = selectedRow?.history?.filter(h => h.status === historyFilter) || [];

  return (
    <div className="clc">
      <div className="clc__scroll-wrap">
      <div className="clc__card">

        <div className="clc__card-header">
          <div>
            <h3 className="clc__card-title">Checklist - CDS</h3>
            <p className="clc__card-sub">Create and manage GxP checklists</p>
          </div>
          <div className="clc__actions">
            <select className="clc__select" value={severityFilter}
              onChange={e => { setSeverityFilter(e.target.value); resetPage(); }}>
              <option value="All">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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

        <div className="clc__table-wrap">
          <table className="clc__table">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Check point Name</th>
                <th>Status</th>
                <th>System</th>
                <th>Module</th>
                <th>Type</th>
                <th>Digital</th>
                <th>IS From Audit Trail</th>
                <th>Generation_Type</th>
                <th>Sevearity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, idx) => (
                <tr key={row.id} className={idx === 0 && page === 1 && rows[0]?.id === row.id ? "clc__row--new" : ""}>
                  <td>{(safePage - 1) * pageSize + idx + 1}</td>
                  <td>{row.shortDis}</td>
                  <td>
                    <span className={`clc__status ${row.status === "Active" ? "clc__status--active" : "clc__status--inactive"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.system}</td>
                  <td>{row.module}</td>
                  <td>{row.type}</td>
                  <td>{row.digital}</td>
                  <td>{row.isFromAuditTrail}</td>
                  <td>{row.generationType || "-"}</td>
                  <td>
                    <span className={`clc__stage-badge clc__stage-badge--${(row.stage||"-").toLowerCase()}`}>
                      {row.stage}
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
                  <td colSpan={11} className="clc__empty-row">No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clc__pagination">
          <div className="clc__pg-left">
            <select className="clc__page-size" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); resetPage(); }}>
              {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
          <div className="clc__pg-center">
            <button className="clc__pg-nav" onClick={() => goPage(safePage - 1)} disabled={safePage === 1}>← Previous</button>
            <div className="clc__pg-pills">
              {pagePills().map((p) =>
                typeof p === 'string'
                  ? <span key={p} className="clc__pg-dot">…</span>
                  : <button key={p} className={`clc__pg-pill ${safePage === p ? 'clc__pg-pill--active' : ''}`} onClick={() => goPage(p as number)}>{p}</button>
              )}
            </div>
            <button className="clc__pg-nav" onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}>Next →</button>
          </div>
          <div className="clc__pg-right">
            <span className="clc__pg-info">
              {filteredRows.length === 0
                ? '0 records'
                : `${(safePage-1)*pageSize+1}–${Math.min(safePage*pageSize, filteredRows.length)} of ${filteredRows.length}`}
            </span>
          </div>
        </div>

      </div>
      </div>

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
                <select className="clc__modal-select" value={addForm.stage} onChange={e => handleAddField("stage", e.target.value)}>
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
