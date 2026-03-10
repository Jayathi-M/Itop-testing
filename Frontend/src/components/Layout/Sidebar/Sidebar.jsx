import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';

/* ── Nav icons ── */
const TOP_NAV = [
  { id: 'chart', icon: 'fa-solid fa-chart-column',path: '/dashboard' },
  { id: 'gear',  icon: 'fa-solid fa-gear',        path: null          },
  { id: 'user',  icon: 'fa-solid fa-user',         path: '/users'      },
  { id: 'workflow',  icon:'fa-solid fa-chart-diagram', path: '/workflow'  },
];

const BTM_NAV = [
  { id: 'bell', icon: 'fa-solid fa-bell',            dot: true  },
  { id: 'help', icon: 'fa-solid fa-circle-question', dot: false },
];

const CONFIG_GROUPS = [
  {
    label: 'Core Settings',
    items: [
      { label: 'System', path: '/configurations/system' },
      { label: 'Plant', path: '/configurations/plant' },
      { label: 'Asset', path: '/configurations/asset' },
    ],
  },
  {
    label: 'Business Logic',
    items: [
      { label: 'Business Rules', path: '/configurations/rules' },
      { label: 'Templates', path: '/configurations/templates' },
      { label: 'Workflows', path: '/configurations/workflow' },
    ],
  },
  {
    label: 'Reporting & Access',
    items: [
      { label: 'Dashboards', path: '/configurations/dashboards' },
      { label: 'Reports', path: '/configurations/reports' },
      { label: 'Users', path: '/users' },
    ],
  },
];

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [cfgOpen, setCfgOpen] = useState(false);

  // ✅ Default theme is LIGHT
  const [isLight, setIsLight] = useState(true);

  const isConfigRoute = location.pathname.startsWith('/configurations');

  function isActive(path) {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  // ✅ Set theme on initial mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // ✅ Toggle theme properly
  function toggleTheme() {
    const nextTheme = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    setIsLight(!isLight);
  }

  function handleNav(path) {
    navigate(path);
    setCfgOpen(false);
  }

  return (
    <div className="sb-wrap">

      {/* ── Sidebar ── */}
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

          {/* ✅ Theme Toggle */}
          <button
            className={`sb__toggle ${!isLight ? 'sb__toggle--on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="sb__toggle-thumb" />
          </button>

        </div>
      </nav>

      {/* ── Config Panel ── */}
      {cfgOpen && (
        <div className="cfg-panel">
          <div className="cfg-panel__head">
            <span className="cfg-panel__title">Configuration Center</span>
            <button
              className="cfg-panel__back"
              onClick={() => setCfgOpen(false)}
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div>

          <div className="cfg-panel__body">
            {CONFIG_GROUPS.map(group => (
              <div key={group.label} className="cfg-group">
                <div className="cfg-group__label">{group.label}</div>
                {group.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `cfg-item ${isActive ? 'cfg-item--active' : ''}`
                    }
                    onClick={() => setCfgOpen(false)}
                  >
                    {item.label}
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