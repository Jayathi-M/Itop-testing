import React, { useState } from "react";
import "./NewRole.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Privilege {
  id: string;
  name: string;
  create: boolean;
  edit: boolean;
  view: boolean;
}

interface PrivilegeGroup {
  key: string;
  label: string;
  count: number;
  expanded: boolean;
  privileges: Privilege[];
}

interface NewRoleProps {
  onCancel: () => void;
  onSubmit: (data: { roleName: string }) => void;
}

// ─── Tab Data ─────────────────────────────────────────────────────────────────

const TABS = ["Platform", "File based systems", "CDS", "Lims"];

const INITIAL_GROUPS: Record<string, PrivilegeGroup[]> = {
  Platform: [
    {
      key: "platform",
      label: "Platform",
      count: 3,
      expanded: true,
      privileges: [
        { id: "platform_create", name: "Create Config", create: true,  edit: true,  view: false },
        { id: "platform_edit",   name: "Edit Config",   create: true,  edit: false, view: true  },
        { id: "platform_view",   name: "View Config",   create: true,  edit: true,  view: false },
      ],
    },
  ],
  "File based systems": [
    {
      key: "fbs",
      label: "File Based Systems",
      count: 2,
      expanded: true,
      privileges: [
        { id: "fbs_upload", name: "Upload Files",  create: true,  edit: false, view: true  },
        { id: "fbs_delete", name: "Delete Files",  create: false, edit: true,  view: false },
      ],
    },
  ],
  CDS: [
    {
      key: "cds",
      label: "CDS",
      count: 3,
      expanded: true,
      privileges: [
        { id: "cds_access",  name: "Access",            create: true,  edit: false, view: true  },
        { id: "cds_review",  name: "Review Exception",  create: true,  edit: false, view: true  },
        { id: "cds_approve", name: "Approve Exception", create: true,  edit: true,  view: false },
      ],
    },
  ],
  Lims: [
    {
      key: "lims",
      label: "Lims",
      count: 2,
      expanded: true,
      privileges: [
        { id: "lims_read",  name: "Read Records",   create: false, edit: false, view: true  },
        { id: "lims_write", name: "Write Records",  create: true,  edit: true,  view: false },
      ],
    },
  ],
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const Checkbox: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <label className="nr-checkbox">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="nr-checkbox-box">
      {checked && (
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  </label>
);

// ─── ChevronDown Icon ─────────────────────────────────────────────────────────

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`nr-chevron${open ? " nr-chevron-open" : ""}`}
    viewBox="0 0 16 16" fill="none"
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const NewRole: React.FC<NewRoleProps> = ({ onCancel, onSubmit }) => {
  const [roleName, setRoleName]   = useState("");
  const [activeTab, setActiveTab] = useState("Platform");
  const [groups, setGroups]       = useState<Record<string, PrivilegeGroup[]>>(
    JSON.parse(JSON.stringify(INITIAL_GROUPS))
  );

  const toggleExpand = (groupKey: string) => {
    setGroups(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(g =>
        g.key === groupKey ? { ...g, expanded: !g.expanded } : g
      ),
    }));
  };

  const togglePrivilege = (groupKey: string, privId: string, field: "create" | "edit" | "view") => {
    setGroups(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(g =>
        g.key !== groupKey ? g : {
          ...g,
          privileges: g.privileges.map(p =>
            p.id !== privId ? p : { ...p, [field]: !p[field] }
          ),
        }
      ),
    }));
  };

  const handleSubmit = () => {
    if (!roleName) {
      alert("Please select the role name");
      return;
    }
    onSubmit({ roleName });
  };

  const currentGroups = groups[activeTab] ?? [];

  return (
    <div className="nr-page">
      <div className="nr-card">

        {/* ── Header ── */}
        <div className="nr-header">
          <div>
            <h2 className="nr-title">Role Creation</h2>
            <p className="nr-subtitle">Create a new role with required details</p>
          </div>
          <button className="nr-close-btn" onClick={onCancel} title="Close">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Form fields ── */}
        <div className="nr-fields">
          <div className="nr-field">
            <label className="nr-label">Role <span className="nr-required">*</span></label>
            <div className="nr-select-wrap">
              <select
                className="nr-select"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
              >
                <option value="">Select a role</option>
                <option value="System Admin">System Admin</option>
                <option value="QA Reviewer">QA Reviewer</option>
                <option value="QA Approver">QA Approver</option>
                <option value="Lab Analyst">Lab Analyst</option>
                <option value="Auditor">Auditor</option>
                <option value="Compliance Officer">Compliance Officer</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="nr-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`nr-tab${activeTab === tab ? " nr-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Privileges table ── */}
        <div className="nr-table-wrap">
          <div className="nr-table-header">
            <span className="nr-col-name">Privilege name</span>
            <span className="nr-col-check">Create</span>
            <span className="nr-col-check">Edit</span>
            <span className="nr-col-check">View</span>
          </div>

          <div className="nr-table-body">
            {currentGroups.map(group => (
              <div key={group.key} className="nr-group">
                {/* Group row */}
                <div
                  className="nr-group-row"
                  onClick={() => toggleExpand(group.key)}
                >
                  <span className="nr-group-label">{group.label}</span>
                  <span className="nr-group-count">{group.count} Privileges</span>
                </div>

                {/* Privilege rows */}
                {group.expanded && group.privileges.map((priv, i) => (
                  <div
                    key={priv.id}
                    className={`nr-priv-row${i < group.privileges.length - 1 ? " nr-priv-row-border" : ""}`}
                  >
                    <div className="nr-priv-name-wrap">
                      <span className="nr-priv-name">{priv.name}</span>
                    </div>
                    <span className="nr-col-check">
                      <Checkbox checked={priv.create} onChange={() => togglePrivilege(group.key, priv.id, "create")} />
                    </span>
                    <span className="nr-col-check">
                      <Checkbox checked={priv.edit}   onChange={() => togglePrivilege(group.key, priv.id, "edit")}   />
                    </span>
                    <span className="nr-col-check">
                      <Checkbox checked={priv.view}   onChange={() => togglePrivilege(group.key, priv.id, "view")}   />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* ── Footer ── */}
        <div className="nr-footer">
          <button className="nr-cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="nr-submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  );
};

export default NewRole;