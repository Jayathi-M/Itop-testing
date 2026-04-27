import { useState } from 'react';
import './Dashboardconfig.css';

interface Dashboard {
  id: number;
  name: string;
  desc: string;
  widgets: number;
  roles: string;
  status: string;
}

interface Widget {
  icon: string;
  name: string;
}

const DASHBOARDS_DATA: Dashboard[] = [
  { id: 1, name: 'System Overview',   desc: 'Health, risk and status of all systems',  widgets: 6, roles: 'All',              status: 'active' },
  { id: 2, name: 'Exception Monitor', desc: 'Real-time exception flags and alerts',    widgets: 4, roles: 'Analyst, Reviewer', status: 'active' },
  { id: 3, name: 'Compliance KPIs',   desc: 'Pass rates, trends and compliance stats', widgets: 8, roles: 'Manager, Admin',    status: 'active' },
  { id: 4, name: 'Scheduler Monitor', desc: 'Job execution health and run history',    widgets: 5, roles: 'Admin',             status: 'draft'  },
];

const WIDGETS: Widget[] = [
  { icon: '📊', name: 'KPI Counter'     },
  { icon: '📈', name: 'Line Chart'      },
  { icon: '📉', name: 'Bar Chart'       },
  { icon: '🥧', name: 'Pie Chart'       },
  { icon: '📋', name: 'Exception Table' },
  { icon: '🗺️', name: 'Risk Heatmap'   },
  { icon: '⏱️', name: 'Timeline'        },
  { icon: '🎯', name: 'Gauge'           },
  { icon: '🃏', name: 'Status Cards'    },
  { icon: '✅', name: 'Compliance %'    },
  { icon: '🔔', name: 'Alert Panel'     },
  { icon: '✨', name: 'Trend Sparkline' },
];

export default function ConfigDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>(DASHBOARDS_DATA);
  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);

  const [formName,  setFormName]  = useState('');
  const [formDesc,  setFormDesc]  = useState('');
  const [formRoles, setFormRoles] = useState('All');

  function handleSave() {
    if (!formName.trim()) return;
    const newDash: Dashboard = {
      id:      dashboards.length + 1,
      name:    formName.trim(),
      desc:    formDesc.trim() || 'No description',
      widgets: 0,
      roles:   formRoles,
      status:  'draft',
    };
    setDashboards(prev => [...prev, newDash]);
    setFormName('');
    setFormDesc('');
    setFormRoles('All');
    setShowForm(false);
  }

  function deleteDashboard(id: number) {
    setDashboards(prev => prev.filter(d => d.id !== id));
  }

  const filtered = dashboards.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cd-page">

      <div className="cd-page__header">
        <div>
          <h1 className="cd-page__title">Dashboard Configuration</h1>
          <p className="cd-page__subtitle">Create and manage KPI dashboards</p>
        </div>
        <div className="cd-header-right">
          <div className="search-box">
            <span className="search-box__icon">&#128269;</span>
            <input
              className="search-box__input"
              placeholder="Search dashboards..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(p => !p)}>
            {showForm ? '✕ Cancel' : '+ Create Dashboard'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="cd-form-card">
          <div className="cd-form-card__title">New Dashboard</div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="field-label">Dashboard Name *</label>
              <input className="field-input" placeholder="e.g. QC Lab Overview" value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Visible To</label>
              <select className="field-select" value={formRoles} onChange={e => setFormRoles(e.target.value)}>
                <option>All</option>
                <option>Admin</option>
                <option>Manager, Admin</option>
                <option>Analyst, Reviewer</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">Description</label>
            <input className="field-input" placeholder="Brief description of this dashboard..." value={formDesc} onChange={e => setFormDesc(e.target.value)} />
          </div>
          {!formName.trim() && <div className="form-hint">⚠ Dashboard name is required</div>}
          <div className="form-actions">
            <button className="btn btn--primary" onClick={handleSave} disabled={!formName.trim()} style={{ opacity: formName.trim() ? 1 : 0.5 }}>
              Save Dashboard
            </button>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="cd-section">
        <div className="cd-section__header">
          <span className="cd-section__title">Dashboard Library</span>
          <span className="badge badge--blue">{dashboards.length} dashboards</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📊</div>
            <div className="empty-state__text">No dashboards found</div>
            <div className="empty-state__sub">Try a different search or create a new one</div>
          </div>
        ) : (
          <div className="cd-list">
            {filtered.map(d => (
              <div key={d.id} className="cd-item">
                <div className="cd-item__icon">📊</div>
                <div className="cd-item__info">
                  <div className="cd-item__name">{d.name}</div>
                  <div className="cd-item__desc">{d.desc}</div>
                </div>
                <div className="cd-item__meta">
                  <span className="small muted">Roles</span>
                  <span className="small">{d.roles}</span>
                </div>
                <span className="chip">{d.widgets} widgets</span>
                <span className={'badge ' + (d.status === 'active' ? 'badge--green' : 'badge--grey')}>
                  {d.status === 'active' ? 'Active' : 'Draft'}
                </span>
                <div className="row-actions">
                  <button className="btn btn--secondary btn--sm">Edit</button>
                  <button className="btn btn--danger btn--sm" onClick={() => deleteDashboard(d.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cd-section">
        <div className="cd-section__header">
          <span className="cd-section__title">Widget Library</span>
          <span className="small muted">Click any widget to add it to a dashboard</span>
        </div>
        <div className="cd-widgets">
          {WIDGETS.map((w, i) => (
            <div key={i} className="cd-widget-card">
              <div className="cd-widget-card__icon">{w.icon}</div>
              <div className="cd-widget-card__name">{w.name}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
