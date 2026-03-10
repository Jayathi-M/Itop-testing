import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';

const TOP_NAV = [
  { id: 'chart',    icon: 'fa-solid fa-chart-column',   path: '/dashboard' },
  { id: 'gear',     icon: 'fa-solid fa-gear',            path: null         },
  { id: 'user',     icon: 'fa-solid fa-user',            path: '/users'     },
  { id: 'workflow', icon: 'fa-solid fa-chart-diagram',   path: '/workflow'  },
];

const BTM_NAV = [
  { id: 'bell', icon: 'fa-solid fa-bell',            dot: true  },
  { id: 'help', icon: 'fa-solid fa-circle-question', dot: false },
];

/* ── SVG icons for each config item ── */
const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>
  </svg>
);
const PlantIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const AssetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const BizRulesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const TemplatesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const WorkflowsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"/>
    <circle cx="6" cy="6" r="3"/>
    <path d="M6 21V9a9 9 0 0 0 9 9"/>
  </svg>
);
const DashboardsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const ReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CONFIG_GROUPS = [
  {
    label: 'Core Settings',
    items: [
      { label: 'System',         path: '/configurations/system',     Icon: SystemIcon    },
      { label: 'Plant',          path: '/configurations/plant',      Icon: PlantIcon     },
      { label: 'Asset',          path: '/configurations/asset',      Icon: AssetIcon     },
    ],
  },
  {
    label: 'Business Logic',
    items: [
      { label: 'Business Rules', path: '/configurations/rules',      Icon: BizRulesIcon  },
      { label: 'Templates',      path: '/configurations/templates',  Icon: TemplatesIcon },
      { label: 'Workflows',      path: '/configurations/workflow',   Icon: WorkflowsIcon },
    ],
  },
  {
    label: 'Reporting & Access',
    items: [
      { label: 'Dashboards',     path: '/configurations/dashboards', Icon: DashboardsIcon },
      { label: 'Reports',        path: '/configurations/reports',    Icon: ReportsIcon    },
      { label: 'Users',          path: '/users',                     Icon: UsersIcon      },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cfgOpen, setCfgOpen] = useState(false);
  const [isLight, setIsLight] = useState(true);

  const isConfigRoute = location.pathname.startsWith('/configurations');

  function isActive(path) {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  function toggleTheme() {
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    setIsLight(!isLight);
  }

  function handleNav(path) {
    navigate(path);
    setCfgOpen(false);
  }

  return (
    <div className="sb-wrap">

      {/* ── Icon rail ── */}
      <nav className="sb">
        <div className="sb__top">
          {TOP_NAV.map(({ id, icon, path }) => {
            const active = id === 'gear'
              ? (isConfigRoute || cfgOpen)
              : isActive(path);
            return (
              <button
                key={id}
                className={`sb__btn ${active ? 'sb__btn--active' : ''}`}
                onClick={() => {
                  if (id === 'gear') setCfgOpen(p => !p);
                  else handleNav(path);
                }}
              >
                <i className={icon} />
              </button>
            );
          })}
        </div>

        <div className="sb__btm">
          {BTM_NAV.map(({ id, icon, dot }) => (
            <button key={id} className="sb__btn">
              <i className={icon} />
              {dot && <span className="sb__dot" />}
            </button>
          ))}
          <div className="sb__divider" />
          <button
            className={`sb__toggle ${!isLight ? 'sb__toggle--on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="sb__toggle-thumb" />
          </button>
        </div>
      </nav>

      {/* ── Config panel ── */}
      {cfgOpen && (
        <div className="cfg-panel">

          {/* Header with purple underline accent */}
          <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">Configuration Center</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setCfgOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div>

          {/* Nav groups */}
          <div className="cfg-panel__body">
            {CONFIG_GROUPS.map(group => (
              <div key={group.label} className="cfg-group">

                <div className="cfg-group__label">{group.label}</div>

                {group.items.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `cfg-item${isActive ? ' cfg-item--active' : ''}`
                    }
                    onClick={() => setCfgOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`cfg-item__icon${isActive ? ' cfg-item__icon--active' : ''}`}>
                          <Icon />
                        </span>
                        <span className="cfg-item__text">{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}