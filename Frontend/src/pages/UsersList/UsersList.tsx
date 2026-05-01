import './UsersList.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

type UserStatus = 'Active' | 'Locked' | 'Inactive'

interface User {
  id: number
  userId: string
  name: string
  email: string
  plant: string
  group: string
  role: string
  status: UserStatus
}

interface PendingInvite {
  id: number
  userId: string
  name: string
  plant: string
  group: string
  role: string
}

const MOCK_USERS: User[] = [
  { id: 1, userId: 'ZX1000245', name: 'Mohan Vasireddy', email: 'mohan@xception.ai', plant: 'Site A, Site B', group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 2, userId: 'ZX1000246', name: 'Priya Sharma',    email: 'priya@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Reviewer',     status: 'Locked'   },
  { id: 3, userId: 'ZX1000247', name: 'Ravi Kumar',      email: 'ravi@xception.ai',   plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 4, userId: 'ZX1000248', name: 'Sneha Patel',     email: 'sneha@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Lab Analyst',  status: 'Inactive' },
  { id: 5, userId: 'ZX1000249', name: 'Arjun Mehta',     email: 'arjun@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 6, userId: 'ZX1000250', name: 'Divya Reddy',     email: 'divya@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Auditor',      status: 'Inactive' },
  { id: 7, userId: 'ZX1000251', name: 'Kiran Naidu',     email: 'kiran@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Locked'   },
  { id: 8, userId: 'ZX1000249', name: 'Arjun Mehta',     email: 'arjun@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 9, userId: 'ZX1000250', name: 'Divya Reddy',     email: 'divya@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Auditor',      status: 'Inactive' },
  { id: 10, userId: 'ZX1000251', name: 'Kiran Naidu',     email: 'kiran@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Locked'   },
  { id: 12, userId: 'ZX1000249', name: 'Arjun Mehta',     email: 'arjun@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 13, userId: 'ZX1000250', name: 'Divya Reddy',     email: 'divya@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Auditor',      status: 'Inactive' },
  { id: 14, userId: 'ZX1000251', name: 'Kiran Naidu',     email: 'kiran@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Locked'   },
  { id: 15, userId: 'ZX1000251', name: 'Kiran Naidu',     email: 'kiran@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Locked'   },
  { id: 16, userId: 'ZX1000249', name: 'Arjun Mehta',     email: 'arjun@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Active'   },
  { id: 17, userId: 'ZX1000250', name: 'Divya Reddy',     email: 'divya@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'Auditor',      status: 'Inactive' },
  { id: 18, userId: 'ZX1000251', name: 'Kiran Naidu',     email: 'kiran@xception.ai',  plant: 'Site A',        group: 'Group name', role: 'System Admin', status: 'Locked'   },
]

const MOCK_PENDING: PendingInvite[] = [
  { id: 1, userId: 'ZX1000252', name: 'Mohan Vasireddy', plant: 'Site A, Site B', group: 'Group name', role: 'System Admin' },
  { id: 2, userId: 'ZX1000253', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'Reviewer'     },
  { id: 3, userId: 'ZX1000254', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 4, userId: 'ZX1000255', name: 'Pavan', plant: 'Site A',         group: 'Group name', role: 'Lab Analyst'  },
  { id: 5, userId: 'ZX1000256', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 6, userId: 'ZX1000257', name: 'Pavan', plant: 'Site A',         group: 'Group name', role: 'Auditor'      },
  { id: 7, userId: 'ZX1000258', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 8, userId: 'ZX1000259', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'Reviewer'     },
  { id: 9, userId: 'ZX1000252', name: 'Pavan', plant: 'Site A, Site B', group: 'Group name', role: 'System Admin' },
  { id: 10, userId: 'ZX1000253', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'Reviewer'     },
  { id: 11, userId: 'ZX1000254', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 12, userId: 'ZX1000255', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'Lab Analyst'  },
  { id: 13, userId: 'ZX1000256', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 14, userId: 'ZX1000257', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'Auditor'      },
  { id: 15, userId: 'ZX1000258', name: 'Mohan Vasireddy', plant: 'Site A',         group: 'Group name', role: 'System Admin' },
  { id: 16, userId: 'ZX1000259', name: 'Kushal', plant: 'Site A',         group: 'Group name', role: 'Reviewer'     },
]

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function UsersList() {
  const navigate = useNavigate()
  const [users, setUsers]           = useState<User[]>(MOCK_USERS)
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab]   = useState<'existing' | 'pending'>('existing')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [pageSize, setPageSize]     = useState(7)
  const [openMenu, setOpenMenu]     = useState<number | null>(null)

  useEffect(() => {
    const stored: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    if (stored.length > 0) {
      const mapped = stored.map((u: any, i: number) => ({
        id:     u.id ?? i + 1,
        userId: u.userId ?? `ZX${String(1000200 + i + 1).slice(-7)}`,
        name:   u.name  ?? '—',
        email:  u.email ?? '—',
        plant:  u.plant ?? (u.groups ? Object.values(u.groups as Record<string,string[]>).flat().slice(0,2).join(', ') : '—'),
        group:  u.group ?? (u.groups ? Object.keys(u.groups as Record<string,string[]>).join(', ') : '—'),
        role:   u.roles ?? u.role ?? 'System Admin',
        status: (u.status as UserStatus) ?? (['Active','Locked','Inactive'][i % 3] as UserStatus),
      }))
      setUsers(mapped)
    }
    if (localStorage.getItem('nu_success')) {
      setSuccessMsg('User has been created successfully')
      localStorage.removeItem('nu_success')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    if (localStorage.getItem('eu_success')) {
      setSuccessMsg('User details have been updated successfully')
      localStorage.removeItem('eu_success')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }, [])

  useEffect(() => {
    if (openMenu === null) return
    const handler = () => setOpenMenu(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openMenu])

  // reset page when tab / search / pageSize changes
  useEffect(() => { setPage(1) }, [activeTab, search, pageSize])

  // ── Existing users data ──
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.plant.toLowerCase().includes(q) ||
      u.group.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.status.toLowerCase().includes(q)
    )
  })
  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const userSafePage   = Math.min(page, userTotalPages)
  const paginatedUsers = filteredUsers.slice((userSafePage - 1) * pageSize, userSafePage * pageSize)

  // ── Pending invites data ──
  const filteredPending = MOCK_PENDING.filter(u => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q) ||
      u.plant.toLowerCase().includes(q) ||
      u.group.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  })
  const pendingTotalPages = Math.max(1, Math.ceil(filteredPending.length / pageSize))
  const pendingSafePage   = Math.min(page, pendingTotalPages)
  const paginatedPending  = filteredPending.slice((pendingSafePage - 1) * pageSize, pendingSafePage * pageSize)

  const totalPages = activeTab === 'existing' ? userTotalPages : pendingTotalPages
  const safePage   = activeTab === 'existing' ? userSafePage   : pendingSafePage

  function pageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return (
    <div className="ul-page">

      {successMsg && <div className="ul-toast">{successMsg}</div>}

      {/* ── Header bar (stretches edge-to-edge) ── */}
      <div className="ul-topbar">
        <div className="ul-topbar-right">
          <span className="ul-online-dot" />
          <button className="ul-all-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            All ▾
          </button>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="ul-card">

        {/* ── Toolbar ── */}
        <div className="ul-toolbar">
          <div className="ul-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="ul-search"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="ul-toolbar-right">
            <div className="ul-tabs">
              <button
                className={`ul-tab ${activeTab === 'existing' ? 'ul-tab--active' : ''}`}
                onClick={() => setActiveTab('existing')}
              >
                Existing Users <span className="ul-tab-count">{users.length}</span>
              </button>
              <button
                className={`ul-tab ${activeTab === 'pending' ? 'ul-tab--active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Invites <span className="ul-tab-count">{MOCK_PENDING.length}</span>
              </button>
            </div>
            <button className="ul-icon-btn" title="Filter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
            </button>
            <button className="ul-icon-btn" title="View">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button className="ul-new-btn" onClick={() => navigate('/userslist/new')}>
              + New User
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="ul-table-wrap">
          <table className="ul-table">
            <thead>
              <tr>
                <th>S NO</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Plant</th>
                <th>Group</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'existing' ? (
                paginatedUsers.length === 0
                  ? <tr><td colSpan={8} className="ul-empty">No users found</td></tr>
                  : paginatedUsers.map((u, i) => {
                      const globalIdx = (userSafePage - 1) * pageSize + i
                      return (
                        <tr key={u.id}>
                          <td>{globalIdx + 1}</td>
                          <td className="ul-userid">{u.userId}</td>
                          <td>{u.name}</td>
                          <td>{u.plant}</td>
                          <td>{u.group}</td>
                          <td><span className="ul-role-badge">{u.role}</span></td>
                          <td>
                            <span className={`ul-status ul-status--${u.status.toLowerCase()}`}>
                              <span className="ul-status-pip" />{u.status}
                            </span>
                          </td>
                          <td>
                            <div className="ul-menu-wrap">
                              <button
                                className="ul-dots-btn"
                                onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === globalIdx ? null : globalIdx) }}
                              >⋮</button>
                              {openMenu === globalIdx && (
                                <div className="ul-dropdown">
                                  <button onClick={() => { setOpenMenu(null); navigate(`/userslist/edit/${u.id}`) }}>Edit</button>
                                  <button className="ul-dropdown--danger">Delete</button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
              ) : (
                paginatedPending.length === 0
                  ? <tr><td colSpan={8} className="ul-empty">No pending invites</td></tr>
                  : paginatedPending.map((u, i) => {
                      const globalIdx = (pendingSafePage - 1) * pageSize + i
                      return (
                        <tr key={u.id}>
                          <td>{globalIdx + 1}</td>
                          <td className="ul-userid">{u.userId}</td>
                          <td>{u.name}</td>
                          <td>{u.plant}</td>
                          <td>{u.group}</td>
                          <td><span className="ul-role-badge">{u.role}</span></td>
                          <td>
                            <span className="ul-status ul-status--pending">
                              <span className="ul-status-pip" />Pending
                            </span>
                          </td>
                          <td>
                            <button className="ul-eye-btn" title="View">
                              <EyeIcon />
                            </button>
                          </td>
                        </tr>
                      )
                    })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="ul-pagination">
          <button className="ul-pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>
            ← Previous
          </button>

          <div className="ul-pg-nums">
            {pageNumbers().map((p, idx) =>
              p === '...'
                ? <span key={`el-${idx}`} className="ul-ellipsis">...</span>
                : <button
                    key={p}
                    className={`ul-pg-num ${safePage === p ? 'ul-pg-num--active' : ''}`}
                    onClick={() => setPage(p as number)}
                  >{p}</button>
            )}
          </div>

          <button className="ul-pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
            Next →
          </button>

          <div className="ul-page-size">
            <span className="ul-page-size-label">Rows per page</span>
            <select
              className="ul-page-size-select"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 15, 20, 25].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  )
}
