import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SystemDashboardPage.css";

const SYSTEMS = {
  Quality: [
    { id: 'emp',  name: 'Empower',       make: 'Waters',        status: 'configured',  risk: 12 },
    { id: 'chr',  name: 'Chromeleon',    make: 'Thermo Fisher', status: 'in-progress', risk: 3  },
    { id: 'lab',  name: 'LabSolutions',  make: 'Shimadzu',      status: 'pending',     risk: 0  },
  ],
  'Non-CDS': [
    { id: 'port', name: 'Port Based',    make: 'Generic',       status: 'configured',  risk: 5  },
    { id: 'file', name: 'File Based',    make: 'Generic',       status: 'pending',     risk: 0  },
  ],
  Manufacturing: [
    { id: 'blen', name: 'Bin Blender',   make: 'GlobePharma',   status: 'configured',  risk: 8  },
    { id: 'coat', name: 'Tablet Coater', make: 'Generic',       status: 'in-progress', risk: 2  },
  ],
  Enterprise: [
    { id: 'lims', name: 'LIMS',          make: 'LabVantage',    status: 'configured',  risk: 1  },
    { id: 'sap',  name: 'SAP QM',        make: 'SAP',           status: 'pending',     risk: 0  },
    { id: 'erp',  name: 'ERP System',    make: 'Oracle',        status: 'configured',  risk: 2  },
  ],
};

const ACTIVITY = [
  { user: 'Rajesh Kumar',       action: 'Reviewed exception',     record: 'JOB-1043', time: '10:45:22' },
  { user: 'Dr. Ananya Sharma',  action: 'Updated system config',  record: 'Empower',  time: '10:12:05' },
  { user: 'Priya Nair',         action: 'Acknowledged exception', record: 'JOB-1044', time: '09:55:10' },
  { user: 'Dr. Ananya Sharma',  action: 'User login',             record: '-',        time: '09:22:33' },
  { user: 'System',             action: 'Scheduled job ran',      record: 'JOB-1044', time: '09:00:00' },
];

// ── FIX: all 4 cards now route to /configurations/system ──
// The category selection happens INSIDE ConfigSystem page (Level 0 → Level 1)
const CAT_ROUTES = {
  Quality:       '/configurations/system',
  'Non-CDS':     '/configurations/system',
  Manufacturing: '/configurations/system',
  Enterprise:    '/configurations/system',
};

const CAT_ICONS = { Quality: '⚗️', 'Non-CDS': '🔌', Manufacturing: '🏭', Enterprise: '🏢' };

function StatusDot({ status }) {
  const color = status === 'configured' ? 'var(--success)' : status === 'in-progress' ? 'var(--warn)' : 'var(--text3)';
  return <span className="status-dot" style={{ background: color }} />;
}

function StatusBadge({ status }) {
  const map = {
    'configured':  { label: 'Configured',  cls: 'badge--green'  },
    'in-progress': { label: 'In Progress', cls: 'badge--yellow' },
    'pending':     { label: 'Pending',     cls: 'badge--grey'   },
  };
  const { label, cls } = map[status] || { label: status, cls: 'badge--grey' };
  return <span className={'badge ' + cls}>{label}</span>;
}

function riskColor(risk) {
  if (risk > 8) return 'var(--danger)';
  if (risk > 4) return 'var(--warn)';
  return 'var(--success)';
}

function getAllSystems() { return Object.values(SYSTEMS).flat(); }

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={{ color }}>{value}</div>
    </div>
  );
}

function CategoryCard({ name, icon, systems, search, onClick }) {
  const visible = search
    ? systems.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.make.toLowerCase().includes(search.toLowerCase())
      )
    : systems;

  return (
    <div className="cat-card cat-card--clickable" onClick={onClick}>
      <div className="cat-card__header">
        <div className="cat-card__title">
          <span>{icon}</span>
          <span>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="cat-card__count">{systems.length} systems</span>
          <span className="cat-card__arrow">&#8250;</span>
        </div>
      </div>

      <div className="cat-card__list">
        {visible.length === 0 ? (
          <div className="cat-card__empty">No match found</div>
        ) : (
          visible.map(sys => (
            <div key={sys.id} className="sys-row">
              <StatusDot status={sys.status} />
              <span className="sys-row__name">{sys.name}</span>
              <span className="sys-row__make">{sys.make}</span>
              <StatusBadge status={sys.status} />
            </div>
          ))
        )}
      </div>

      <div className="cat-card__footer">
        Click to configure systems &#8250;
      </div>
    </div>
  );
}

export default function SystemDashboard() {
  const navigate   = useNavigate();
  const [search, setSearch] = useState('');

  const all        = getAllSystems();
  const configured = all.filter(s => s.status === 'configured').length;
  const inProgress = all.filter(s => s.status === 'in-progress').length;
  const pending    = all.filter(s => s.status === 'pending').length;
  const riskyOnes  = all.filter(s => s.risk > 0).sort((a, b) => b.risk - a.risk);

  return (
    <div className="sys-dash">

      <div className="sys-dash__header">
        <div>
          <h1 className="sys-dash__title">System Dashboard</h1>
          <p className="sys-dash__subtitle">Configure instruments by category</p>
        </div>
        <div className="sys-dash__actions">
          <div className="sys-dash__search">
            <span className="sys-dash__search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search systems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="sys-dash__btn">+ New System</button>
        </div>
      </div>

      <div className="sys-dash__stats">
        <StatCard label="Total Systems" value={all.length}  color="var(--accent2)" icon="&#128187;" />
        <StatCard label="Configured"    value={configured}  color="var(--success)" icon="&#9989;"  />
        <StatCard label="In Progress"   value={inProgress}  color="var(--warn)"    icon="&#9889;"  />
        <StatCard label="Pending"       value={pending}     color="var(--danger)"  icon="&#8987;"  />
      </div>

      <div className="sys-dash__categories">
        {Object.entries(SYSTEMS).map(([catName, systems]) => (
          <CategoryCard
            key={catName}
            name={catName}
            icon={CAT_ICONS[catName]}
            systems={systems}
            search={search}
            onClick={() => navigate(CAT_ROUTES[catName])}
          />
        ))}
      </div>

      <div className="sys-dash__bottom">
        <div className="bottom-card">
          <div className="bottom-card__title">Risk Index by System</div>
          <div className="risk-list">
            {riskyOnes.map(sys => (
              <div key={sys.id} className="risk-item">
                <div className="risk-item__top">
                  <span>{sys.name}</span>
                  <span style={{ color: riskColor(sys.risk), fontWeight: 700 }}>{sys.risk}</span>
                </div>
                <div className="risk-bar">
                  <div className="risk-bar__fill" style={{ width: Math.min(100, sys.risk * 8) + '%', background: riskColor(sys.risk) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-card">
          <div className="bottom-card__title">Recent Activity</div>
          <div className="activity-list">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-item__dot" />
                <div className="activity-item__body">
                  <div className="activity-item__time">{item.time}</div>
                  <div className="activity-item__text">
                    <strong>{item.user}</strong> &mdash; {item.action}
                    {item.record !== '-' && <span className="activity-item__tag">{item.record}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}