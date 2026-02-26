import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Systemconfiguration.css';

const SYSTEMS = {
  Quality: [
    { id: 'emp',  name: 'Empower',       make: 'Waters',        model: 'Empower 3',  version: '3.6.1', site: 'Site A - Lab 1', status: 'configured',  connection: 'online',  risk: 12, checks: 24, exceptions: 8  },
    { id: 'chr',  name: 'Chromeleon',    make: 'Thermo Fisher', model: '7.3',        version: '7.3.2', site: 'Site A - Lab 2', status: 'in-progress', connection: 'online',  risk: 3,  checks: 18, exceptions: 2  },
    { id: 'lab',  name: 'LabSolutions',  make: 'Shimadzu',      model: '5.97',       version: '5.100', site: 'Site B - Lab 1', status: 'pending',     connection: 'offline', risk: 0,  checks: 0,  exceptions: 0  },
  ],
  'Non-CDS': [
    { id: 'port', name: 'Port Based',    make: 'Generic',       model: 'RS232/IP',   version: '2.1',   site: 'Site C - Lab 1', status: 'configured',  connection: 'online',  risk: 5,  checks: 12, exceptions: 1  },
    { id: 'file', name: 'File Based',    make: 'Generic',       model: 'CSV/XML',    version: '1.0',   site: 'Site C - Lab 2', status: 'pending',     connection: 'offline', risk: 0,  checks: 0,  exceptions: 0  },
  ],
  Manufacturing: [
    { id: 'blen', name: 'Bin Blender',   make: 'GlobePharma',   model: 'BIN-100',    version: '4.2',   site: 'Site B - Mfg',   status: 'configured',  connection: 'online',  risk: 8,  checks: 20, exceptions: 5  },
    { id: 'coat', name: 'Tablet Coater', make: 'Generic',       model: 'Labcoat II', version: '3.1',   site: 'Site B - Mfg',   status: 'in-progress', connection: 'online',  risk: 2,  checks: 14, exceptions: 1  },
  ],
  Enterprise: [
    { id: 'lims', name: 'LIMS',          make: 'LabVantage',    model: '8.7',        version: '8.7.2', site: 'Site A - QA',    status: 'configured',  connection: 'online',  risk: 1,  checks: 30, exceptions: 0  },
    { id: 'sap',  name: 'SAP QM',        make: 'SAP',           model: 'S/4HANA',    version: '2023',  site: 'Site A - IT',    status: 'pending',     connection: 'offline', risk: 0,  checks: 0,  exceptions: 0  },
    { id: 'erp',  name: 'ERP System',    make: 'Oracle',        model: 'Cloud ERP',  version: '23.4',  site: 'Site A - IT',    status: 'configured',  connection: 'online',  risk: 2,  checks: 15, exceptions: 0  },
  ],
};

/* ── Route map: systems with their own dedicated page ── */
const SYS_ROUTES = {
  emp: '/configurations/system/empower',
};

const CAT_ICONS = { Quality: '⚗️', 'Non-CDS': '🔌', Manufacturing: '🏭', Enterprise: '🏢' };

const CHECKLISTS = {
  emp:  [
    { id:1, name:'System Suitability - RSD',    condition:'<= 2.0%',     param:'rsd_value',       type:'Auto',   active:true  },
    { id:2, name:'Peak Tailing Factor',          condition:'<= 1.5',      param:'tailing_factor',  type:'Auto',   active:true  },
    { id:3, name:'Column Efficiency (N)',        condition:'>= 5000',     param:'n_plates',        type:'Auto',   active:true  },
    { id:4, name:'Retention Time Stability',     condition:'+/- 0.1 min', param:'rt_value',        type:'Auto',   active:true  },
    { id:5, name:'Baseline Noise',               condition:'< 0.001 mAU', param:'noise_level',     type:'Manual', active:false },
  ],
  chr:  [
    { id:1, name:'Column Efficiency (N)',        condition:'>= 5000',     param:'n_plates',        type:'Auto',   active:true  },
    { id:2, name:'Peak Asymmetry Factor',        condition:'<= 1.8',      param:'asymmetry',       type:'Auto',   active:true  },
    { id:3, name:'Signal to Noise Ratio',        condition:'>= 10',       param:'snr_value',       type:'Auto',   active:true  },
    { id:4, name:'Run Time Compliance',          condition:'+/- 0.2 min', param:'run_time',        type:'Manual', active:false },
  ],
  lab:  [
    { id:1, name:'System Suitability Check',     condition:'<= 1.5%',     param:'suitability',     type:'Auto',   active:false },
    { id:2, name:'Detector Linearity',           condition:'R² >= 0.999', param:'linearity_r2',    type:'Auto',   active:false },
    { id:3, name:'Injection Volume Precision',   condition:'RSD <= 1.0%', param:'inj_precision',   type:'Auto',   active:false },
  ],
  port: [
    { id:1, name:'Signal Threshold Check',       condition:'>= 4mA',      param:'signal_ma',       type:'Auto',   active:true  },
    { id:2, name:'Port Timeout',                 condition:'< 30s',       param:'timeout_sec',     type:'Auto',   active:true  },
  ],
  file: [
    { id:1, name:'File Received Check',          condition:'< 1hr delay', param:'file_delay',      type:'Auto',   active:false },
    { id:2, name:'Schema Validation',            condition:'Match 100%',  param:'schema_match',    type:'Auto',   active:false },
  ],
  blen: [
    { id:1, name:'Batch Uniformity CV',          condition:'<= 3.0%',     param:'batch_cv',        type:'Auto',   active:true  },
    { id:2, name:'Blending Time',                condition:'<= 30 min',   param:'blend_time',      type:'Auto',   active:true  },
    { id:3, name:'RPM Stability',                condition:'+/- 2 RPM',   param:'rpm_value',       type:'Auto',   active:true  },
  ],
  coat: [
    { id:1, name:'Coating Weight Gain',          condition:'+/- 0.5%',    param:'weight_gain',     type:'Auto',   active:true  },
    { id:2, name:'Inlet Air Temperature',        condition:'+/- 2°C',     param:'inlet_temp',      type:'Auto',   active:true  },
  ],
  lims: [
    { id:1, name:'Data Integrity Check',         condition:'Hash Match',  param:'data_hash',       type:'Auto',   active:true  },
    { id:2, name:'Record Completeness',          condition:'100%',        param:'completeness',    type:'Auto',   active:true  },
    { id:3, name:'API Response Time',            condition:'< 5s',        param:'api_response',    type:'Auto',   active:true  },
  ],
  sap:  [
    { id:1, name:'SAP QM Status Sync',           condition:'Match ERP',   param:'qm_status',       type:'Auto',   active:false },
  ],
  erp:  [
    { id:1, name:'Batch Record Sync',            condition:'< 1hr delay', param:'batch_sync',      type:'Auto',   active:true  },
    { id:2, name:'ERP Data Completeness',        condition:'100%',        param:'erp_complete',    type:'Auto',   active:true  },
  ],
};

const SCHEDULES = {
  emp:  [
    { org:'PharmaOrg', facility:'Site A - Lab 1', asset:'Empower WS-01', checks:'System Suitability, Peak Analysis', freq:'Per Run' },
    { org:'PharmaOrg', facility:'Site A - Lab 1', asset:'Empower WS-02', checks:'All Checks',                        freq:'Daily'   },
  ],
  chr:  [
    { org:'PharmaOrg', facility:'Site A - Lab 2', asset:'Chromeleon WS-01', checks:'Column Efficiency, Asymmetry', freq:'Per Run' },
  ],
  blen: [
    { org:'PharmaOrg', facility:'Site B - Mfg', asset:'Bin Blender BL-01', checks:'Batch Uniformity, RPM', freq:'Per Batch' },
  ],
  lims: [
    { org:'PharmaOrg', facility:'Site A - QA', asset:'LIMS Server', checks:'All Checks', freq:'Daily' },
  ],
};

const APPROVAL_CHAIN = [
  { step:1, role:'Analyst (Self)', user:'Dr. Ananya Sharma', status:'done'    },
  { step:2, role:'Reviewer',       user:'Rajesh Kumar',      status:'pending' },
  { step:3, role:'QA Manager',     user:'Sanjay Mehta',      status:'waiting' },
];

function getAllSystems() { return Object.values(SYSTEMS).flat(); }
function statusColor(s) {
  return s === 'configured' ? 'var(--success)' : s === 'in-progress' ? 'var(--warn)' : 'var(--text3)';
}
function riskColor(r) {
  return r > 8 ? 'var(--danger)' : r > 4 ? 'var(--warn)' : 'var(--success)';
}
function StatusBadge({ status }) {
  const map = { configured: ['Configured','badge--green'], 'in-progress': ['In Progress','badge--yellow'], pending: ['Pending','badge--grey'] };
  const [label, cls] = map[status] || [status, 'badge--grey'];
  return <span className={'badge ' + cls}>{label}</span>;
}

function ChecklistTab({ sysId }) {
  const [items, setItems] = useState(CHECKLISTS[sysId] || []);
  function toggle(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  }
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <span className="tab-content__title">Checkpoint Configuration</span>
        <button className="btn btn--primary btn--sm">+ Add Checkpoint</button>
      </div>
      <div className="checklist">
        {items.map(item => (
          <div key={item.id} className={'checklist-row ' + (item.active ? '' : 'checklist-row--inactive')}>
            <div className={'toggle ' + (item.active ? 'toggle--on' : '')} onClick={() => toggle(item.id)}>
              <div className="toggle__knob" />
            </div>
            <div className="checklist-row__info">
              <div className="checklist-row__name">{item.name}</div>
              <div className="checklist-row__param">param: {item.param}</div>
            </div>
            <div className="checklist-row__condition">
              <span className="small muted">Condition</span>
              <span className="mono bold">{item.condition}</span>
            </div>
            <span className={'badge ' + (item.type === 'Auto' ? 'badge--accent' : 'badge--blue')}>{item.type}</span>
            <div className="row-actions">
              <button className="btn btn--secondary btn--sm">Edit</button>
              <button className="btn btn--danger btn--sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientConfigTab({ sys }) {
  const [method, setMethod] = useState('sdk');
  const [testStatus, setTest] = useState(null);
  function handleTest() {
    setTest('testing');
    setTimeout(() => setTest(sys.connection === 'online' ? 'ok' : 'fail'), 1800);
  }
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <span className="tab-content__title">Integration Method</span>
      </div>
      {sys.connection === 'offline' && (
        <div className="notice notice--yellow">⚠ System is offline. Complete configuration and test connection to bring it online.</div>
      )}
      <div className="method-cards">
        <div className={'method-card ' + (method === 'sdk' ? 'method-card--active' : '')} onClick={() => setMethod('sdk')}>
          <div className="method-card__icon">🔧</div>
          <div className="method-card__name">SDK Integration</div>
          <div className="method-card__desc">Direct SDK / API access</div>
        </div>
        <div className={'method-card ' + (method === 'db' ? 'method-card--active' : '')} onClick={() => setMethod('db')}>
          <div className="method-card__icon">📄</div>
          <div className="method-card__name">Database Access</div>
          <div className="method-card__desc">Direct DB query</div>
        </div>
      </div>
      <div className="config-section">
        <div className="config-section__title">SDK Configuration</div>
        <div className="form-row-2">
          <div className="form-field"><label className="field-label">Server URL</label><input className="field-input" placeholder="http://server:port/" /></div>
          <div className="form-field"><label className="field-label">SDK Version</label><input className="field-input" placeholder="e.g. 3.7.1" /></div>
        </div>
        <div className="form-row-2">
          <div className="form-field"><label className="field-label">Username</label><input className="field-input" placeholder="Service account..." /></div>
          <div className="form-field"><label className="field-label">Password</label><input className="field-input" type="password" placeholder="••••••••" /></div>
        </div>
        <div className="form-actions">
          <button className="btn btn--secondary" onClick={handleTest}>
            {testStatus === 'testing' ? '⏳ Testing...' : 'Test Connection'}
          </button>
          {testStatus === 'ok'   && <span className="badge badge--green">✓ Connection OK</span>}
          {testStatus === 'fail' && <span className="badge badge--red">✗ Connection Failed</span>}
          <button className="btn btn--primary">Save Config</button>
        </div>
      </div>
      <div className="config-section">
        <div className="config-section__title">API Configuration</div>
        <div className="form-row-2">
          <div className="form-field"><label className="field-label">Base URL</label><input className="field-input" placeholder="https://api.system/v2/" /></div>
          <div className="form-field"><label className="field-label">Auth Type</label>
            <select className="field-select"><option>Bearer Token</option><option>Basic Auth</option><option>OAuth2</option><option>API Key</option></select>
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-field"><label className="field-label">API Token</label><input className="field-input" type="password" placeholder="Enter token..." /></div>
          <div className="form-field"><label className="field-label">Polling Interval</label>
            <select className="field-select"><option>1 minute</option><option>5 minutes</option><option>15 minutes</option><option>1 hour</option></select>
          </div>
        </div>
        <div className="form-actions"><button className="btn btn--primary">Save API Config</button></div>
      </div>
    </div>
  );
}

function SchedulerTab({ sysId }) {
  const [schedules, setSchedules] = useState(SCHEDULES[sysId] || []);
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <span className="tab-content__title">Scheduler Configuration</span>
        <button className="btn btn--primary btn--sm">+ Add Schedule</button>
      </div>
      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <div className="empty-state__text">No schedules configured yet</div>
          <div className="empty-state__sub">Click + Add Schedule to create the first one</div>
        </div>
      ) : (
        <div className="schedule-list">
          {schedules.map((s, i) => (
            <div key={i} className="schedule-row">
              <div className="schedule-row__col"><span className="small muted">Org</span><span className="bold">{s.org}</span></div>
              <div className="schedule-row__col"><span className="small muted">Facility</span><span>{s.facility}</span></div>
              <div className="schedule-row__col"><span className="small muted">Asset</span><span className="bold">{s.asset}</span></div>
              <div className="schedule-row__col schedule-row__col--wide"><span className="small muted">Checks</span><span className="small">{s.checks}</span></div>
              <span className="badge badge--accent">{s.freq}</span>
              <div className="row-actions">
                <button className="btn btn--secondary btn--sm">Edit</button>
                <button className="btn btn--danger btn--sm" onClick={() => setSchedules(p => p.filter((_,j)=>j!==i))}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowTab({ sys }) {
  const [chain] = useState(APPROVAL_CHAIN);
  function stepColor(s) { return s==='done' ? 'var(--success)' : s==='pending' ? 'var(--warn)' : 'var(--border2)'; }
  return (
    <div className="tab-content">
      <div className="tab-content__header"><span className="tab-content__title">Approval Workflow for {sys.name}</span></div>
      <div className="notice notice--blue">🔒 Configure the approval chain for exceptions raised from this system.</div>
      <div className="approval-chain">
        {chain.map(a => (
          <div key={a.step} className="approval-row">
            <div className="approval-row__num" style={{ background: stepColor(a.status), color: a.status==='waiting'?'var(--text3)':'#fff' }}>
              {a.status==='done' ? '✓' : a.step}
            </div>
            <div className="approval-row__info">
              <div className="approval-row__role">{a.role}</div>
              <div className="approval-row__user">{a.user}</div>
            </div>
            <span className={'badge '+(a.status==='done'?'badge--green':a.status==='pending'?'badge--yellow':'badge--grey')}>
              {a.status==='done'?'Done':a.status==='pending'?'Pending':'Waiting'}
            </span>
          </div>
        ))}
      </div>
      <div className="form-actions" style={{ marginTop:20 }}>
        <button className="btn btn--primary">Save Workflow</button>
      </div>
    </div>
  );
}

const TABS = [
  { id:'checklist', label:'Checklist Config' },
  { id:'client',    label:'Client Config'    },
  { id:'scheduler', label:'Scheduler'        },
  { id:'workflow',  label:'Workflow'         },
];

export default function ConfigSystem() {
  const navigate = useNavigate();
  const location = useLocation();

  const [level,     setLevel]     = useState(location.state?.level ?? 0);
  const [selCat,    setSelCat]    = useState(location.state?.cat   ?? '');
  const [selSys,    setSelSys]    = useState(null);
  const [activeTab, setActiveTab] = useState('checklist');

  // If state carries level 1, clear window state so refresh goes to level 0
  useEffect(() => {
    if (location.state?.level) {
      window.history.replaceState({}, '');
    }
  }, []);

  function goLevel0() { setLevel(0); setSelCat(''); setSelSys(null); }
  function goLevel1(cat) { setSelCat(cat); setLevel(1); }

  /* ── ONLY CHANGE: check SYS_ROUTES first, navigate if exists ── */
  function goLevel2(sys) {
    if (SYS_ROUTES[sys.id]) {
      navigate(SYS_ROUTES[sys.id], { state: { sys, cat: selCat } });
    } else {
      setSelSys(sys);
      setActiveTab('checklist');
      setLevel(2);
    }
  }

  /* ── LEVEL 0 ── */
  if (level === 0) return (
    <div className="cs-page">
      <div className="cs-page__header">
        <div>
          <h1 className="cs-page__title">System Configurations</h1>
          <p className="cs-page__subtitle">Configure instruments by category</p>
        </div>
        <button className="btn btn--primary">+ Register System</button>
      </div>
      <div className="cs-categories">
        {Object.entries(SYSTEMS).map(([cat, systems]) => (
          <div key={cat} className="cs-cat-card" onClick={() => goLevel1(cat)}>
            <div className="cs-cat-card__header">
              <div className="cs-cat-card__title">
                <span>{CAT_ICONS[cat]}</span>
                <span>{cat}</span>
              </div>
              <span className="cs-cat-card__arrow">›</span>
            </div>
            <div className="cs-cat-card__list">
              {systems.map(sys => (
                <div key={sys.id} className="cs-sys-row">
                  <span className="cs-sys-row__dot" style={{ background: statusColor(sys.status) }} />
                  <span className="cs-sys-row__name">{sys.name}</span>
                  <span className="cs-sys-row__status" style={{ color: statusColor(sys.status) }}>{sys.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── LEVEL 1 ── */
  if (level === 1) return (
    <div className="cs-page">
      <div className="breadcrumb">
        <span className="breadcrumb__link" onClick={() => navigate('/dashboard')}>System Dashboard</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__link" onClick={goLevel0}>System Configurations</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">{CAT_ICONS[selCat]} {selCat}</span>
      </div>
      <div className="cs-page__header">
        <div>
          <h1 className="cs-page__title">{CAT_ICONS[selCat]} {selCat}</h1>
          <p className="cs-page__subtitle">Select a system to configure</p>
        </div>
        <button className="btn btn--secondary" onClick={goLevel0}>← All Categories</button>
      </div>
      <div className="cs-sys-cards">
        {SYSTEMS[selCat].map(sys => (
          <div key={sys.id} className="cs-sys-card" onClick={() => goLevel2(sys)}>
            <div className="cs-sys-card__header">
              <span className="cs-sys-card__dot" style={{ background: statusColor(sys.status) }} />
              <span className="cs-sys-card__arrow">›</span>
            </div>
            <div className="cs-sys-card__name">{sys.name}</div>
            <div className="cs-sys-card__make">{sys.make} — {sys.model}</div>
            <div className="cs-sys-card__status" style={{ color: statusColor(sys.status) }}>{sys.status}</div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── LEVEL 2 — fallback for systems without a dedicated page ── */
  return (
    <div className="cs-page">
      <div className="breadcrumb">
        <span className="breadcrumb__link" onClick={() => navigate('/dashboard')}>System Dashboard</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__link" onClick={goLevel0}>System Configurations</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__link" onClick={() => setLevel(1)}>{selCat}</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">{selSys.name}</span>
      </div>
      <div className="cs-page__header">
        <div>
          <h1 className="cs-page__title">{selSys.name}</h1>
          <p className="cs-page__subtitle">{selSys.make} — {selSys.model} v{selSys.version} &nbsp;|&nbsp; {selSys.site}</p>
        </div>
        <div className="cs-detail-badges">
          <StatusBadge status={selSys.status} />
          <span className={'badge ' + (selSys.connection === 'online' ? 'badge--green badge--pulse' : 'badge--red')}>
            ● {selSys.connection === 'online' ? 'Online' : 'Offline'}
          </span>
          <span className="badge" style={{ background:'rgba(239,68,68,0.13)', color: riskColor(selSys.risk) }}>
            Risk: {selSys.risk}
          </span>
        </div>
      </div>
      <div className="cs-info-tiles">
        <div className="info-tile"><span className="info-tile__label">Last Job Run</span><span className="info-tile__value mono">2024-01-15 08:00</span></div>
        <div className="info-tile"><span className="info-tile__label">Total Checks</span><span className="info-tile__value">{selSys.checks}</span></div>
        <div className="info-tile"><span className="info-tile__label">Exceptions</span><span className="info-tile__value" style={{ color: selSys.exceptions > 0 ? 'var(--danger)' : 'var(--success)' }}>{selSys.exceptions}</span></div>
        <div className="info-tile"><span className="info-tile__label">Version</span><span className="info-tile__value mono">{selSys.version}</span></div>
      </div>
      <div className="tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={'tab-btn ' + (activeTab === tab.id ? 'tab-btn--active' : '')} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'checklist' && <ChecklistTab sysId={selSys.id} />}
      {activeTab === 'client'    && <ClientConfigTab sys={selSys} />}
      {activeTab === 'scheduler' && <SchedulerTab sysId={selSys.id} />}
      {activeTab === 'workflow'  && <WorkflowTab sys={selSys} />}
    </div>
  );
}