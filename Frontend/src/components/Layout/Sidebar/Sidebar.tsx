import { useState } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './Sidebar.css'

interface NavItem {
  id: string
  icon: string
  path: string | null
}

interface BtmItem {
  id: string
  icon: string
  dot: boolean
}

interface ConfigItem {
  label: string
  path: string
  Icon: () => JSX.Element
}

interface ConfigGroup {
  label: string
  items: ConfigItem[]
}

interface Config {
  label: string
  items: ConfigItem[]
}


const TOP_NAV: NavItem[] = [
  { id: 'chart',    icon: 'fa-solid fa-chart-column',   path: '/dashboard' },
  { id: 'gear',     icon: 'fa-solid fa-gear',            path: null         },
  { id: 'workflow', icon: 'fa-solid fa-chart-diagram',   path: '/workflow'  },
  { id: 'user',     icon: 'fa-solid fa-user',            path: '/users'     },
  { id: 'UMS',      icon: 'fa-solid fa-users ',           path: null         },
  { id: 'audit',    icon: '',                             path: null         },
]

const BTM_NAV: BtmItem[] = [
  { id: 'bell', icon: 'fa-solid fa-bell',            dot: true  },
  { id: 'help', icon: 'fa-solid fa-circle-question', dot: false },
]

const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>
  </svg>
)
const PlantIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
)
const AssetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const BizRulesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const TemplatesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const WorkflowsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"/>
    <circle cx="6" cy="6" r="3"/>
    <path d="M6 21V9a9 9 0 0 0 9 9"/>
  </svg>
)
const DashboardsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const ReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)


const UMSIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
    <path d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"/>
  </svg>
)

const AuditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)

const DashboardSubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const QueueSubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9"  y1="6"  x2="20" y2="6"/>
    <line x1="9"  y1="12" x2="20" y2="12"/>
    <line x1="9"  y1="18" x2="20" y2="18"/>
    <line x1="4"  y1="6"  x2="4.01" y2="6"/>
    <line x1="4"  y1="12" x2="4.01" y2="12"/>
    <line x1="4"  y1="18" x2="4.01" y2="18"/>
  </svg>
)
const RecordReviewIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>
)
const ReportSubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)
const CircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
  </svg>
)

const AUDIT_NAV = [
  { id: 'dashboard',     label: 'Dashboard',    path: '/dashboard',           Icon: DashboardSubIcon, circle: false },
  { id: 'queue',         label: 'Queue',         path: '/audit/queue',         Icon: QueueSubIcon,     circle: false },
  { id: 'record-review', label: 'Record Review', path: '/audit/record-review', Icon: RecordReviewIcon, circle: false },
  { id: 'report',        label: 'Report',        path: '/audit/report',        Icon: ReportSubIcon,    circle: false },
  { id: 'agent-logs',    label: 'Agent Logs',    path: '/audit/agent-logs',    Icon: CircleIcon,       circle: true  },
  { id: 'audit-trail',   label: 'Audit Trail',   path: '/audit/audit-trail',   Icon: CircleIcon,       circle: true  },
]

const CONFIG_GROUPS: ConfigGroup[] = [
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
      // { label: 'UMS',          path: '/userslist',                     Icon: UMSIcon      },
    ],
  }, 
]

const CONFIG_USERS: Config[] = [
  {
    label: 'User Management',
    items: [
      { label: 'UsersList', path: '/userslist', Icon: () => <i className="fa-solid fa-users" /> },
      { label: 'Role',      path: '/role',     Icon: () => <i className="fa-solid fa-user-gear" /> },
      { label: 'Approvals', path: '/approvals', Icon: () => <i className="fa-solid fa-circle-check" /> },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cfgOpen, setCfgOpen] = useState(false)
  const [usmOpen, setUsmOpen] = useState(false)
  const [auditOpen, setAuditOpen] = useState(false)

  const isUMSRoute = ['/userslist', '/role', '/approvals'].some(p =>
    location.pathname.startsWith(p)
  )
  const isAuditRoute = location.pathname.startsWith('/audit')

  function isActive(path: string | null): boolean {
    if (!path) return false
    if (isUMSRoute) return false
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  function handleNav(path: string | null) {
    if (!path) return
    navigate(path)
    setCfgOpen(false)
    setUsmOpen(false)
    setAuditOpen(false)
  }

  return (
    <div className="sb-wrap">

      {/* ── Icon rail ── */}
      <nav className="sb">
        <div className="sb__top">
          {TOP_NAV.map(({ id, icon, path }) => {
            const active =
              id === 'gear'
                ? (location.pathname.startsWith('/configurations') || cfgOpen)
                : id === 'UMS'
                ? (usmOpen || isUMSRoute)
                : id === 'audit'
                ? (auditOpen || isAuditRoute)
                : isActive(path)
            return (
              <button
                key={id}
                className={`sb__btn ${active ? 'sb__btn--active' : ''}`}
                onClick={() => {
                  if (id === 'gear') {
                    setCfgOpen(p => !p)
                    setUsmOpen(false)
                    setAuditOpen(false)
                  } else if (id === 'UMS') {
                    setUsmOpen(p => !p)
                    setCfgOpen(false)
                    setAuditOpen(false)
                  } else if (id === 'audit') {
                    setAuditOpen(p => !p)
                    setCfgOpen(false)
                    setUsmOpen(false)
                  } else {
                    handleNav(path)
                  }
                }}
              >
                {id === 'audit' ? <AuditIcon /> : <i className={icon} />}
              </button>
            )
          })}
        </div>

        <div className="sb__btm">
          {BTM_NAV.map(({ id, icon, dot }) => (
            <button key={id} className="sb__btn">
              <i className={icon} />
              {dot && <span className="sb__dot" />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Config panel ── */}
      {cfgOpen && (
        <div className="cfg-panel">

          <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">Configuration Center</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setCfgOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div>

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

      {usmOpen && (
        <div className="cfg-panel">

          <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">User Management</span>
              <span className="cfg-panel__title-bar" />
            </div>
            {/* ✅ FIX 2: correct setter */}
            <button className="cfg-panel__back" onClick={() => setUsmOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div>

          <div className="cfg-panel__body">
            {/* ✅ FIX 3: use CONFIG_USERS */}
            {CONFIG_USERS.map(group => (
              <div key={group.label} className="cfg-group">

                <div className="cfg-group__label">{group.label}</div>

                {group.items.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `cfg-item${isActive ? ' cfg-item--active' : ''}`
                    }
                    onClick={() => setUsmOpen(false)}  // ✅ also fix here
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

      {/* ── Audit panel ── */}
      {auditOpen && (
        <aside className="sb-panel">
          <div className="sb-panel__head">
            <span className="sb-panel__title">Audit</span>
            <span className="sb-panel__title-bar" />
          </div>
          <nav className="sb-panel__body">
            {AUDIT_NAV.map(({ id, label, path, Icon, circle }) => (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) =>
                  `sb-panel__item${isActive ? ' sb-panel__item--active' : ''}${circle ? ' sb-panel__item--circle' : ''}`
                }
              >
                {({ isActive: navActive }) => (
                  <>
                    <span className={`sb-panel__icon${navActive ? ' sb-panel__icon--active' : ''}`}>
                      <Icon />
                    </span>
                    <span className="sb-panel__label">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

    </div>
  )
}
