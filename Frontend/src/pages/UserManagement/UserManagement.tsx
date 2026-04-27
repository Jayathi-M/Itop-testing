import { useState } from 'react'
import './UserManagement.css'

interface User {
  id: number
  name: string
  role: string
  email: string
  dept: string
  status: string
  lastLogin: string
  mfa: boolean
  esig: boolean
}

interface Role {
  name: string
  permissions: string[]
}

interface Policy {
  name: string
  value: string
  editable: boolean
}

interface Session {
  user: string
  ip: string
  login: string
  lastActive: string
  browser: string
}

interface AddUserForm {
  firstName: string
  lastName: string
  email: string
  employeeId: string
  role: string
  dept: string
  mfa: string
  esig: string
  reason: string
}

const USERS: User[] = [
  { id: 1, name: 'Dr. Ananya Sharma', role: 'System Admin', email: 'a.sharma@xcept.io', dept: 'IT',  status: 'active',   lastLogin: '2024-01-15 09:22', mfa: true,  esig: true  },
  { id: 2, name: 'Rajesh Kumar',       role: 'Reviewer',     email: 'r.kumar@xcept.io',  dept: 'QA',  status: 'active',   lastLogin: '2024-01-15 10:45', mfa: true,  esig: true  },
  { id: 3, name: 'Priya Nair',         role: 'Analyst',      email: 'p.nair@xcept.io',   dept: 'Lab', status: 'active',   lastLogin: '2024-01-14 16:30', mfa: false, esig: true  },
  { id: 4, name: 'Sanjay Mehta',       role: 'Manager',      email: 's.mehta@xcept.io',  dept: 'QC',  status: 'inactive', lastLogin: '2024-01-10 12:00', mfa: true,  esig: false },
  { id: 5, name: 'Divya Reddy',        role: 'Operator',     email: 'd.reddy@xcept.io',  dept: 'Mfg', status: 'active',   lastLogin: '2024-01-15 08:00', mfa: false, esig: true  },
]

const ROLES: Role[] = [
  { name: 'System Admin', permissions: ['Read', 'Write', 'Delete', 'Config', 'Reports', 'Users', 'Audit'] },
  { name: 'Reviewer',     permissions: ['Read', 'Write', 'Reports', 'Approve']                            },
  { name: 'Analyst',      permissions: ['Read', 'Write', 'Reports']                                       },
  { name: 'Manager',      permissions: ['Read', 'Approve', 'Reports']                                     },
  { name: 'Operator',     permissions: ['Read', 'Acknowledge']                                             },
  { name: 'Auditor',      permissions: ['Read', 'Audit']                                                   },
]

const POLICIES: Policy[] = [
  { name: 'Password Min Length',  value: '12 characters',         editable: true  },
  { name: 'Password Expiry',      value: '90 days',               editable: true  },
  { name: 'Max Failed Attempts',  value: '5 then lock account',   editable: true  },
  { name: 'Session Timeout',      value: '15 minutes',            editable: true  },
  { name: 'Multi-Factor Auth',    value: 'Enforced for all',      editable: false },
  { name: 'Electronic Signature', value: 'Required for approvals',editable: false },
  { name: 'Audit Trail',          value: 'Always on, read-only',  editable: false },
  { name: 'Password History',     value: 'Last 10 passwords',     editable: true  },
]

const SESSIONS: Session[] = [
  { user: 'Dr. Ananya Sharma', ip: '10.1.2.3', login: '09:22:33', lastActive: '09:45:10', browser: 'Chrome 120' },
  { user: 'Rajesh Kumar',       ip: '10.1.2.5', login: '10:40:00', lastActive: '10:45:22', browser: 'Firefox 121'},
  { user: 'Priya Nair',         ip: '10.1.2.8', login: '08:00:00', lastActive: '09:30:00', browser: 'Edge 119'   },
]

const ROLE_OPTIONS = ['Analyst', 'Reviewer', 'Manager', 'System Admin', 'Operator', 'Auditor']
const DEPT_OPTIONS = ['QA', 'Lab', 'Manufacturing', 'IT', 'QC']

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function YesNoBadge({ value }: { value: boolean }) {
  return (
    <span className={'badge ' + (value ? 'badge--green' : 'badge--red')}>
      {value ? 'Yes' : 'No'}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={'badge ' + (status === 'active' ? 'badge--green' : 'badge--red')}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={{ color }}>{value}</div>
    </div>
  )
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button
          key={t}
          className={'tab-btn ' + (active === t ? 'tab-btn--active' : '')}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function AddUserModal({ onClose, onAdd }: { onClose: () => void; onAdd: (form: AddUserForm) => void }) {
  const [form, setForm] = useState<AddUserForm>({
    firstName: '', lastName: '', email: '', employeeId: '',
    role: 'Analyst', dept: 'QA', mfa: 'Yes', esig: 'Yes', reason: '',
  })

  function set(field: keyof AddUserForm, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleSubmit() {
    if (!form.firstName || !form.lastName || !form.email) return
    onAdd(form)
    onClose()
  }

  function onBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="modal">
        <div className="modal__header">
          <div className="modal__title">Add New User</div>
          <button className="modal__close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="modal__body">
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">First Name</label>
              <input className="field-input" placeholder="First name" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Last Name</label>
              <input className="field-input" placeholder="Last name" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Email Address</label>
              <input className="field-input" type="email" placeholder="user@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Employee ID</label>
              <input className="field-input" placeholder="EMP-0001" value={form.employeeId} onChange={e => set('employeeId', e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Role</label>
              <select className="field-select" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Department</label>
              <select className="field-select" value={form.dept} onChange={e => set('dept', e.target.value)}>
                {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Require Two-Factor Login (MFA)</label>
              <select className="field-select" value={form.mfa} onChange={e => set('mfa', e.target.value)}>
                <option>Yes</option><option>No</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Require Electronic Signature</label>
              <select className="field-select" value={form.esig} onChange={e => set('esig', e.target.value)}>
                <option>Yes</option><option>No</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">Reason for adding this user</label>
            <textarea className="field-textarea" rows={2} placeholder="Write a short business reason..." value={form.reason} onChange={e => set('reason', e.target.value)} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className={'btn btn--primary ' + (!form.firstName || !form.email ? 'btn--disabled' : '')}
            onClick={handleSubmit}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  )
}

function UsersTab({ search }: { search: string }) {
  const [users,      setUsers]      = useState<User[]>(USERS)
  const [showModal,  setShowModal]  = useState(false)
  const [roleFilter, setRoleFilter] = useState('All')

  const roles = ['All', ...new Set(USERS.map(u => u.role))]

  const visible = users.filter(u => {
    const matchSearch = search
      ? u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
      : true
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function handleAddUser(form: AddUserForm) {
    const newUser: User = {
      id:        users.length + 1,
      name:      form.firstName + ' ' + form.lastName,
      role:      form.role,
      email:     form.email,
      dept:      form.dept,
      status:    'active',
      lastLogin: 'Never',
      mfa:       form.mfa === 'Yes',
      esig:      form.esig === 'Yes',
    }
    setUsers(prev => [...prev, newUser])
  }

  return (
    <div>
      <div className="notice notice--blue">
        &#128737; Every user action is recorded in the audit trail as required by 21 CFR Part 11.
      </div>
      <div className="um-card">
        <div className="users-toolbar">
          <div className="filter-pills">
            {roles.map(r => (
              <button
                key={r}
                className={'filter-pill ' + (roleFilter === r ? 'filter-pill--active' : '')}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
            <span className="filter-count">{visible.length} users</span>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => setShowModal(true)}>
            + Add User
          </button>
        </div>
        <div className="table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Department</th><th>Email</th>
                <th>Status</th><th>MFA</th><th>E-Signature</th><th>Last Login</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={9} className="no-results">No users match your search</td></tr>
              ) : (
                visible.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="avatar">{initials(u.name)}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td><span className="tag">{u.role}</span></td>
                    <td className="muted small">{u.dept}</td>
                    <td className="mono small">{u.email}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td><YesNoBadge value={u.mfa} /></td>
                    <td><YesNoBadge value={u.esig} /></td>
                    <td className="mono muted small">{u.lastLogin}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn--secondary btn--sm">Edit</button>
                        <button className="btn btn--danger btn--sm">Lock</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  )
}

function RolesTab() {
  return (
    <div className="um-card">
      <div className="roles-header">
        <span className="section-title">Roles and What They Can Do</span>
        <button className="btn btn--primary btn--sm">+ New Role</button>
      </div>
      <div className="roles-grid">
        {ROLES.map(r => (
          <div key={r.name} className="role-card">
            <div className="role-card__name">{r.name}</div>
            <div className="role-card__perms">
              {r.permissions.map(p => (
                <span key={p} className="perm-tag">{p}</span>
              ))}
            </div>
            <button className="btn btn--secondary btn--sm" style={{ marginTop: 12 }}>Edit Role</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="um-card">
      <div className="section-title" style={{ marginBottom: 16 }}>
        Security Settings (21 CFR Part 11 Rules)
      </div>
      <div className="policies-grid">
        {POLICIES.map(p => (
          <div key={p.name} className="policy-row">
            <div className="policy-row__info">
              <div className="policy-row__name">{p.name}</div>
              <div className="policy-row__value">{p.value}</div>
            </div>
            {p.editable
              ? <button className="btn btn--secondary btn--sm">Edit</button>
              : <span className="badge badge--green">Locked</span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS)

  function revokeOne(index: number) {
    setSessions(prev => prev.filter((_, i) => i !== index))
  }

  function revokeAll() {
    setSessions([])
  }

  return (
    <div className="um-card">
      <div className="sessions-header">
        <span className="section-title">Who Is Logged In Right Now</span>
        {sessions.length > 0 && (
          <button className="btn btn--danger btn--sm" onClick={revokeAll}>
            Log Everyone Out
          </button>
        )}
      </div>
      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">&#128274;</div>
          <div className="empty-state__text">No active sessions</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th><th>IP Address</th><th>Logged In At</th>
                <th>Last Active</th><th>Browser</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{s.user}</td>
                  <td className="mono small">{s.ip}</td>
                  <td className="mono small">{s.login}</td>
                  <td className="mono small">{s.lastActive}</td>
                  <td className="small muted">{s.browser}</td>
                  <td>
                    <button className="btn btn--danger btn--sm" onClick={() => revokeOne(i)}>
                      Log Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('Users')
  const [search,    setSearch]    = useState('')

  const activeCount   = USERS.filter(u => u.status === 'active').length
  const inactiveCount = USERS.filter(u => u.status === 'inactive').length
  const mfaCount      = USERS.filter(u => u.mfa).length

  const TABS = ['Users', 'Roles', 'Security Settings', 'Active Sessions']

  return (
    <div className="um-page">
      <div className="um-page__header">
        <div>
          <h1 className="um-page__title">User Management</h1>
          <p className="um-page__subtitle">Control who has access and what they can do</p>
        </div>
        <div className="um-search">
          <span className="um-search__icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="um-search__input"
          />
        </div>
      </div>

      <div className="um-page__stats">
        <StatCard label="Total Users" value={USERS.length}  color="var(--accent2)" icon="&#128101;" />
        <StatCard label="Active"      value={activeCount}   color="var(--success)" icon="&#9989;"   />
        <StatCard label="Inactive"    value={inactiveCount} color="var(--danger)"  icon="&#128683;" />
        <StatCard label="MFA Enabled" value={mfaCount}      color="var(--warn)"    icon="&#128272;" />
      </div>

      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Users'             && <UsersTab    search={search} />}
      {activeTab === 'Roles'             && <RolesTab    />}
      {activeTab === 'Security Settings' && <SecurityTab />}
      {activeTab === 'Active Sessions'   && <SessionsTab />}
    </div>
  )
}
