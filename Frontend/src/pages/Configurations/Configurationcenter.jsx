import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Configurationcenter.css';

/* ── SVG Icons ── */
const Icons = {
  System: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>
    </svg>
  ),
  Plant: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  Asset: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  BusinessRules: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Templates: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Workflows: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3"/>
      <circle cx="6" cy="6" r="3"/>
      <path d="M6 21V9a9 9 0 0 0 9 9"/>
    </svg>
  ),
  Dashboards: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
      <line x1="8" y1="9" x2="10" y2="9"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

const CONFIG_GROUPS = [
  {
    label: 'Core Settings',
    items: [
      { label: 'System',         path: '/configuration/system',         Icon: Icons.System },
      { label: 'Plant',          path: '/configuration/plant',          Icon: Icons.Plant },
      { label: 'Asset',          path: '/configuration/asset',          Icon: Icons.Asset },
    ],
  },
  {
    label: 'Business Logic',
    items: [
      { label: 'Business Rules', path: '/configuration/business-rules', Icon: Icons.BusinessRules },
      { label: 'Templates',      path: '/configuration/templates',      Icon: Icons.Templates },
      { label: 'Workflows',      path: '/configuration/workflows',      Icon: Icons.Workflows },
    ],
  },
  {
    label: 'Reporting & Access',
    items: [
      { label: 'Dashboards', path: '/configuration/dashboards', Icon: Icons.Dashboards },
      { label: 'Reports',    path: '/configuration/reports',    Icon: Icons.Reports },
      { label: 'Users',      path: '/configuration/users',      Icon: Icons.Users },
    ],
  },
];

export default function ConfigurationCenter() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isRoot    = location.pathname === '/configuration';

  return (
    <div className="cc-layout">

      {/* ── Left sidebar ── */}
      <div className="cc-sidebar">

        {/* Title block */}
        <div className="cc-sidebar__header">
          <div className="cc-sidebar__title-wrap">
            <span className="cc-sidebar__title">Configuration Center</span>
            <span className="cc-sidebar__title-bar" />
          </div>
        </div>

        {/* Nav groups */}
        <div className="cc-sidebar__body">
          {CONFIG_GROUPS.map(group => (
            <div key={group.label} className="cc-nav-group">

              <span className="cc-nav-group__label">{group.label}</span>

              {group.items.map(({ label, path, Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `cc-nav-item${isActive ? ' cc-nav-item--active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`cc-nav-item__icon-box${isActive ? ' cc-nav-item__icon-box--active' : ''}`}>
                        <Icon />
                      </span>
                      <span className="cc-nav-item__text">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}

            </div>
          ))}
        </div>

      </div>

      {/* ── Right content area ── */}
      <div className="cc-main">
        {isRoot ? (
          <div className="cc-main__empty">
            <span className="cc-main__empty-icon">⚙️</span>
            <span className="cc-main__empty-text">
              Select a configuration item from the left
            </span>
          </div>
        ) : (
          <Outlet />
        )}
      </div>

    </div>
  );
}