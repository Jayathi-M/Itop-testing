import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewUser.css'

const PLANTS = ['Plant A', 'Plant B', 'Plant C', 'Plant D']

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h1m5 0h1M9 13h1m5 0h1M9 17h1m5 0h1" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

interface SectionHeaderProps {
  title: string
  isOpen: boolean
  onToggle: () => void
}

function SectionHeader({ title, isOpen, onToggle }: SectionHeaderProps) {
  return (
    <div className={`nu-section-head ${isOpen ? 'nu-section-head--open' : ''}`} onClick={onToggle}>
      <span className="nu-section-title">{title}</span>
      <span className={`nu-section-chevron ${isOpen ? 'nu-section-chevron--open' : ''}`}>
        <ChevronDownIcon />
      </span>
    </div>
  )
}

export default function NewUser() {
  const navigate = useNavigate()

  const [openSections, setOpenSections] = useState({
    creation: true,
    userInfo: true,
    orgDetails: true,
    access: true,
    group: true,
  })

  const [checkedPlants, setCheckedPlants] = useState<string[]>([])

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePlant = (plant: string) => {
    setCheckedPlants(prev =>
      prev.includes(plant) ? prev.filter(p => p !== plant) : [...prev, plant]
    )
  }

  const handleCreateUser = () => {
    const firstName = (document.getElementById('nu-firstName') as HTMLInputElement)?.value
    const email = (document.getElementById('nu-email') as HTMLInputElement)?.value

    if (!firstName || !email) {
      alert('Please fill required fields')
      return
    }

    const newUser = {
      id: Date.now(),
      name: firstName,
      email,
      plant: checkedPlants.join(', '),
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))
    localStorage.setItem('nu_success', '1')
    navigate('/userslist')
  }

  return (
    <div className="nu-page">
      <div className="nu-card">

        {/* ── Sticky header ── */}
        <div className="nu-header">
          <div className="nu-header-text">
            <h2 className="nu-header-title">Add New User</h2>
            <p className="nu-header-sub">Create a new user account with required details</p>
          </div>
          <button className="nu-close-btn" onClick={() => navigate('/userslist')} title="Close">
            <XIcon />
          </button>
        </div>

        {/* ── Form content ── */}
        <div className="nu-body">
          <div className="nu-inner-card">

            {/* ── Type of creation ── */}
            <SectionHeader title="Type of creation" isOpen={openSections.creation} onToggle={() => toggleSection('creation')} />
            {openSections.creation && (
              <div className="nu-section-body">
                <div className="nu-field-full">
                  <label className="nu-label">Creation *</label>
                  <div className="nu-select-wrap">
                    <select className="nu-select">
                      <option value="">Active Directory</option>
                      <option value="local">Local</option>
                    </select>
                    <span className="nu-select-icon"><ChevronDownIcon /></span>
                  </div>
                </div>
                <div className="nu-field-full">
                  <label className="nu-label">Employee ID *</label>
                  <div className="nu-select-wrap">
                    <select className="nu-select">
                      <option value="">Employee ID</option>
                    </select>
                    <span className="nu-select-icon"><ChevronDownIcon /></span>
                  </div>
                </div>
              </div>
            )}

            {/* ── User Information ── */}
            <SectionHeader title="User Information" isOpen={openSections.userInfo} onToggle={() => toggleSection('userInfo')} />
            {openSections.userInfo && (
              <div className="nu-section-body">
                <div className="nu-row nu-row--3">
                  <div className="nu-field">
                    <label className="nu-label">First Name *</label>
                    <input id="nu-firstName" className="nu-input" placeholder="e.g. Emily" />
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Middle Name *</label>
                    <input className="nu-input" placeholder="e.g. Emily" />
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Last Name *</label>
                    <input className="nu-input" placeholder="e.g. Emily" />
                  </div>
                </div>
                <div className="nu-row nu-row--2">
                  <div className="nu-field">
                    <label className="nu-label">Gender *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Work Email*</label>
                    <input id="nu-email" className="nu-input" placeholder="e.g.name@gmail.com" type="email" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Organization Details ── */}
            <SectionHeader title="Organization Details" isOpen={openSections.orgDetails} onToggle={() => toggleSection('orgDetails')} />
            {openSections.orgDetails && (
              <div className="nu-section-body">
                <div className="nu-row nu-row--2">
                  <div className="nu-field">
                    <label className="nu-label">Language *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select langugage</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Department *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select department</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                </div>
                <div className="nu-row nu-row--2">
                  <div className="nu-field">
                    <label className="nu-label">Time Zone *</label>
                    <div className="nu-select-wrap nu-select-wrap--icon">
                      <span className="nu-input-prefix-icon"><ClockIcon /></span>
                      <select className="nu-select nu-select--has-prefix"><option value="">Select a timezone</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Organization *</label>
                    <div className="nu-select-wrap nu-select-wrap--icon">
                      <span className="nu-input-prefix-icon"><BuildingIcon /></span>
                      <select className="nu-select nu-select--has-prefix"><option value="">Select organization</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                </div>
                <div className="nu-row nu-row--2">
                  <div className="nu-field">
                    <label className="nu-label">Company *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select company</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Plant *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select plant</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Access & Permissions ── */}
            <SectionHeader title="Access & Permissions" isOpen={openSections.access} onToggle={() => toggleSection('access')} />
            {openSections.access && (
              <div className="nu-section-body">
                <div className="nu-row nu-row--2">
                  <div className="nu-field">
                    <label className="nu-label">Roles *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select plant</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                  <div className="nu-field">
                    <label className="nu-label">Modules *</label>
                    <div className="nu-select-wrap">
                      <select className="nu-select"><option value="">Select company</option></select>
                      <span className="nu-select-icon"><ChevronDownIcon /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Group ── */}
            <SectionHeader title="Group *" isOpen={openSections.group} onToggle={() => toggleSection('group')} />
            {openSections.group && (
              <div className="nu-group-list">
                {PLANTS.map(plant => (
                  <label key={plant} className="nu-check-row">
                    <span className={`nu-checkbox ${checkedPlants.includes(plant) ? 'nu-checkbox--checked' : ''}`}>
                      {checkedPlants.includes(plant) && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input type="checkbox" className="nu-check-input" checked={checkedPlants.includes(plant)} onChange={() => togglePlant(plant)} />
                    <span className="nu-check-label">{plant}</span>
                  </label>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ── Actions ── */}
        <div className="nu-actions">
          <button className="nu-btn-cancel" onClick={() => navigate('/userslist')}>Cancel</button>
          <button className="nu-btn-save" onClick={handleCreateUser}>Create User</button>
        </div>

      </div>
    </div>
  )
}
