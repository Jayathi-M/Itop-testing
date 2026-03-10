import { NavLink, Outlet, useLocation } from "react-router-dom";

/* ─────────────────────────────
   Icons
───────────────────────────── */
const Icons = {
  System: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>
    </svg>
  ),

  Plant: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M8 7h8M8 12h8M8 17h5"/>
    </svg>
  ),

  Asset: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/>
    </svg>
  ),

  BusinessRules: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17l6-6 4 4 8-8"/>
    </svg>
  ),

  Templates: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),

  Workflows: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="18" cy="18" r="3"/>
      <path d="M6 9v12h9"/>
    </svg>
  ),

  Dashboards: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),

  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3h18v18H3z"/>
      <path d="M7 7h10M7 12h10M7 17h6"/>
    </svg>
  ),

  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="7" r="4"/>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5"/>
    </svg>
  )
};


/* ─────────────────────────────
   Configuration Menu Structure
───────────────────────────── */

const CONFIG_GROUPS = [
  {
    label: "Core Settings",
    items: [
      { label: "System", path: "/configuration/system", Icon: Icons.System },
      { label: "Plant", path: "/configuration/plant", Icon: Icons.Plant },
      { label: "Asset", path: "/configuration/asset", Icon: Icons.Asset },
    ]
  },
  {
    label: "Business Logic",
    items: [
      { label: "Business Rules", path: "/configuration/business-rules", Icon: Icons.BusinessRules },
      { label: "Templates", path: "/configuration/templates", Icon: Icons.Templates },
      { label: "Workflows", path: "/configuration/workflows", Icon: Icons.Workflows },
    ]
  },
  {
    label: "Reporting & Access",
    items: [
      { label: "Dashboards", path: "/configuration/dashboards", Icon: Icons.Dashboards },
      { label: "Reports", path: "/configuration/reports", Icon: Icons.Reports },
      { label: "Users", path: "/configuration/users", Icon: Icons.Users },
    ]
  }
];


export default function ConfigurationCenter() {

  const location = useLocation();
  const isRoot = location.pathname === "/configuration";

  return (

    <div className="cc-layout">

      {/* LEFT CONFIG PANEL */}

      <div className="cc-sidebar">

        <div className="cc-sidebar__header">
          <span className="cc-title">CONFIGURATION CENTER</span>
        </div>

        <div className="cc-sidebar__body">

          {CONFIG_GROUPS.map(group => (

            <div key={group.label} className="cc-group">

              <div className="cc-group-label">{group.label}</div>

              {group.items.map(({ label, path, Icon }) => (

                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `cc-item ${isActive ? "cc-item--active" : ""}`
                  }
                >

                  <div className="cc-item-icon">
                    <Icon />
                  </div>

                  <div className="cc-item-text">
                    {label}
                  </div>

                </NavLink>

              ))}

            </div>

          ))}

        </div>

      </div>


      {/* RIGHT CONTENT */}

      <div className="cc-main">

        {isRoot ? (
          <div className="cc-empty">
            <div className="cc-empty-icon">⚙</div>
            <div>Select a configuration option</div>
          </div>
        ) : (
          <Outlet />
        )}

      </div>

    </div>

  );
}