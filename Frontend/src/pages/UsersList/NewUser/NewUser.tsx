import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewUser.css'

export default function NewUser() {
  const navigate = useNavigate()

  const locations = ['Mumbai', 'Hyderabad', 'Pune']
  const plants = ['Plant A', 'Plant B', 'Plant C', 'Plant D']

  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const handleCreateUser = () => {
    const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value
    const email = (document.getElementById('email') as HTMLInputElement)?.value

    if (!firstName || !email) {
      alert('Please fill required fields')
      return
    }

    const newUser = {
      id: Date.now(),
      name: firstName,
      email: email,
      groups: selected
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))

    localStorage.setItem('nu_success', '1')  // ← success flag
    navigate('/userslist')
  }

  const toggleLocation = (loc: string) => {
    setSelected(prev => ({
      ...prev,
      [loc]: (prev[loc] || []).length === plants.length ? [] : [...plants]
    }))
  }

  const togglePlant = (loc: string, plant: string) => {
    setSelected(prev => {
      const current = prev[loc] || []
      return {
        ...prev,
        [loc]: current.includes(plant)
          ? current.filter(p => p !== plant)
          : [...current, plant]
      }
    })
  }

  const toggleOpen = (loc: string) => {
    setOpen(prev => ({ ...prev, [loc]: !prev[loc] }))
  }

  return (
    <div className="nu-container">

      {/* Header */}
      <div className="nu-header">
        <h2>Add New User</h2>
      </div>

      {/* Type */}
      <div className="nu-card">
        <div className="nu-title">
          <h3>Type of creation</h3>
        </div>
        <label>Creation *</label>
        <select>
          <option>Active Directory</option>
          <option>Local</option>
        </select>
      </div>

      {/* User Info */}
      <div className="nu-card">
        <div className="nu-title">
          <h3>User Information</h3>
        </div>
        <div className="nu-grid">
          <div>
            <label>First Name *</label>
            <input id="firstName" placeholder="e.g. Emily" />
          </div>
          <div>
            <label>Middle Name</label>
            <input placeholder="e.g. Emily" />
          </div>
          <div>
            <label>Last Name *</label>
            <input placeholder="e.g. Emily" />
          </div>
          <div>
            <label>Gender *</label>
            <select>
              <option>Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="full-width">
            <label>Work Email *</label>
            <input id="email" placeholder="e.g. name@gmail.com" />
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="nu-card">
        <div className="nu-title">
          <h3>Organization Details</h3>
        </div>
        <div className="nu-grid">
          <div>
            <label>Language *</label>
            <select><option>Select language</option></select>
          </div>
          <div>
            <label>Department *</label>
            <select><option>Select department</option></select>
          </div>
          <div>
            <label>Time Zone *</label>
            <select><option>Select timezone</option></select>
          </div>
          <div>
            <label>Organization *</label>
            <select><option>Select organization</option></select>
          </div>
          <div>
            <label>Company *</label>
            <select><option>Select company</option></select>
          </div>
          <div>
            <label>Plant *</label>
            <select><option>Select plant</option></select>
          </div>
        </div>
      </div>

      {/* Access */}
      <div className="nu-card">
        <div className="nu-title">
          <h3>Access & Permissions</h3>
        </div>

        <div className="nu-grid">
          <div>
            <label>Modules *</label>
            <select><option>Select company</option></select>
          </div>
          <div>
            <label>Roles *</label>
            <select><option>Select pages</option></select>
          </div>
        </div>

        {/* GROUP HIERARCHY */}
        <div className="nu-group">
          <label className="nu-parent-title">Group *</label>

          <div className="nu-hierarchy">
            {locations.map(loc => (
              <div key={loc} className="nu-location">

                <div className="nu-location-row">
                  <label className="nu-cb-label" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={(selected[loc] || []).length === plants.length}
                      onChange={() => toggleLocation(loc)}
                    />
                    <span className="nu-cb-box">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </label>
                  <span className="nu-location-name" onClick={() => toggleOpen(loc)}>
                    {loc}
                  </span>
                  <span className="nu-arrow" onClick={() => toggleOpen(loc)}>
                    {open[loc] ? '▾' : '▸'}
                  </span>
                </div>

                {open[loc] && (
                  <div className="nu-plant-list">
                    {plants.map(plant => (
                      <label key={plant} className="nu-plant-item">
                        <input
                          type="checkbox"
                          checked={(selected[loc] || []).includes(plant)}
                          onChange={() => togglePlant(loc, plant)}
                        />
                        <span className="nu-cb-box">
                          <svg viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span>{plant}</span>
                      </label>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>  {/* closes nu-group */}
      </div>    {/* closes nu-card */}

      {/* Buttons */}
      <div className="nu-actions">
        <button className="cancel" onClick={() => navigate('/userslist')}>
          Cancel
        </button>
        <button className="save" onClick={handleCreateUser}>
          Create User
        </button>
      </div>

    </div>  // closes nu-container
  )
}