import { Routes, Route, Navigate } from 'react-router-dom'
import Mainlayout      from '../layouts/Mainlayout'
import Placeholderpage from '../pages/Placeholder/Placeholderpage'
import Login           from '../pages/Login/Login'

import DashboardPage   from '../pages/Dashboard/SystemDashboardPage'
import UserManagement  from '../pages/UserManagement/UserManagement'
import AuditTrail      from '../pages/AuditTrail/AuditTrail'
import Workflow        from '../pages/Workflow/Workflow'
import Reports         from '../pages/Reports/Reports'

import Systemconfiguration from '../pages/Configurations/Systemconfig/Systemconfiguration'
import Empower             from '../pages/Configurations/Empower/Empower'

export default function Approuter() {
  return (
    <Routes>

      <Route path="/"      element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Mainlayout />}>
        <Route path="/home"       element={<DashboardPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/dashboards" element={<UserManagement />} />
        <Route path="/workflow"   element={<Workflow />} />
        <Route path="/reports"    element={<Reports />} />
        <Route path="/users"      element={<UserManagement />} />
        <Route path="/audit"      element={<AuditTrail />} />

        <Route path="/configurations/system"         element={<Systemconfiguration />} />
        <Route path="/configurations/system/empower" element={<Empower />} />
        <Route path="/configurations/dashboards"     element={<Placeholderpage title="Dashboard Config" />} />
        <Route path="/configurations/reports"        element={<Placeholderpage title="Reports Config" />} />
        <Route path="/configurations/templates"      element={<Placeholderpage title="Templates" />} />
        <Route path="/configurations/workflow"       element={<Placeholderpage title="Workflow Config" />} />
        <Route path="/configurations/rules"          element={<Placeholderpage title="Business Rules" />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>

    </Routes>
  )
}
