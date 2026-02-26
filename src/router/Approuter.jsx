import { Routes, Route, Navigate } from 'react-router-dom';
import Mainlayout      from '../layouts/Mainlayout';
import Placeholderpage from '../pages/Placeholder/Placeholderpage';

import DashboardPage   from '../pages/Dashboard/SystemDashboardPage';
import UserDashboard   from '../pages/User Dashboard/UserDashboard';
import UserManagement  from '../pages/UserManagement/UserManagement';
import AuditTrail      from '../pages/AuditTrail/AuditTrail';
import Workflow        from '../pages/Workflow/Workflow';
import Reports         from '../pages/Reports/Reports';

import Systemconfiguration from '../pages/Configurations/Systemconfiguration';
import Empower from '../pages/Configurations/Empower';
/* ── Config pages — add imports as you place files in project ── */
// import ConfigSystem        from '../pages/Configurations/ConfigSystem';
// import ConfigDashboards    from '../pages/Configurations/Dashboards/ConfigDashboards';
// import ConfigReports       from '../pages/Configurations/Reports/ConfigReports';
// import ConfigTemplates     from '../pages/Configurations/Templates/ConfigTemplates';
// import ConfigWorkflow      from '../pages/Configurations/Workflow/ConfigWorkflow';
// import ConfigBusinessRules from '../pages/Configurations/BusinessRules/ConfigBusinessRules';

function LandingPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '70vh', gap: 12, textAlign: 'center',
    }}>
      <div style={{ fontSize: 52, color: 'var(--accent)', opacity: 0.3 }}>◈</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--text2)' }}>
        Welcome to Xception.AI
      </div>
      <div style={{ fontSize: 13, color: 'var(--text3)' }}>
        Select a module from the sidebar to get started
      </div>
    </div>
  );
}

export default function Approuter() {
  return (
    <Routes>
      <Route element={<Mainlayout />}>

        {/* Landing */}
        <Route path="/"          element={<LandingPage />} />

        {/* Main pages */}
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/dashboards" element={<UserDashboard />} />
        <Route path="/workflow"   element={<Workflow />} />
        <Route path="/reports"    element={<Reports />} />
        <Route path="/users"      element={<UserManagement />} />
        <Route path="/audit"      element={<AuditTrail />} />

        {/* Configuration pages — direct routes, no nested layout */}
        <Route path="/configurations/system" element={<Systemconfiguration />} />
        <Route path="/configurations/system/empower" element={<Empower />} />
        <Route path="/configurations/dashboards"
          element={<Placeholderpage title="Dashboard Config" />}
          // element={<ConfigDashboards />}
        />
        <Route path="/configurations/reports"
          element={<Placeholderpage title="Reports Config" />}
          // element={<ConfigReports />}
        />
        <Route path="/configurations/templates"
          element={<Placeholderpage title="Templates" />}
          // element={<ConfigTemplates />}
        />
        <Route path="/configurations/workflow"
          element={<Placeholderpage title="Workflow Config" />}
          // element={<ConfigWorkflow />}
        />
        <Route path="/configurations/rules"
          element={<Placeholderpage title="Business Rules" />}
          // element={<ConfigBusinessRules />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}