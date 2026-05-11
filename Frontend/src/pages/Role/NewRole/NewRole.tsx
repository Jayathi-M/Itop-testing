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
  submitError?: string | null;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  "Platform",
  "File based systems",
  "CDS",
  "Lims",
];

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_GROUPS: Record<
  string,
  PrivilegeGroup[]
> = {
  Platform: [
    {
      key: "platform",
      label: "Platform",
      count: 3,
      expanded: true,

      privileges: [
        {
          id: "platform_create",
          name: "Create Config",
          create: true,
          edit: true,
          view: false,
        },

        {
          id: "platform_edit",
          name: "Edit Config",
          create: true,
          edit: false,
          view: true,
        },

        {
          id: "platform_view",
          name: "View Config",
          create: true,
          edit: true,
          view: false,
        },
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
        {
          id: "fbs_upload",
          name: "Upload Files",
          create: true,
          edit: false,
          view: true,
        },

        {
          id: "fbs_delete",
          name: "Delete Files",
          create: false,
          edit: true,
          view: false,
        },
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
        {
          id: "cds_access",
          name: "Access",
          create: true,
          edit: false,
          view: true,
        },

        {
          id: "cds_review",
          name: "Review Exception",
          create: true,
          edit: false,
          view: true,
        },

        {
          id: "cds_approve",
          name: "Approve Exception",
          create: true,
          edit: true,
          view: false,
        },
      ],
    },
  ],

  LIMS: [
    {
      key: "lims",
      label: "Lims",
      count: 2,
      expanded: true,

      privileges: [
        {
          id: "lims_read",
          name: "Read Records",
          create: false,
          edit: false,
          view: true,
        },

        {
          id: "lims_write",
          name: "Write Records",
          create: true,
          edit: true,
          view: false,
        },
      ],
    },
  ],
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const Checkbox: React.FC<{
  checked: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => (
  <label className="nr-checkbox">

    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />

    <span className="nr-checkbox-box">
      {checked && (
        <svg viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  </label>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const NewRole: React.FC<NewRoleProps> = ({
  onCancel,
  onSubmit,
  submitError,
}) => {

  // ─── States ─────────────────────────────────

  const [roleNameText, setRoleNameText] = useState("");
  const [module, setModule] = useState("Platform");
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("Platform");

  const [groups, setGroups] =
    useState<Record<string, PrivilegeGroup[]>>(
      JSON.parse(JSON.stringify(INITIAL_GROUPS))
    );

  // ─── Toggle Expand ──────────────────────────

  const toggleExpand = (groupKey: string) => {
    setGroups((prev) => ({
      ...prev,

      [activeTab]: prev[activeTab].map((g) =>
        g.key === groupKey
          ? {
              ...g,
              expanded: !g.expanded,
            }
          : g
      ),
    }));
  };

  // ─── Toggle Checkbox ────────────────────────

  const togglePrivilege = (
    groupKey: string,
    privId: string,
    field: "create" | "edit" | "view"
  ) => {

    setGroups((prev) => ({
      ...prev,

      [activeTab]: prev[activeTab].map((g) =>
        g.key !== groupKey
          ? g
          : {
              ...g,

              privileges: g.privileges.map((p) =>
                p.id !== privId
                  ? p
                  : {
                      ...p,
                      [field]: !p[field],
                    }
              ),
            }
      ),
    }));
  };

  // ─── Submit ─────────────────────────────────

  const handleSubmit = () => {
    if (!roleNameText.trim()) {
      setValidationMsg("Please enter a role name");
      return;
    }
    if (!module) {
      setValidationMsg("Please select a module");
      return;
    }
    setValidationMsg(null);
    onSubmit({ roleName: roleNameText });
  };

  // ─── Current Groups ─────────────────────────

  const currentGroups =
    groups[activeTab] ?? [];

  // ─── JSX ────────────────────────────────────

  return (
    <div className="nr-page">

      <div className="nr-card">

        {/* HEADER */}

        <div className="nr-header">

          <div>
            <h2 className="nr-title">
              Role Creation
            </h2>

            <p className="nr-subtitle">
              Create a new role with required
              details
            </p>
          </div>

          <button
            className="nr-close-btn"
            onClick={onCancel}
          >
            ✕
          </button>

        </div>

        {/* FORM FIELDS */}

        <div className="nr-fields">

          {/* ROLE NAME */}

          <div className="nr-field">

            <label className="nr-label">
              Role Name
              <span className="nr-required">
                *
              </span>
            </label>

            <input
              className="nr-input"
              placeholder="Enter role name"
              value={roleNameText}
              onChange={(e) => {
                setRoleNameText(e.target.value);
                setValidationMsg(null);
              }}
            />

          </div>

          {/* MODULE */}

          <div className="nr-field">

            <label className="nr-label">
              Module
              <span className="nr-required">
                *
              </span>
            </label>

            <div className="nr-select-wrap">

              <select
                className="nr-select"
                value={module}
                onChange={(e) => {

                  const selectedModule =
                    e.target.value;

                  // dropdown update
                  setModule(selectedModule);

                  // tab update
                  setActiveTab(selectedModule);
                }}
              >

                <option value="Platform">
                  Platform
                </option>

                <option value="File based systems">
                  File based systems
                </option>

                <option value="CDS">
                  CDS
                </option>

                <option value="Lims">
                  Lims
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ERROR BANNER */}

        {(validationMsg || submitError) && (
          <div className="nr-error-banner">
            <svg className="nr-error-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5"/>
              <path d="M10 6v4M10 14h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {validationMsg || submitError}
          </div>
        )}

        {/* TABS */}

        <div className="nr-tabs">

          {TABS.map((tab) => (

            <button
              type="button"
              key={tab}
              className={`nr-tab ${
                activeTab === tab
                  ? "nr-tab-active"
                  : ""
              }`}
              onClick={() => {

                // active tab update
                setActiveTab(tab);

                // dropdown sync
                setModule(tab);
              }}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* TABLE */}

        <div className="nr-table-wrap">

          {/* TABLE HEADER */}

          <div className="nr-table-header">

            <span className="nr-col-name">
              Privilege name
            </span>

            <span className="nr-col-check">
              Create
            </span>

            <span className="nr-col-check">
              Edit
            </span>

            <span className="nr-col-check">
              View
            </span>

          </div>

          {/* TABLE BODY */}

          <div className="nr-table-body">

            {currentGroups.map((group) => (

              <div
                key={group.key}
                className="nr-group"
              >

                {/* GROUP HEADER */}

                <div
                  className="nr-group-row"
                  onClick={() =>
                    toggleExpand(group.key)
                  }
                >

                  <span className="nr-group-label">
                    {group.label}
                  </span>

                  <span className="nr-group-count">
                    {group.count} Privileges
                  </span>

                </div>

                {/* PRIVILEGES */}

                {group.expanded &&
                  group.privileges.map(
                    (priv, i) => (

                    <div
                      key={priv.id}
                      className={`nr-priv-row ${
                        i <
                        group.privileges.length - 1
                          ? "nr-priv-row-border"
                          : ""
                      }`}
                    >

                      <div className="nr-priv-name-wrap">
                        <span className="nr-priv-name">
                          {priv.name}
                        </span>
                      </div>

                      {/* CREATE */}

                      <span className="nr-col-check">

                        <Checkbox
                          checked={priv.create}
                          onChange={() =>
                            togglePrivilege(
                              group.key,
                              priv.id,
                              "create"
                            )
                          }
                        />

                      </span>

                      {/* EDIT */}

                      <span className="nr-col-check">

                        <Checkbox
                          checked={priv.edit}
                          onChange={() =>
                            togglePrivilege(
                              group.key,
                              priv.id,
                              "edit"
                            )
                          }
                        />

                      </span>

                      {/* VIEW */}

                      <span className="nr-col-check">

                        <Checkbox
                          checked={priv.view}
                          onChange={() =>
                            togglePrivilege(
                              group.key,
                              priv.id,
                              "view"
                            )
                          }
                        />

                      </span>

                    </div>

                  ))}

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="nr-footer">

        <button
          className="nr-cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="nr-submit-btn"
          onClick={handleSubmit}
        >
          Submit
        </button>

      </div>

    </div>
  );
};

export default NewRole;