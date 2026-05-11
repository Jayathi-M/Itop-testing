import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// ── Eagerly loaded (tiny, always needed on first paint) ──────────────────────
import Login      from '../pages/Login/Login'
import Mainlayout from '../layouts/Mainlayout'

// ── Lazy: core pages ─────────────────────────────────────────────────────────
const Placeholderpage   = lazy(() => import('../pages/Placeholder/Placeholderpage'))
const DashboardPage     = lazy(() => import('../pages/Dashboard/SystemDashboardPage'))
const UserManagement    = lazy(() => import('../pages/UserManagement/UserManagement'))
const Workflow          = lazy(() => import('../pages/Workflow/WorkflowLayout'))
const Reports           = lazy(() => import('../pages/Reports/Reports'))
const UsersList         = lazy(() => import('../pages/UsersList/UsersList'))
const Role              = lazy(() => import('../pages/Role/Role'))
const NewUser           = lazy(() => import('../pages/UsersList/NewUser/NewUser'))
const EditUser          = lazy(() => import('../pages/UsersList/EditUser/EditUser'))

// ── Lazy: audit module ────────────────────────────────────────────────────────
const AuditQueue          = lazy(() => import('../pages/Workflow/Queue'))
const RecordReviewList    = lazy(() => import('../pages/Workflow/Review'))
const RecordReviewDetails = lazy(() => import('../pages/Workflow/ReviewDetails'))
const Report              = lazy(() => import('../pages/Workflow/Report'))
const AgentLogs           = lazy(() => import('../pages/Workflow/AgentLogs'))
const WorkflowAuditTrail  = lazy(() => import('../pages/Workflow/AuditTrail'))

// ── Lazy: masters ─────────────────────────────────────────────────────────────
const MastersPage  = lazy(() => import('../pages/Masters/MastersPage'))
const TableMaster  = lazy(() => import('../pages/Masters/Table_masters/TableMaster'))
const AddField     = lazy(() => import('../pages/Masters/Table_masters/AddField'))
const MasterList   = lazy(() => import('../pages/Masters/MasterList/MasterList'))

// ── Lazy: configurations ──────────────────────────────────────────────────────
const Systemconfiguration = lazy(() => import('../pages/Configurations/Systemconfig/Systemconfiguration'))
const Empower             = lazy(() => import('../pages/Configurations/Empower/Empower'))
const Dashboardconfig     = lazy(() => import('../pages/Configurations/Dashboardconfig/Dashboardconfig'))
const Reportconfig        = lazy(() => import('../pages/Configurations/Reportsconfig/Reportconfig'))
const Templateconfig      = lazy(() => import('../pages/Configurations/Templateconfig/Templateconfig'))
const Workflowconfig      = lazy(() => import('../pages/Configurations/Workflowconfig/Workflowconfig'))
const Businessruleconfig  = lazy(() => import('../pages/Configurations/Businessrulesconfig/Businessruleconfig'))

// ── Fallback shown while a chunk is being fetched ────────────────────────────
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <span>Loading…</span>
    </div>
  )
}

export default function Approuter() {
  return (
    <Suspense fallback={<PageLoader />}>
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

          {/* Audit module */}
          <Route path="/audit/queue"             element={<AuditQueue />} />
          <Route path="/audit/record-review"     element={<RecordReviewList />} />
          <Route path="/audit/record-review/:id" element={<RecordReviewDetails />} />
          <Route path="/audit/report"            element={<Report />} />
          <Route path="/audit/agent-logs"        element={<AgentLogs />} />
          <Route path="/audit/audit-trail"       element={<WorkflowAuditTrail />} />

          {/* Configurations */}
          <Route path="/configurations/system"         element={<Systemconfiguration />} />
          <Route path="/configurations/system/empower" element={<Empower />} />
          <Route path="/configurations/dashboards" element={<Dashboardconfig />} />
          <Route path="/configurations/reports"    element={<Reportconfig />} />
          <Route path="/configurations/templates"  element={<Templateconfig />} />
          <Route path="/configurations/workflow"   element={<Workflowconfig />} />
          <Route path="/configurations/rules"      element={<Businessruleconfig />} />

          {/* Masters */}
          <Route path="/masters"                          element={<MastersPage />} />
          <Route path="/masters/table/plant"              element={<MasterList />} />
          <Route path="/masters/table/employee"           element={<TableMaster />} />
          <Route path="/masters/table/employee/add-field" element={<AddField />} />
          <Route path="/masters/table/role"               element={<Placeholderpage title="Groups" />} />
          <Route path="/masters/table/report-template"    element={<Placeholderpage title="Dashboard Builder" />} />
          <Route path="/masters/table/workflow"           element={<Placeholderpage title="Report Builder" />} />
          <Route path="/masters/table/dashboard"          element={<Placeholderpage title="Dashboard" />} />
          <Route path="/masters/table/service"            element={<Placeholderpage title="Service" />} />

          {/* Users */}
          <Route path="/userslist/new"      element={<NewUser />} />
          <Route path="/userslist/edit/:id" element={<EditUser />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>

      </Routes>
    </Suspense>
  )
}