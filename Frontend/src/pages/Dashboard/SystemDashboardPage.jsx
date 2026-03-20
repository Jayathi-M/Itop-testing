import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SystemDashboardPage.css";

const INSTRUMENTS = [
  { id:1,  module:'Windex (v.5)',   location:'Goa',       instrument:'PT-G-1101', lostRun:'2025-08-21  16:20:24', agent:true,  centralService:true  },
  { id:2,  module:'Windex (v.5)',   location:'Goa',       instrument:'PT-G-1102', lostRun:'2025-08-21  16:20:25', agent:true,  centralService:true  },
  { id:3,  module:'Empower 3',      location:'Mumbai',    instrument:'PT-M-2201', lostRun:'2025-08-21  14:11:03', agent:true,  centralService:false },
  { id:4,  module:'Empower 3',      location:'Mumbai',    instrument:'PT-M-2202', lostRun:'2025-08-21  14:15:47', agent:true,  centralService:true  },
  { id:5,  module:'Chromeleon 7.3', location:'Pune',      instrument:'PT-P-3301', lostRun:'2025-08-20  09:45:12', agent:false, centralService:true  },
  { id:6,  module:'Chromeleon 7.3', location:'Pune',      instrument:'PT-P-3302', lostRun:'2025-08-20  09:52:33', agent:true,  centralService:true  },
  { id:7,  module:'LabSolutions',   location:'Hyderabad', instrument:'PT-H-4401', lostRun:'2025-08-19  11:30:00', agent:false, centralService:false },
  { id:8,  module:'LabSolutions',   location:'Hyderabad', instrument:'PT-H-4402', lostRun:'2025-08-19  11:35:22', agent:true,  centralService:true  },
  { id:9,  module:'SAP QM',         location:'Bangalore', instrument:'PT-B-5501', lostRun:'2025-08-21  08:00:00', agent:true,  centralService:true  },
  { id:10, module:'SAP QM',         location:'Bangalore', instrument:'PT-B-5502', lostRun:'2025-08-21  08:05:41', agent:true,  centralService:false },
  { id:11, module:'LIMS 8.7',       location:'Chennai',   instrument:'PT-C-6601', lostRun:'2025-08-18  17:22:09', agent:false, centralService:true  },
  { id:12, module:'LIMS 8.7',       location:'Chennai',   instrument:'PT-C-6602', lostRun:'2025-08-18  17:28:55', agent:true,  centralService:true  },
  { id:13, module:'Windex (v.5)',   location:'Goa',       instrument:'PT-G-1103', lostRun:'2025-08-21  16:20:26', agent:true,  centralService:true  },
  { id:14, module:'Empower 3',      location:'Mumbai',    instrument:'PT-M-2203', lostRun:'2025-08-21  15:00:11', agent:false, centralService:true  },
  { id:15, module:'Chromeleon 7.3', location:'Pune',      instrument:'PT-P-3303', lostRun:'2025-08-20  10:10:44', agent:true,  centralService:false },
  { id:16, module:'LabSolutions',   location:'Hyderabad', instrument:'PT-H-4403', lostRun:'2025-08-19  12:05:17', agent:true,  centralService:true  },
  { id:17, module:'SAP QM',         location:'Bangalore', instrument:'PT-B-5503', lostRun:'2025-08-21  09:15:30', agent:true,  centralService:true  },
  { id:18, module:'LIMS 8.7',       location:'Chennai',   instrument:'PT-C-6603', lostRun:'2025-08-18  18:00:00', agent:false, centralService:false },
  { id:19, module:'Windex (v.5)',   location:'Goa',       instrument:'PT-G-1104', lostRun:'2025-08-21  16:20:27', agent:true,  centralService:true  },
  { id:20, module:'Empower 3',      location:'Mumbai',    instrument:'PT-M-2204', lostRun:'2025-08-21  15:30:58', agent:true,  centralService:true  },
  { id:21, module:'Chromeleon 7.3', location:'Pune',      instrument:'PT-P-3304', lostRun:'2025-08-20  11:00:22', agent:true,  centralService:true  },
  { id:22, module:'LabSolutions',   location:'Hyderabad', instrument:'PT-H-4404', lostRun:'2025-08-19  13:20:05', agent:false, centralService:true  },
  { id:23, module:'SAP QM',         location:'Bangalore', instrument:'PT-B-5504', lostRun:'2025-08-21  10:45:00', agent:true,  centralService:false },
  { id:24, module:'LIMS 8.7',       location:'Chennai',   instrument:'PT-C-6604', lostRun:'2025-08-18  19:10:33', agent:true,  centralService:true  },
  { id:25, module:'Windex (v.5)',   location:'Goa',       instrument:'PT-G-1105', lostRun:'2025-08-21  16:20:28', agent:true,  centralService:true  },
  { id:26, module:'Empower 3',      location:'Mumbai',    instrument:'PT-M-2205', lostRun:'2025-08-21  16:00:44', agent:false, centralService:true  },
  { id:27, module:'Chromeleon 7.3', location:'Pune',      instrument:'PT-P-3305', lostRun:'2025-08-20  11:45:19', agent:true,  centralService:true  },
  { id:28, module:'LabSolutions',   location:'Hyderabad', instrument:'PT-H-4405', lostRun:'2025-08-19  14:00:50', agent:true,  centralService:false },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const ALERTS = [
  { id:'PT-GC-01',   desc:'Audit trail mismatch',  tag:'NEW',  tagCls:'tag--new'  },
  { id:'PT-HPLC-04', desc:'Pending review > 10d',  tag:'High', tagCls:'tag--high' },
  { id:'PT-LCMS-02', desc:'Config drift detected', tag:'Med',  tagCls:'tag--med'  },
];
const OPEN_PTS   = [120, 180, 140, 220, 190, 260, 310, 280, 345];
const CLOSED_PTS = [80,  60,  95,  50,  70,  40,  55,  30,  23 ];

/* ══════════════════════════════════════
   DONUT CHART — with hover tooltip
══════════════════════════════════════ */
function BubbleChart() {
  // Total sum = 13124 → 70% + 20% + 10% = 100%
  const data = [
    { label:'Total',  value:9187, pct:'70%', color:'#2a2fa8', cx:82,  cy:105, r:72  },
    { label:'Open',   value:2625, pct:'20%', color:'#a78bfa', cx:148, cy:70,  r:48  },
    { label:'Closed', value:1312, pct:'10%', color:'#111827', cx:158, cy:128, r:32  },
  ];

  const [hovered, setHovered] = useState(null);

  // Render back-to-front (Total first → gets covered by Open → then Closed on top)
  // This makes overlapping areas show only the top bubble — no blending
  return (
    <div className="bubble-wrap">
      <svg width="220" height="190" style={{ overflow:'visible' }}>
        {/* Render in order: Total(0) → Open(1) → Closed(2) — each covers previous */}
        {data.map((d, i) => {
          const isHov = hovered === i;
          const r     = isHov ? d.r + 5 : d.r;
          return (
            <g
              key={i}
              className={`bc-bubble bc-bubble--${i}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor:'pointer' }}
            >
              <circle
                cx={d.cx} cy={d.cy} r={r}
                fill={d.color}
                style={{ transition:'r 0.18s ease' }}
              />
              <text
                x={d.cx} y={d.cy + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize={i===0 ? 16 : i===1 ? 13 : 11}
                fontWeight="700"
                style={{ pointerEvents:'none', userSelect:'none' }}
              >
                {isHov ? d.value.toLocaleString() : d.pct}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="bubble-legend">
        {data.map((d, i) => (
          <span key={i} className="bubble-legend-item">
            <span className="bubble-legend-dot" style={{ background:d.color }} />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════
   LINE GRAPH — animated draw left→right
══════════════════════════════════════ */
function LineGraph() {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const W = 340, H = 110, PL = 8, PR = 8, PT = 8, PB = 20;
  const gW = W - PL - PR;
  const gH = H - PT - PB;
  const maxV  = Math.max(...OPEN_PTS, ...CLOSED_PTS) * 1.15;
  const steps = OPEN_PTS.length - 1;

  function toX(i) { return PL + (i / steps) * gW; }
  function toY(v) { return PT + gH - (v / maxV) * gH; }

  function smooth(arr) {
    let d = `M ${toX(0)} ${toY(arr[0])}`;
    for (let i = 1; i < arr.length; i++) {
      const cpX = (toX(i - 1) + toX(i)) / 2;
      d += ` C ${cpX} ${toY(arr[i-1])}, ${cpX} ${toY(arr[i])}, ${toX(i)} ${toY(arr[i])}`;
    }
    return d;
  }

  function handleMouseMove(e) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    const clamped = Math.max(0, Math.min(steps, Math.round(((mouseX - PL) / gW) * steps)));
    setTooltip({
      x: toX(clamped), openY: toY(OPEN_PTS[clamped]), closedY: toY(CLOSED_PTS[clamped]),
      open: OPEN_PTS[clamped], closed: CLOSED_PTS[clamped],
    });
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => PT + gH * (1 - t));

  return (
    <div style={{ position:'relative' }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} className="linegraph-svg"
        onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}
        style={{ cursor:'crosshair' }}>

        {yTicks.map((y, i) => (
          <line key={i} x1={PL} y1={y} x2={W-PR} y2={y}
            stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="3 3" />
        ))}

        {/* Area fills */}
        <path className="lg-area lg-area--open"
          d={`${smooth(OPEN_PTS)} L ${toX(steps)} ${PT+gH} L ${toX(0)} ${PT+gH} Z`}
          fill="rgba(6,214,160,0.08)" />
        <path className="lg-area lg-area--closed"
          d={`${smooth(CLOSED_PTS)} L ${toX(steps)} ${PT+gH} L ${toX(0)} ${PT+gH} Z`}
          fill="rgba(239,68,68,0.06)" />

        {/* Lines — pure CSS draw animation via strokeDashoffset */}
        <path className="lg-line lg-line--open"
          d={smooth(OPEN_PTS)} stroke="#06d6a0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path className="lg-line lg-line--closed"
          d={smooth(CLOSED_PTS)} stroke="#ef4444" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* End dots */}
        <circle className="lg-dot lg-dot--open"
          cx={toX(steps)} cy={toY(OPEN_PTS[steps])} r="3.5" fill="#06d6a0" />
        <circle className="lg-dot lg-dot--closed"
          cx={toX(steps)} cy={toY(CLOSED_PTS[steps])} r="3.5" fill="#ef4444" />

        {/* Crosshair + hover dots */}
        {tooltip && (<>
          <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT+gH}
            stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={tooltip.x} cy={tooltip.openY}   r="5" fill="#fff" stroke="#06d6a0" strokeWidth="2" />
          <circle cx={tooltip.x} cy={tooltip.closedY} r="5" fill="#fff" stroke="#ef4444" strokeWidth="2" />
        </>)}
      </svg>

      {tooltip && (
        <div className="graph-tooltip" style={{
          left:  tooltip.x > W*0.65 ? 'auto' : `calc(${(tooltip.x/W)*100}% + 10px)`,
          right: tooltip.x > W*0.65 ? `calc(${100-(tooltip.x/W)*100}% + 10px)` : 'auto',
          top: 4,
        }}>
          <div className="graph-tooltip__row">
            <span className="graph-tooltip__dot" style={{background:'#06d6a0'}}/>
            <span className="graph-tooltip__label">Open</span>
            <span className="graph-tooltip__val">{tooltip.open}</span>
          </div>
          <div className="graph-tooltip__row">
            <span className="graph-tooltip__dot" style={{background:'#ef4444'}}/>
            <span className="graph-tooltip__label">Closed</span>
            <span className="graph-tooltip__val">{tooltip.closed}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function SystemDashboard() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [filters,     setFilters]     = useState({ location:'', plant:'', module:'', instrument:'' });
  const [dateVal,     setDateVal]     = useState('');
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [tableSearch, setTableSearch] = useState('');
  const dateRef = useRef(null);

  function formatDate(val) {
    if (!val) return 'DD.MM.YYYY';
    const [y, m, d] = val.split('-');
    return `${d}.${m}.${y}`;
  }

  const filteredInstr = tableSearch.trim() === ''
    ? INSTRUMENTS
    : INSTRUMENTS.filter(r => {
        const q = tableSearch.toLowerCase();
        return r.module.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) ||
               r.instrument.toLowerCase().includes(q) || r.lostRun.toLowerCase().includes(q);
      });

  const totalPages = Math.ceil(filteredInstr.length / pageSize);
  const pageData   = filteredInstr.slice((page - 1) * pageSize, page * pageSize);

  function Filter({ label, k }) {
    return (
      <div className="filter-select">
        <select value={filters[k]} onChange={e => setFilters(f => ({ ...f, [k]: e.target.value }))}>
          <option value="">{label}</option>
          <option>Option 1</option><option>Option 2</option>
        </select>
        <i className="fa-solid fa-chevron-down" />
      </div>
    );
  }

  function PagePills() {
    const pills = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pills.push(i); }
    else {
      pills.push(1);
      if (page > 3) pills.push('...');
      for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) pills.push(i);
      if (page < totalPages - 2) pills.push('...');
      pills.push(totalPages);
    }
    return (
      <div className="pagination__pills">
        {pills.map((p, i) =>
          p === '...'
            ? <span key={`d${i}`} className="pagination__dot">…</span>
            : <button key={p} className={`pagination__pill ${page===p?'pagination__pill--active':''}`}
                onClick={() => setPage(p)}>{p}</button>
        )}
      </div>
    );
  }

  return (
    <div className="sd">

      <div className="sd__tabs">
        <button className={`sd__tab ${activeTab==='dashboard'?'sd__tab--active':''}`} onClick={() => setActiveTab('dashboard')}>
          <i className="fa-solid fa-gauge-high" /> Dashboard
        </button>
        <button className={`sd__tab ${activeTab==='transaction'?'sd__tab--active':''}`} onClick={() => setActiveTab('transaction')}>
          <i className="fa-solid fa-arrow-right-arrow-left" /> Transaction
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="sd__filter-bar">
            <span className="sd__filter-label">Overall Details</span>
            <div className="sd__filters">
              <Filter label="Location" k="location" /><Filter label="Plant" k="plant" />
              <Filter label="Module" k="module" /><Filter label="Instrument" k="instrument" />
            </div>
          </div>

          <div className="sd__stats">
            <div className="sd__stat sd__stat--1">
              <div className="sd__stat-icon-wrap sd__stat-icon-wrap--1">
                <i className="fa-regular fa-calendar-days" />
              </div>
              <div>
                <div className="sd__stat-val">13124</div>
                <div className="sd__stat-lbl">Open Exceptions</div>
              </div>
            </div>
            <div className="sd__stat sd__stat--2">
              <div className="sd__stat-icon-wrap sd__stat-icon-wrap--2">
                <i className="fa-regular fa-calendar-days" />
              </div>
              <div>
                <div className="sd__stat-val">898</div>
                <div className="sd__stat-lbl">Pending more than 10 days</div>
              </div>
            </div>
            <div className="sd__stat sd__stat--3">
              <div className="sd__stat-icon-wrap sd__stat-icon-wrap--3">
                <i className="fa-regular fa-calendar-days" />
              </div>
              <div>
                <div className="sd__stat-val">67</div>
                <div className="sd__stat-lbl">New Checkpoints Identified</div>
              </div>
            </div>
          </div>

          <div className="sd__datepicker-row">
            <div className="sd__datepicker" onClick={() => dateRef.current?.showPicker()}>
              <span className="sd__datepicker-text">{formatDate(dateVal)}</span>
              <i className="fa-regular fa-calendar" />
              <input ref={dateRef} type="date" className="sd__datepicker-input"
                value={dateVal} onChange={e => setDateVal(e.target.value)} />
            </div>
          </div>

          <div className="sd__panels">
            <div className="sd__panel">
              <div className="sd__panel-title">Date</div>
              <BubbleChart />
            </div>
            <div className="sd__panel">
              <div className="sd__panel-title">Exception Trend</div>
              <div className="trend-wrap">
                <div className="trend-vals-row">
                  <div className="trend-val-block">
                    <span className="trend-val">345</span>
                    <span className="trend-arrow trend-arrow--up">↑</span>
                  </div>
                  <div className="trend-val-block">
                    <span className="trend-val">023</span>
                    <span className="trend-arrow trend-arrow--down">↓</span>
                  </div>
                </div>
                <LineGraph />
                <div className="trend-legend">
                  <span className="trend-legend-item"><span className="tl-dot" style={{background:'#06d6a0'}} /> Open</span>
                  <span className="trend-legend-item"><span className="tl-dot" style={{background:'#ef4444'}} /> Closed</span>
                </div>
              </div>
            </div>
            <div className="sd__panel">
              <div className="sd__panel-title">Critical Alerts</div>
              <div className="alerts-list">
                {ALERTS.map((a, i) => (
                  <div key={i} className={`alert-row alert-row--${a.tagCls.replace('tag--','')}`}>
                    <div className="alert-row__left">
                      <div className="alert-row__id">{a.id}</div>
                      <span className="alert-row__sep">•</span>
                      <div className="alert-row__desc">{a.desc}</div>
                    </div>
                    <span className={`tag ${a.tagCls}`}>{a.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sd__table-section">
            <div className="sd__table-header">
              <div className="sd__table-title">Available Instruments</div>
              <div className="sd__table-search">
                <i className="fa-solid fa-magnifying-glass sd__table-search-icon" />
                <input className="sd__table-search-input" placeholder="Search instruments..."
                  value={tableSearch} onChange={e => { setTableSearch(e.target.value); setPage(1); }} />
                {tableSearch && <i className="fa-solid fa-xmark sd__table-search-clear"
                  onClick={() => { setTableSearch(''); setPage(1); }} />}
              </div>
            </div>
            <div className="sd__table-wrap">
              <table className="sd__table">
                <thead><tr>
                  <th>Module</th><th>Location</th><th>Instrument</th>
                  <th>Lost Run</th><th>Agent</th><th>Central Service</th>
                </tr></thead>
                <tbody>
                  {pageData.map(row => (
                    <tr key={row.id}>
                      <td>{row.module}</td><td>{row.location}</td><td>{row.instrument}</td>
                      <td className="sd__mono">{row.lostRun}</td>
                      <td><span className="sd__dot" /></td>
                      <td><span className="sd__dot" /></td>
                    </tr>
                  ))}
                  {pageData.length === 0 && (
                    <tr><td colSpan={6} style={{textAlign:'center',padding:'20px',color:'#9ca3af'}}>
                      No instruments match "{tableSearch}"
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <div className="pagination__left">
                <select className="pagination__size" value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                  {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="pagination__label">Show on page</span>
              </div>
              <div className="pagination__right">
                <span className="pagination__label">Page</span>
                <button className="pagination__arrow" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹</button>
                <PagePills />
                <button className="pagination__arrow" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transaction' && (
        <div className="sd__transaction">
          <div className="txn-card">
            <div className="txn-card__icon"><i className="fa-solid fa-file-lines" /></div>
            <div className="txn-card__body">
              <div className="txn-card__title">Audit Trail</div>
              <div className="txn-card__sub">View complete system audit logs and activity history</div>
            </div>
            <i className="fa-solid fa-chevron-right txn-card__arrow" />
          </div>
          <div className="txn-card">
            <div className="txn-card__icon txn-card__icon--blue"><i className="fa-solid fa-magnifying-glass" /></div>
            <div className="txn-card__body">
              <div className="txn-card__title">Search Audit Trail</div>
              <div className="txn-card__sub">Search and filter audit records by date, user or action</div>
            </div>
            <i className="fa-solid fa-chevron-right txn-card__arrow" />
          </div>
          <div className="txn-card">
            <div className="txn-card__icon txn-card__icon--green"><i className="fa-solid fa-chart-bar" /></div>
            <div className="txn-card__body">
              <div className="txn-card__title">Reports</div>
              <div className="txn-card__sub">Generate and export system reports and summaries</div>
            </div>
            <i className="fa-solid fa-chevron-right txn-card__arrow" />
          </div>
        </div>
      )}

    </div>
  );
}