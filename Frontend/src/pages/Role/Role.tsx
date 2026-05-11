// Role.tsx

import React, { useState, useEffect } from "react";
import "./Role.css";
import NewRole from "./NewRole/NewRole";
import EditRole from "./EditRole/EditRole";

const BASE_URL = "http://localhost:5134";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface RoleResponse {
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  changedBy: number | null;
  changedDate: string | null;
}

interface RoleRow {
  id: number;
  name: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  changedBy: number | null;
  changedDate: string | null;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const mapToRow = (r: RoleResponse): RoleRow => ({
  id: r.roleId,
  name: r.roleName,
  isActive: r.isActive,
  createdBy: r.createdBy,
  createdDate: r.createdDate,
  changedBy: r.changedBy,
  changedDate: r.changedDate,
});

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <span className={`role-badge ${isActive ? "role-badge-active" : "role-badge-inactive"}`}>
    {isActive ? "Active" : "Inactive"}
  </span>
);

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.846 2.404a1.937 1.937 0 012.738 2.738l-.91.91-2.738-2.738.91-.91zM12.748 4.5L3.5 13.748V16.5h2.752l9.248-9.248L12.748 4.5z"
      fill="currentColor"
    />
  </svg>
);

// ─────────────────────────────────────────────
// LOGGED-IN USER
// ─────────────────────────────────────────────

const getLoggedInUserId = (): number => {
  return parseInt(localStorage.getItem("userId") ?? "1", 10);
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const Role: React.FC = () => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showNewRole, setShowNewRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleRow | null>(null);

  const [search, setSearch] = useState("");

  // ─────────────────────────────────────────────
  // GET — load roles on mount
  // ─────────────────────────────────────────────

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/user-management/roles`);
      if (!res.ok) throw new Error(`Failed to load roles (${res.status})`);
      const data: RoleResponse[] = await res.json();
      setRoles(data.map(mapToRow));
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ─────────────────────────────────────────────
  // POST — create new role
  // ─────────────────────────────────────────────

  const parseResponse = async (res: Response) => {
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return {}; }
  };

  const handleNewRoleSubmit = async (data: { roleName: string }) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/user-management/newrole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleName: data.roleName,
          createdBy: getLoggedInUserId(),
        }),
      });

      const result = await parseResponse(res);

      if (!res.ok) {
        throw new Error(result.message ?? "Failed to create role");
      }

      await fetchRoles();
      setShowNewRole(false);
      setSuccess(result.message ?? "Role created successfully!");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
  };

  // ─────────────────────────────────────────────
  // PUT — update existing role
  // ─────────────────────────────────────────────

  const handleUpdateRole = async (data: { roleName: string }) => {
    if (!selectedRole) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/user-management/updaterole/${selectedRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleName: data.roleName,
          changedBy: getLoggedInUserId(),
        }),
      });

      const result = await parseResponse(res);

      if (!res.ok) {
        throw new Error(result.message ?? "Failed to update role");
      }

      await fetchRoles();
      setShowEditRole(false);
      setSelectedRole(null);
      setSuccess(result.message ?? "Role updated successfully!");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
  };

  // ─────────────────────────────────────────────
  // OPEN EDIT PAGE
  // ─────────────────────────────────────────────

  const handleEditClick = (role: RoleRow) => {
    setSelectedRole(role);
    setShowEditRole(true);
  };

  // ─────────────────────────────────────────────
  // SEARCH FILTER
  // ─────────────────────────────────────────────

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  // ─────────────────────────────────────────────
  // SHOW NEW ROLE PAGE
  // ─────────────────────────────────────────────

  if (showNewRole) {
    return (
      <NewRole
        onCancel={() => { setShowNewRole(false); setError(null); }}
        onSubmit={handleNewRoleSubmit}
        submitError={error}
      />
    );
  }

  // ─────────────────────────────────────────────
  // SHOW EDIT ROLE PAGE
  // ─────────────────────────────────────────────

  if (showEditRole && selectedRole) {
    return (
      <EditRole
        roleData={selectedRole}
        onCancel={() => {
          setShowEditRole(false);
          setSelectedRole(null);
          setError(null);
        }}
        onSubmit={handleUpdateRole}
        submitError={error}
      />
    );
  }

  // ─────────────────────────────────────────────
  // MAIN TABLE UI
  // ─────────────────────────────────────────────

  return (
    <div className="role-page">
      <div className="role-table-wrap">

        {/* ERROR BANNER */}
        {error && (
          <div className="role-error-banner">
            <svg className="role-banner-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5"/>
              <path d="M10 6v4M10 14h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
            <button className="role-banner-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* TOP BAR */}
        <div className="role-toolbar">
          <div className="role-search-wrap">
            <input
              className="role-search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="role-new-btn"
            onClick={() => setShowNewRole(true)}
          >
            + New Role
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="role-loading">Loading roles...</div>
        )}

        {/* TABLE */}
        {!loading && (
          <table className="role-table">
            <thead>
              <tr>
                <th>S NO</th>
                <th>ROLE NAME</th>
                <th>STATUS</th>
                <th>CREATED BY</th>
                <th>CREATED ON</th>
                <th>MODIFIED BY</th>
                <th>MODIFIED ON</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoles.map((role, index) => (
                <tr key={role.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="role-name">{role.name}</div>
                  </td>

                  <td>
                    <StatusBadge isActive={role.isActive} />
                  </td>

                  <td>{role.createdBy}</td>

                  <td>{formatDate(role.createdDate)}</td>

                  <td>{role.changedBy ?? "—"}</td>

                  <td>{formatDate(role.changedDate)}</td>

                  <td>
                    <button
                      className="role-action-btn"
                      onClick={() => handleEditClick(role)}
                    >
                      <PencilIcon />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="role-success-overlay" onClick={() => setSuccess(null)}>
          <div className="role-success-box" onClick={(e) => e.stopPropagation()}>
            <div className="role-success-icon">
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#eafaf1"/>
                <path d="M18 28l8 8 14-14" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="role-success-title">Success!</h3>
            <p className="role-success-msg">{success}</p>
            <button className="role-success-btn" onClick={() => setSuccess(null)}>Done</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Role;