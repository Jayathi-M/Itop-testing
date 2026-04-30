import './UsersList.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function UsersList() {
  const navigate = useNavigate()

  const [users, setUsers] = useState<any[]>([])
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(storedUsers)

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

  return (
    <div className="users-container">

      {successMsg && (
        <div className="success-toast">{successMsg}</div>
      )}

      {/* Top Bar */}
      <div className="users-topbar">
        <input className="search" placeholder="Search" />

        <div className="actions">
          <button className="icon-btn">≡</button>
          <button className="icon-btn">☰</button>
          <button
            className="new-btn"
            onClick={() => navigate('/userslist/new')}
          >
            + New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S NO</th>
              <th>Name</th>
              <th>Email</th>
              <th>Plant</th>
              <th>Group</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={u.id || i}>
                <td>{i + 1}</td>

                <td className="name-cell">
                  <div className="avatar">
                    {u.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="name">{u.name}</div>
                    <div className="email">{u.email}</div>
                  </div>
                </td>

                <td>{u.email}</td>

                <td>
                  {u.groups
                    ? Object.values(u.groups as Record<string, string[]>).flat().join(', ')
                    : '-'}
                </td>

                <td>
                  {u.groups
                    ? Object.keys(u.groups as Record<string, string[]>).join(', ')
                    : '-'}
                </td>

                <td>
                  <span className="badge role">System Admin</span>
                </td>

                <td>
                  <span className="badge active">● Active</span>
                </td>

                <td>
                  <button
                    className="edit-icon-btn"
                    onClick={() => navigate(`/userslist/edit/${u.id || i}`)}
                    title="Edit user"
                  >
                    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                      <path d="M14.85 2.85a2.121 2.121 0 0 1 3 3L6.5 17.2l-4 1 1-4 11.35-11.35z"
                        stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}