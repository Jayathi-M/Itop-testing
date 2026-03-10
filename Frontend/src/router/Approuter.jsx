import { Routes, Route, Navigate } from 'react-router-dom';
import Mainlayout      from '../layouts/Mainlayout';
import Placeholderpage from '../pages/Placeholder/Placeholderpage';
import Login           from '../pages/Login/Login';

import DashboardPage   from '../pages/Dashboard/SystemDashboardPage';
import UserDashboard   from '../pages/User Dashboard/UserDashboard';
import UserManagement  from '../pages/UserManagement/UserManagement';
import AuditTrail      from '../pages/AuditTrail/AuditTrail';
import Workflow        from '../pages/Workflow/Workflow';
import Reports         from '../pages/Reports/Reports';

import Systemconfiguration from '../pages/Configurations/Systemconfiguration';
import Empower             from '../pages/Configurations/Empower';

/* ── If logged in and tries to visit / or /login → send to /home ── */
function PublicRoute({ children }) {
  const token = sessionStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : children;
}

/* ── If NOT logged in and tries to visit protected route → send to / ── */
function PrivateRoute({ children }) {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}

export default function Approuter() {
  return (
    <Routes>

      {/* ── Public: Login — if already logged in, skip to /home ── */}
      <Route path="/"      element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* ── Protected: all app pages inside MainLayout ── */}
      <Route
        element={
          <PrivateRoute>
            <Mainlayout />
          </PrivateRoute>
        }
      >
        <Route path="/home"       element={<UserDashboard />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/dashboards" element={<UserDashboard />} />
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
  );
}