import { Routes, Route, Navigate } from 'react-router-dom'
import Mainlayout      from '../layouts/Mainlayout'
import Placeholderpage from '../pages/Placeholder/Placeholderpage'
import Login           from '../pages/Login/Login'

import DashboardPage   from '../pages/Dashboard/SystemDashboardPage'
import UserManagement  from '../pages/UserManagement/UserManagement'
import Workflow        from '../pages/Workflow/WorkflowLayout'
import Reports         from '../pages/Reports/Reports'
import UsersList       from '../pages/UsersList/UsersList'
import Role            from '../pages/Role/Role'

import AuditQueue         from '../pages/Workflow/Queue'
import RecordReviewList   from '../pages/Workflow/Review'
import RecordReviewDetails from '../pages/Workflow/ReviewDetails'
import Report             from '../pages/Workflow/Report'
import AgentLogs          from '../pages/Workflow/AgentLogs'
import WorkflowAuditTrail from '../pages/Workflow/AuditTrail'

import Systemconfiguration from '../pages/Configurations/Systemconfig/Systemconfiguration'
import Empower             from '../pages/Configurations/Empower/Empower'
import NewUser             from '../pages/UsersList/NewUser/NewUser'
import EditUser            from '../pages/UsersList/EditUser/EditUser'

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
        <Route path="/userslist"  element={<UsersList />} />
        <Route path="/role"       element={<Role />} />

        {/* Audit module routes */}
        <Route path="/audit/queue"                element={<AuditQueue />} />
        <Route path="/audit/record-review"        element={<RecordReviewList />} />
        <Route path="/audit/record-review/:id"    element={<RecordReviewDetails />} />
        <Route path="/audit/report"               element={<Report />} />
        <Route path="/audit/agent-logs"           element={<AgentLogs />} />
        <Route path="/audit/audit-trail"          element={<WorkflowAuditTrail />} />

        <Route path="/configurations/system"         element={<Systemconfiguration />} />
        <Route path="/configurations/system/empower" element={<Empower />} />
        <Route path="/configurations/dashboards"     element={<Placeholderpage title="Dashboard Config" />} />
        <Route path="/configurations/reports"        element={<Placeholderpage title="Reports Config" />} />
        <Route path="/configurations/templates"      element={<Placeholderpage title="Templates" />} />
        <Route path="/configurations/workflow"       element={<Placeholderpage title="Workflow Config" />} />
        <Route path="/configurations/rules"          element={<Placeholderpage title="Business Rules" />} />

        <Route path="/userslist/new"       element={<NewUser />} />
        <Route path="/userslist/edit/:id"  element={<EditUser />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>

    </Routes>
  )
}
