// EditRole.tsx

import React, { useState } from "react";
import "./EditRole.css";

interface EditRoleProps {
  roleData: {
    id: number;
    name: string;
  };
  onCancel: () => void;
  onSubmit: (data: { roleName: string }) => void;
  submitError?: string | null;
}

const EditRole: React.FC<EditRoleProps> = ({
  roleData,
  onCancel,
  onSubmit,
  submitError,
}) => {

  // ─────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────

  const [roleName, setRoleName] = useState(roleData.name);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState("Platform");

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────

  const handleSubmit = () => {
    if (!roleName.trim()) {
      setValidationMsg("Please enter a role name");
      return;
    }
    setValidationMsg(null);
    onSubmit({ roleName });
  };

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────

  return (
    <div className="edit-role-page">

      <div className="edit-role-card">

        {/* HEADER */}

        <div className="edit-role-header">
          <h2>Update Role</h2>

          <p>
            Update the existing role with the required
            details
          </p>
        </div>

        {/* FORM */}

        <div className="edit-role-form">

          <div className="form-group">
            <label>Role Name *</label>

            <input
              type="text"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                setValidationMsg(null);
              }}
            />
          </div>

          <div className="form-group">
            <label>Module *</label>

            <select
                value={activeTab}
                onChange={(e) =>
                setActiveTab(e.target.value)
                }
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

        {/* ERROR BANNER */}

        {(validationMsg || submitError) && (
          <div className="er-error-banner">
            <svg className="er-error-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5"/>
              <path d="M10 6v4M10 14h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {validationMsg || submitError}
          </div>
        )}

        {/* TABS */}

        <div className="tabs-container">

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "Platform"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("Platform")
            }
          >
            Platform
          </button>

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "File based systems"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("File based systems")
            }
          >
            File based systems
          </button>

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "CDS"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("CDS")
            }
          >
            CDS
          </button>

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "Lims"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("Lims")
            }
          >
            Lims
          </button>

        </div>

        {/* TABLE */}

        <table className="permission-table">

          <thead>
            <tr>
              <th>Privilege name</th>
              <th>Create</th>
              <th>Edit</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>

            {/* PLATFORM */}

            {activeTab === "Platform" && (
              <>
                <tr className="section-row">
                  <td>Platform</td>

                  <td
                    colSpan={3}
                    className="privilege-count"
                  >
                    3 Privileges
                  </td>
                </tr>

                <tr>
                  <td>Create Config</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>
                </tr>

                <tr>
                  <td>Edit Config</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>
                </tr>

                <tr>
                  <td>View Config</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>
                </tr>
              </>
            )}

            {/* FILE BASED SYSTEMS */}

            {activeTab === "File based systems" && (
              <>
                <tr className="section-row">
                  <td>File based systems</td>

                  <td
                    colSpan={3}
                    className="privilege-count"
                  >
                    2 Privileges
                  </td>
                </tr>

                <tr>
                  <td>Upload Files</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>
                </tr>

                <tr>
                  <td>Delete Files</td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>
                </tr>
              </>
            )}

            {/* CDS */}

            {activeTab === "CDS" && (
              <>
                <tr className="section-row">
                  <td>CDS</td>

                  <td
                    colSpan={3}
                    className="privilege-count"
                  >
                    2 Privileges
                  </td>
                </tr>

                <tr>
                  <td>Create CDS</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>
                </tr>

                <tr>
                  <td>Approve CDS</td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>
                </tr>
              </>
            )}

            {/* LIMS */}

            {activeTab === "Lims" && (
              <>
                <tr className="section-row">
                  <td>Lims</td>

                  <td
                    colSpan={3}
                    className="privilege-count"
                  >
                    2 Privileges
                  </td>
                </tr>

                <tr>
                  <td>Sample Entry</td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>
                </tr>

                <tr>
                  <td>Approve Sample</td>

                  <td>
                    <input
                      type="checkbox"
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />
                  </td>
                </tr>
              </>
            )}

          </tbody>

        </table>

        {/* FOOTER */}

        <div className="footer-buttons">

          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmit}
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditRole;