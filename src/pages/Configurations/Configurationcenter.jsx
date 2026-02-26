import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Configurationcenter.css';

const CONFIG_GROUPS = [
  {
    label: 'Core Settings',
    items: [
      { label: 'System',   path: '/configuration/system'   },
      { label: 'Plant',    path: '/configuration/plant'    },
      { label: 'Asset',    path: '/configuration/asset'    },
    ],
  },
  {
    label: 'Business Logic',
    items: [
      { label: 'Business Rules', path: '/configuration/business-rules' },
      { label: 'Templates',      path: '/configuration/templates'      },
      { label: 'Workflows',      path: '/configuration/workflows'      },
    ],
  },
  {
    label: 'Reporting & Access',
    items: [
      { label: 'Dashboards', path: '/configuration/dashboards' },
      { label: 'Reports',    path: '/configuration/reports'    },
      { label: 'Users',      path: '/configuration/users'      },
    ],
  },
];

export default function ConfigurationCenter() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Check if we're on a sub-page or just /configuration
  const isRoot = location.pathname === '/configuration';

  return (
    <div className="cfg-layout">

      {/* ── Left panel — Configuration Center menu ── */}
      <div className="cfg-panel">
        <div className="cfg-panel__header">
          <span className="cfg-panel__title">Configuration Center</span>
          <button
            className="cfg-panel__back"
            onClick={() => navigate('/')}
            title="Back to Home"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
        </div>

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
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* ── Right — sub-page renders here ── */}
      <div className="cfg-content">
        {isRoot ? (
          <div className="cfg-content__empty">
            <div className="cfg-content__empty-icon">⚙</div>
            <div className="cfg-content__empty-text">Select a configuration item from the left</div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>

    </div>
  );
}