import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EditUser.css'

const locations = ['Mumbai', 'Hyderabad', 'Pune']
const plants = ['Plant A', 'Plant B', 'Plant C', 'Plant D']
const modules = ['CDS', 'LIMS', 'Platform', 'File Based Systems']

export default function EditUser() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '', gender: '',
    email: '', language: '', department: '', timezone: '',
    org: '', plant: '', roles: '',
  })
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users[Number(id)] ?? users.find((u: any) => String(u.id) === id)
    if (user) {
      setForm({
        firstName: user.name?.split(' ')[0] || '',
        middleName: user.middleName || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        gender: user.gender || '',
        email: user.email || '',
        language: user.language || '',
        department: user.department || '',
        timezone: user.timezone || '',
        org: user.org || '',
        plant: user.plant || '',
        roles: user.roles || '',
      })
      setSelected(user.groups || {})
    }
  }, [id])

  const set = (field: string, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  const toggleLocation = (loc: string) => {
    setSelected(prev => ({
      ...prev,
      [loc]: (prev[loc] || []).length === plants.length ? [] : [...plants],
    }))
  }

  const togglePlant = (loc: string, plant: string) => {
    setSelected(prev => {
      const cur = prev[loc] || []
      return {
        ...prev,
        [loc]: cur.includes(plant) ? cur.filter(p => p !== plant) : [...cur, plant],
      }
    })
  }

  const toggleModule = (mod: string) => {
    setSelectedModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    )
  }

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex((u: any, i: number) =>
      String(u.id) === id || String(i) === id
    )
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        gender: form.gender,
        language: form.language,
        department: form.department,
        timezone: form.timezone,
        org: form.org,
        plant: form.plant,
        roles: form.roles,
        groups: selected,
        modules: selectedModules,
      }
      localStorage.setItem('users', JSON.stringify(users))
    }
    localStorage.setItem('eu_success', '1')
    navigate('/userslist')
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="eu-field">
      <label className="eu-label">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="eu-page">
      <div className="eu-card">

        {/* Header */}
        <div className="eu-modal-header">
          <div>
            <h2 className="eu-modal-title">Add New User</h2>
            <p className="eu-modal-sub">Create a new user account with required details</p>
          </div>
          <button className="eu-close" onClick={() => navigate('/userslist')}>✕</button>
        </div>

        <div className="eu-modal-body">

          {/* Type of creation */}
          <div className="eu-section">
            <div className="eu-section-header" >
              <span>Type of creation</span>
              <span className="eu-chevron">▾</span>
            </div>
            <div className="eu-section-body">
              <Field label="Creation *">
                <select className="eu-select">
                  <option>Active Directory</option>
                  <option>Local</option>
                </select>
              </Field>
            </div>
          </div>

          {/* User Information */}
          <div className="eu-section">
            <div className="eu-section-header">
              <span>User Information</span>
              <span className="eu-chevron">▾</span>
            </div>
            <div className="eu-section-body">
              <div className="eu-grid">
                <Field label="First Name *">
                  <input className="eu-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. Emily" />
                </Field>
                <Field label="Middle Name *">
                  <input className="eu-input" value={form.middleName} onChange={e => set('middleName', e.target.value)} placeholder="e.g. Rose" />
                </Field>
                <Field label="Last Name *">
                  <input className="eu-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Smith" />
                </Field>
                <Field label="Gender *">
                  <select className="eu-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
                <div className="eu-full">
                  <Field label="Work Email *">
                    <input className="eu-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g.name@gmail.com" />
                  </Field>
                  <p className="eu-hint">Access credits will be send to this email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="eu-section">
            <div className="eu-section-header">
              <span>Organization Details</span>
              <span className="eu-chevron">▾</span>
            </div>
            <div className="eu-section-body">
              <div className="eu-grid">
                <Field label="Language *">
                  <select className="eu-select" value={form.language} onChange={e => set('language', e.target.value)}>
                    <option value="">Select language</option>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </Field>
                <Field label="Department *">
                  <select className="eu-select" value={form.department} onChange={e => set('department', e.target.value)}>
                    <option value="">Select department</option>
                    <option>QA</option><option>Lab</option><option>IT</option>
                  </select>
                </Field>
                <Field label="Time Zone *">
                  <select className="eu-select" value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                    <option value="">Select timezone</option>
                    <option>IST (UTC+5:30)</option>
                    <option>UTC</option>
                  </select>
                </Field>
                <Field label="Organization *">
                  <select className="eu-select" value={form.org} onChange={e => set('org', e.target.value)}>
                    <option value="">Select organization</option>
                    <option>Org A</option><option>Org B</option>
                  </select>
                </Field>
                <Field label="Plant *">
                  <select className="eu-select" value={form.plant} onChange={e => set('plant', e.target.value)}>
                    <option value="">Select plant</option>
                    {plants.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Access & Permissions */}
          <div className="eu-section">
            <div className="eu-section-header">
              <span>Access & Permissions</span>
              <span className="eu-chevron">▾</span>
            </div>
            <div className="eu-section-body">
              <div className="eu-grid">
                <Field label="Roles *">
                  <select className="eu-select" value={form.roles} onChange={e => set('roles', e.target.value)}>
                    <option value="">Select role</option>
                    <option>System Admin</option><option>QA Reviewer</option>
                    <option>Lab Analyst</option><option>Auditor</option>
                  </select>
                </Field>
              </div>

              {/* Modules multi-select */}
              <div className="eu-group-label">Module</div>
              <div className="eu-chips">
                {modules.map(mod => (
                  <button
                    key={mod}
                    type="button"
                    className={`eu-chip${selectedModules.includes(mod) ? ' eu-chip-active' : ''}`}
                    onClick={() => toggleModule(mod)}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              {/* Group hierarchy */}
              <div className="eu-group-label">Group *</div>
              <div className="eu-hierarchy">
                {locations.map(loc => (
                  <div key={loc} className="eu-location">
                    <div className="eu-location-row">
                      <label className="eu-cb-label">
                        <input type="checkbox"
                          checked={(selected[loc] || []).length === plants.length}
                          onChange={() => toggleLocation(loc)} />
                        <span className="eu-cb-box">
                          <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </label>
                      <span className="eu-loc-name" onClick={() => setOpen(p => ({ ...p, [loc]: !p[loc] }))}>{loc}</span>
                      <span className="eu-arrow" onClick={() => setOpen(p => ({ ...p, [loc]: !p[loc] }))}>{open[loc] ? '▾' : '▸'}</span>
                    </div>
                    {open[loc] && (
                      <div className="eu-plant-list">
                        {plants.map(plant => (
                          <label key={plant} className="eu-plant-item">
                            <input type="checkbox"
                              checked={(selected[loc] || []).includes(plant)}
                              onChange={() => togglePlant(loc, plant)} />
                            <span className="eu-cb-box">
                              <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            <span>{plant}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="eu-modal-footer">
          <button className="eu-cancel" onClick={() => navigate('/userslist')}>Cancel</button>
          <button className="eu-submit" onClick={handleSubmit}>Submit</button>
        </div>

      </div>
    </div>
  )
}