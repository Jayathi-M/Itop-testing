import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import logoImg from '../../../assets/Logo.svg'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './Sidebar.css'

interface NavItem {
  id: string
  label: string
  path: string | null
  panel?: 'config' | 'ums' | 'audit' | 'masters'
}

interface ConfigItem {
  label: string
  path: string
  Icon: () => React.ReactElement
}

interface ConfigGroup {
  label: string
  items: ConfigItem[]
}

// ── Nav icons (outline 24px, matching Figma style) ──
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)
const ExceptionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)
const ConfigNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const MastersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
    <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
  </svg>
)
const UsersNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const PoliciesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="4"/>
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
  </svg>
)

// ── Config panel sub-icons ──
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
const UsersSubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

// ── Audit sub-panel icons ──
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

// ── Top nav items ──
const TOP_NAV: NavItem[] = [
  { id: 'home',       label: 'Home',       path: '/dashboard'  },
  { id: 'exceptions', label: 'Exceptions', path: null,          panel: 'audit'  },
  { id: 'config',     label: 'Config',     path: null,          panel: 'config' },
  { id: 'masters',    label: 'Masters',    path: null,          panel: 'masters' },
  { id: 'users',      label: 'Users',      path: null,          panel: 'ums'    },
  { id: 'policies',   label: 'Policies',   path: '/approvals'  },
]

const NAV_ICONS: Record<string, () => React.ReactElement> = {
  home:       HomeIcon,
  exceptions: ExceptionsIcon,
  config:     ConfigNavIcon,
  masters:    MastersIcon,
  users:      UsersNavIcon,
  policies:   PoliciesIcon,
}

// ── Config panel groups ──
const CONFIG_GROUPS: ConfigGroup[] = [
  {
    label: 'Core Settings',
    items: [
      { label: 'System',         path: '/configurations/system',     Icon: SystemIcon     },
      { label: 'Plant',          path: '/configurations/plant',      Icon: PlantIcon      },
      { label: 'Asset',          path: '/configurations/asset',      Icon: AssetIcon      },
    ],
  },
  {
    label: 'Business Logic',
    items: [
      { label: 'Business Rules', path: '/configurations/rules',      Icon: BizRulesIcon   },
      { label: 'Templates',      path: '/configurations/templates',  Icon: TemplatesIcon  },
      { label: 'Workflows',      path: '/configurations/workflow',   Icon: WorkflowsIcon  },
    ],
  },
  {
    label: 'Reporting & Access',
    items: [
      { label: 'Dashboards',     path: '/configurations/dashboards', Icon: DashboardsIcon },
      { label: 'Reports',        path: '/configurations/reports',    Icon: ReportsIcon    },
      { label: 'Users',          path: '/users',                     Icon: UsersSubIcon   },
    ],
  },
]

// ── UMS panel groups ──
const CONFIG_USERS: ConfigGroup[] = [
  {
    label: 'User Management',
    items: [
      { label: 'UsersList', path: '/userslist', Icon: () => <i className="fa-solid fa-users" /> },
      { label: 'Role',      path: '/role',      Icon: () => <i className="fa-solid fa-user-gear" /> },
      { label: 'Approvals', path: '/approvals', Icon: () => <i className="fa-solid fa-circle-check" /> },
    ],
  },
]

// ── Masters panel groups (same pattern as Config/UMS/Audit) ──
const MASTERS_GROUPS: ConfigGroup[] = [
  {
    label: 'Master Tables',
    items: [
      { label: 'Master List',      path: '/masters/table/plant',           Icon: CircleIcon       },
      { label: 'Table master',     path: '/masters/table/employee',        Icon: CircleIcon       },
      { label: 'Groups',           path: '/masters/table/role',            Icon: ReportsIcon      },
      { label: 'Dashboard Builder',  path: '/masters/table/report-template', Icon: ReportsIcon    },
      { label: 'Report Builder',    path: '/masters/table/workflow',        Icon: CircleIcon      },
      { label: 'Audit Trail',      path: '/masters/table/list-master',     Icon: CircleIcon       },
    ],
  },
]

// ── Audit sub-panel nav ──
const AUDIT_NAV = [
  { id: 'dashboard',     label: 'Dashboard',    path: '/dashboard',           Icon: DashboardSubIcon, circle: false },
  { id: 'queue',         label: 'Queue',         path: '/audit/queue',         Icon: QueueSubIcon,     circle: false },
  { id: 'record-review', label: 'Record Review', path: '/audit/record-review', Icon: RecordReviewIcon, circle: false },
  { id: 'report',        label: 'Report',        path: '/audit/report',        Icon: ReportSubIcon,    circle: false },
  { id: 'agent-logs',    label: 'Agent Logs',    path: '/audit/agent-logs',    Icon: CircleIcon,       circle: true  },
  { id: 'audit-trail',   label: 'Audit Trail',   path: '/audit/audit-trail',   Icon: CircleIcon,       circle: true  },
]

export default function Sidebar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [cfgOpen,     setCfgOpen]     = useState(false)
  const [usmOpen,     setUsmOpen]     = useState(false)
  const [auditOpen,   setAuditOpen]   = useState(false)
  const [mastersOpen, setMastersOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const username = sessionStorage.getItem('username') || 'Unknown User'
  const role     = sessionStorage.getItem('role')     || 'User'
  const userId   = 'USR-' + username.slice(0, 3).toUpperCase().padEnd(3, 'X') + '001'
  const initials = username.slice(0, 1).toUpperCase()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen])

  const isUMSRoute     = ['/userslist', '/role', '/approvals'].some(p => location.pathname.startsWith(p))
  const isAuditRoute   = location.pathname.startsWith('/audit')
  const isMastersRoute = location.pathname.startsWith('/masters/table') || location.pathname.startsWith('/masters/list') || location.pathname.startsWith('/masters/groups')

  function isActive(item: NavItem): boolean {
    if (item.panel === 'config')  return location.pathname.startsWith('/configurations') || cfgOpen
    if (item.panel === 'ums')     return usmOpen || isUMSRoute
    if (item.panel === 'audit')   return auditOpen || isAuditRoute
    if (item.panel === 'masters') return mastersOpen || isMastersRoute
    if (!item.path) return false
    if (isUMSRoute) return false
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  }

  function closeAllPanels() {
    setCfgOpen(false); setUsmOpen(false); setAuditOpen(false); setMastersOpen(false)
  }

  function handleNav(item: NavItem) {
    if (item.panel === 'config') {
      setCfgOpen(p => !p); setUsmOpen(false); setAuditOpen(false); setMastersOpen(false)
    } else if (item.panel === 'ums') {
      setUsmOpen(p => !p); setCfgOpen(false); setAuditOpen(false); setMastersOpen(false)
    } else if (item.panel === 'audit') {
      setAuditOpen(p => !p); setCfgOpen(false); setUsmOpen(false); setMastersOpen(false)
    } else if (item.panel === 'masters') {
      setMastersOpen(p => !p); setCfgOpen(false); setUsmOpen(false); setAuditOpen(false)
    } else if (item.path) {
      navigate(item.path)
      closeAllPanels()
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('role')
    setProfileOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="sb-wrap">

      {/* ── Icon rail ── */}
      <nav className="sb">

        {/* Logo */}
        <div className="sb__logo">
          <img src={logoImg} alt="Logo" className="sb__logo-img" />
        </div>

        {/* Main nav items */}
        <div className="sb__top">
          {TOP_NAV.map(item => {
            const Icon   = NAV_ICONS[item.id]
            const active = isActive(item)
            return (
              <button
                key={item.id}
                className={`sb__btn ${active ? 'sb__btn--active' : ''}`}
                onClick={() => handleNav(item)}
              >
                <span className="sb__btn-icon"><Icon /></span>
                <span className="sb__btn-label">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="sb__btm">
          <button className="sb__icon-btn">
            <ConfigNavIcon />
          </button>
          <button className="sb__icon-btn sb__icon-btn--notify">
            <BellIcon />
            <span className="sb__dot" />
          </button>
          <button className="sb__icon-btn">
            <HelpIcon />
          </button>

          {/* Avatar + profile dropdown */}
          <div className="sb__avatar-wrap" ref={profileRef}>
            <button
              className={`sb__avatar ${profileOpen ? 'sb__avatar--open' : ''}`}
              onClick={() => setProfileOpen(p => !p)}
              title={username}
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="sb__profile-menu">
                <div className="sb__profile-menu-arrow" />
                <div className="sb__profile-user">
                  <div className="sb__profile-avatar-lg">{initials}</div>
                  <div className="sb__profile-info">
                    <span className="sb__profile-name">{username}</span>
                    <span className="sb__profile-id">{userId}</span>
                    <span className="sb__profile-role">{role}</span>
                  </div>
                </div>
                <div className="sb__profile-divider" />
                <button className="sb__profile-logout" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Config panel ── */}
      {cfgOpen && (
        <div className="cfg-panel">
          {/* <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">Configuration Center</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setCfgOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div> */}
          <div className="cfg-panel__body">
            {CONFIG_GROUPS.map(group => (
              <div key={group.label} className="cfg-group">
                <div className="cfg-group__label">{group.label}</div>
                {group.items.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `cfg-item${isActive ? ' cfg-item--active' : ''}`}
                    onClick={() => setCfgOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`cfg-item__icon${isActive ? ' cfg-item__icon--active' : ''}`}><Icon /></span>
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

      {/* ── UMS panel ── */}
      {usmOpen && (
        <div className="cfg-panel">
          {/* <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">User Management</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setUsmOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div> */}
          <div className="cfg-panel__body">
            {CONFIG_USERS.map(group => (
              <div key={group.label} className="cfg-group">
                <div className="cfg-group__label">{group.label}</div>
                {group.items.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `cfg-item${isActive ? ' cfg-item--active' : ''}`}
                    onClick={() => setUsmOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`cfg-item__icon${isActive ? ' cfg-item__icon--active' : ''}`}><Icon /></span>
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
        <div className="cfg-panel">
          {/* <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">Exceptions</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setAuditOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div> */}
          <div className="cfg-panel__body">
            <div className="cfg-group">
              <div className="cfg-group__label">Audit</div>
              {AUDIT_NAV.map(({ id, label, path, Icon }) => (
                <NavLink
                  key={id}
                  to={path}
                  className={({ isActive }) => `cfg-item${isActive ? ' cfg-item--active' : ''}`}
                  onClick={() => setAuditOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`cfg-item__icon${isActive ? ' cfg-item__icon--active' : ''}`}><Icon /></span>
                      <span className="cfg-item__text">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Masters panel ── */}
      {mastersOpen && (
        <div className="cfg-panel">
          {/* <div className="cfg-panel__head">
            <div className="cfg-panel__title-wrap">
              <span className="cfg-panel__title">Masters</span>
              <span className="cfg-panel__title-bar" />
            </div>
            <button className="cfg-panel__back" onClick={() => setMastersOpen(false)}>
              <i className="fa-solid fa-arrow-left" />
            </button>
          </div> */}
          <div className="cfg-panel__body">
            {MASTERS_GROUPS.map(group => (
              <div key={group.label} className="cfg-group">
                <div className="cfg-group__label">{group.label}</div>
                {group.items.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `cfg-item${isActive ? ' cfg-item--active' : ''}`}
                    onClick={() => setMastersOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`cfg-item__icon${isActive ? ' cfg-item__icon--active' : ''}`}><Icon /></span>
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
  )
}
