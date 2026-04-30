import React, { useState } from "react";
import "./Role.css";
import NewRole from "./NewRole/NewRole";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
interface RoleRow {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Pending approval";
  modifiedBy: string;
  modifiedOn: string;
  version: string;
}
 
// ─── Initial Data ─────────────────────────────────────────────────────────────
 
const initialRoles: RoleRow[] = [
  { id: 1, name: "System Admin",       description: "Full platform access with config rights", status: "Active",           modifiedBy: "Mohan",     modifiedOn: "Apr 17, 10:20 AM", version: "2.4" },
  { id: 2, name: "QA Reviewer",        description: "Reviews exceptions and sample sets",      status: "Active",           modifiedBy: "Akhil",     modifiedOn: "Apr 17, 10:20 AM", version: "2.8" },
  { id: 3, name: "QA Approver",        description: "Full platform access with config rights", status: "Active",           modifiedBy: "Pavan",     modifiedOn: "Apr 17, 10:20 AM", version: "4.0" },
  { id: 4, name: "Lab Analyst",        description: "Full platform access with config rights", status: "Pending approval", modifiedBy: "Kushal",    modifiedOn: "Apr 17, 10:20 AM", version: "7.0" },
  { id: 5, name: "Auditor",            description: "Full platform access with config rights", status: "Active",           modifiedBy: "Venkatesh", modifiedOn: "Apr 17, 10:20 AM", version: "7.6" },
  { id: 6, name: "Compliance Officer", description: "Full platform access with config rights", status: "Inactive",         modifiedBy: "Abhi",      modifiedOn: "Apr 17, 10:20 AM", version: "5.0" },
  { id: 7, name: "System Admin",       description: "Full platform access with config rights", status: "Active",           modifiedBy: "Mohan",     modifiedOn: "Apr 17, 10:20 AM", version: "2.3" },
];
 
const TOTAL_PAGES = 10;
 
// ─── Status Badge ─────────────────────────────────────────────────────────────
 
const StatusBadge: React.FC<{ status: RoleRow["status"] }> = ({ status }) => {
  const cls =
    status === "Active"           ? "role-badge role-badge-active"   :
    status === "Pending approval" ? "role-badge role-badge-pending"  :
                                    "role-badge role-badge-inactive";
  return <span className={cls}>{status}</span>;
};
 
// ─── Icons ────────────────────────────────────────────────────────────────────
 
const PencilIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.846 2.404a1.937 1.937 0 012.738 2.738l-.91.91-2.738-2.738.91-.91zM12.748 4.5L3.5 13.748V16.5h2.752l9.248-9.248L12.748 4.5z" fill="currentColor"/>
  </svg>
);
 
const DotsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4.5"  r="1.5" />
    <circle cx="10" cy="10"   r="1.5" />
    <circle cx="10" cy="15.5" r="1.5" />
  </svg>
);
 
// ─── Success Popup ────────────────────────────────────────────────────────────
 
const SuccessPopup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: "#dcfce7",
      border: "1px solid #86efac",
      padding: "14px 24px",
      color: "#16a34a",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#16a34a",
          fontSize: "18px",
          lineHeight: 1,
          marginLeft: "12px",
        }}
      >
        ×
      </button>
    </div>
  </div>
);
 
// ─── Pagination ───────────────────────────────────────────────────────────────
 
const Pagination: React.FC<{ current: number; total: number; onChange: (p: number) => void }> = ({ current, total, onChange }) => {
  const pages: (number | "...")[] = [1, 2, 3, "...", 8, 9, 10];
  return (
    <div className="role-pagination">
      <button className="role-prev-btn" onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Previous
      </button>
      <div className="role-pagination-pages">
        {pages.map((p, i) =>
          p === "..." ? (
            <button key={`dots-${i}`} className="role-page-btn dots" tabIndex={-1}>...</button>
          ) : (
            <button key={p} className={`role-page-btn${current === p ? " active" : ""}`} onClick={() => onChange(p as number)}>
              {p}
            </button>
          )
        )}
      </div>
      <button className="role-next-btn" onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}>
        Next
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};
 
// ─── Main Component ───────────────────────────────────────────────────────────
 
const Role: React.FC = () => {
  const [roles, setRoles]             = useState<RoleRow[]>(initialRoles);
  const [showForm, setShowForm]       = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg]   = useState("");
  const [search, setSearch]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const handleSubmit = (data: { roleName: string }) => {
    const now = new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
    const newRole: RoleRow = {
      id:          roles.length + 1,
      name:        data.roleName,
      description: "Full platform access with config rights",
      status:      "Active",
      modifiedBy:  "You",
      modifiedOn:  now,
      version:     "1.0",
    };
    setRoles(prev => [...prev, newRole]);
    setShowForm(false);
    setSuccessMsg(`"${data.roleName}" role has been added.`);
    setShowSuccess(true);
  };
 
  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
 
  // ── Show NewRole as a full page ──
  if (showForm) {
    return (
      <NewRole
        onCancel={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />
    );
  }
 
  return (
    <div className="role-page">
 
      <div className="role-table-wrap">
 
        {/* ── Toolbar ── */}
        <div className="role-toolbar">
          <div className="role-search-wrap">
            <svg className="role-search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#b0b7c3" strokeWidth="1.6" />
              <path d="M15 15l-3-3" stroke="#b0b7c3" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              className="role-search"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="role-new-btn" onClick={() => setShowForm(true)}>
            + New Role
          </button>
        </div>
 
        {/* ── Table ── */}
        <table className="role-table">
          <thead>
            <tr>
              <th>S NO</th>
              <th>Role</th>
              <th>Status</th>
              <th>Modified by</th>
              <th>Modified on</th>
              <th>Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((role, idx) => (
              <tr key={role.id}>
                <td>{idx + 1}</td>
                <td>
                  <div className="role-name">{role.name}</div>
                  <div className="role-desc">{role.description}</div>
                </td>
                <td><StatusBadge status={role.status} /></td>
                <td>{role.modifiedBy}</td>
                <td>{role.modifiedOn}</td>
                <td>{role.version}</td>
                <td>
                  <div className="role-actions">
                    <button className="role-action-btn" title="Edit"><PencilIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
        {/* ── Pagination ── */}
        <Pagination current={currentPage} total={TOTAL_PAGES} onChange={setCurrentPage} />
 
      </div>
 
      {/* ── Success Popup ── */}
      {showSuccess && (
        <SuccessPopup message={successMsg} onClose={() => setShowSuccess(false)} />
      )}
 
    </div>
  );
};
 
export default Role;
 