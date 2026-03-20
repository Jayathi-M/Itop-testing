import { useState } from 'react';
import './Workflow.css';

/* ─────────── Data ─────────── */
const PATH_OPTIONS = ['2024\\2025_New','2024\\2025_New\\MAR_2024','2024\\2025_New\\APR_2024','2023\\2024_Archive'];
const STATUS_OPTIONS = ['Queue','Pending for L1','Completed','Cancelled'];

const ALL_ROWS = [
  { id:1,  pickedAt:'18-03-2026 14:30:08', path:'2024\\2025_New',           name:'123',                   instrId:'-',  sampleSetId:32,   reviewedBy:'Service', status:'Queue'    },
  { id:2,  pickedAt:'23-12-2025 14:29:45', path:'2024\\2025_New\\MAR_2024', name:'PIRF_RS_145_070324_01', instrId:'-',  sampleSetId:2942, reviewedBy:'Service', status:'Cancelled'},
  { id:3,  pickedAt:'10-02-2026 09:15:00', path:'2024\\2025_New',           name:'BATCH_QC_031',          instrId:'E1', sampleSetId:105,  reviewedBy:'A.Sharma',status:'Completed'},
  { id:4,  pickedAt:'05-03-2026 11:45:22', path:'2024\\2025_New\\APR_2024', name:'RUN_APR_001',           instrId:'E2', sampleSetId:210,  reviewedBy:'R.Kumar', status:'Pending'  },
  { id:5,  pickedAt:'12-01-2026 08:00:55', path:'2023\\2024_Archive',       name:'ARCH_JAN_QC',           instrId:'E1', sampleSetId:78,   reviewedBy:'Service', status:'Queue'    },
  { id:6,  pickedAt:'28-02-2026 16:10:33', path:'2024\\2025_New\\MAR_2024', name:'PIRF_RS_200_280226',    instrId:'-',  sampleSetId:3100, reviewedBy:'S.Mehta', status:'Cancelled'},
];

const STEP2_ROWS = [
  { id:1, name:'Testing',               jobId:'BCPID_2603201013', instrId:'TEst',  path:'2024\\2025_New',                    prodre:1, arNo:'12345678', batchNo:'23457', dateValidated:'20-03-2026 10:13:59', status:'Pending for L1' },
  { id:2, name:'FESO_DS_143_060324_01', jobId:'-',                instrId:'-',     path:'2025\\MAR_2024\\2025_Demo\\MAR_2024',prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:56', status:'Pending for L1' },
  { id:3, name:'FESO_RES_011_040324_01',jobId:'-',                instrId:'-',     path:'2025\\MAR_2024\\2025_Demo\\MAR_2024',prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:02', status:'Pending for L1' },
  { id:4, name:'RAME_CU_276_120324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New\\MAR_2024',           prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:30:15', status:'Pending for L1' },
  { id:5, name:'RAME_DS_268_110324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New\\MAR_2024',           prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:29:27', status:'Pending for L1' },
  { id:6, name:'PIRF_RS_145_070324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New',                    prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:05:33', status:'Pending for L1' },
];

const CHECKPOINTS = [
  { id:1, desc:'Pending for Sign-Off Level-1', reviewedBy:'chrom_dev', reviewedOn:'20-03-2026 10:13:59' },
  { id:2, desc:'Unprocessed Channels',         reviewedBy:'chrom_dev', reviewedOn:'20-03-2026 10:13:59' },
  { id:3, desc:'System Suitability - RSD',     reviewedBy:'chrom_dev', reviewedOn:'20-03-2026 10:13:59' },
  { id:4, desc:'Peak Tailing Factor',          reviewedBy:'chrom_dev', reviewedOn:'20-03-2026 10:13:59' },
];

const STEPS = [
  { label:'Sample Set Queue'   },
  { label:'Sample Set List'    },
  { label:'Sample Set Reports' },
];

const STATUS_CLS = {
  Queue:          'wf-status wf-status--queue',
  Cancelled:      'wf-status wf-status--cancelled',
  Completed:      'wf-status wf-status--completed',
  Pending:        'wf-status wf-status--pending',
  'Pending for L1':'wf-status wf-status--pending',
};

export default function WorkflowPage() {
  /* ── shared state ── */
  const [activeStep,    setActiveStep]    = useState(0);
  const [showMore,      setShowMore]      = useState(false);
  const [showDemand,    setShowDemand]    = useState(false);
  const [showManual,    setShowManual]    = useState(false);
  const [manualForm,    setManualForm]    = useState({ path:PATH_OPTIONS[0], name:'', sampleSetId:'' });
  const [manualError,   setManualError]   = useState({});
  const [addedRows,     setAddedRows]     = useState([]);
  /* step1 state */
  const [selPath,       setSelPath]       = useState(PATH_OPTIONS[0]);
  const [appliedPath,   setAppliedPath]   = useState('');
  const [search1,       setSearch1]       = useState('');
  const [pageSize1,     setPageSize1]     = useState(10);
  const [page1,         setPage1]         = useState(1);
  const [sortKey,       setSortKey]       = useState('id');
  const [sortDir,       setSortDir]       = useState('asc');
  /* step2 state */
  const [s2DateFrom,    setS2DateFrom]    = useState('01/01/2024');
  const [s2DateTo,      setS2DateTo]      = useState('03/20/2026');
  const [s2Path,        setS2Path]        = useState('');
  const [s2Status,      setS2Status]      = useState('');
  const [s2Search,      setS2Search]      = useState('');
  const [s2Rows,        setS2Rows]        = useState(100);
  /* step3 state */
  const [selectedSample,setSelectedSample]= useState(null);
  const [checkpoints,   setCheckpoints]   = useState(
    CHECKPOINTS.map(c => ({ ...c, exception:'', justification:'', furtherReview:'' }))
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitSuccess,   setSubmitSuccess]   = useState(false);

  /* ── helpers ── */
  function handleGo()    { setAppliedPath(selPath); setPage1(1); }
  function handleReset() { setSelPath(PATH_OPTIONS[0]); setAppliedPath(''); setPage1(1); setSearch1(''); }

  function handleSort(key) {
    if (sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function handleManualSave() {
    const errs = {};
    if (!manualForm.name.trim())        errs.name='Required';
    if (!manualForm.sampleSetId.trim()) errs.sampleSetId='Required';
    if (Object.keys(errs).length) { setManualError(errs); return; }
    setAddedRows(prev => [{
      id:Date.now(), pickedAt:new Date().toLocaleString('en-GB').replace(',',''),
      path:manualForm.path, name:manualForm.name.trim(), instrId:'-',
      sampleSetId:manualForm.sampleSetId.trim(), reviewedBy:'Service', status:'Queue',
    }, ...prev]);
    setManualForm({path:PATH_OPTIONS[0],name:'',sampleSetId:''});
    setManualError({});
    setShowManual(false); setShowDemand(false);
  }

  /* click on Sample Set Name → go to step 3 */
  function openSampleReport(row) {
    setSelectedSample(row);
    setActiveStep(2);
  }

  /* ── Step 1 filter/sort/page ── */
  let baseRows = [...ALL_ROWS];
  if (appliedPath) baseRows = baseRows.filter(r=>r.path.startsWith(appliedPath));
  if (search1.trim()) { const q=search1.toLowerCase(); baseRows=baseRows.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q))); }
  baseRows = baseRows.sort((a,b)=>{ const cmp=String(a[sortKey]).localeCompare(String(b[sortKey]),undefined,{numeric:true}); return sortDir==='asc'?cmp:-cmp; });
  let pinnedRows=[...addedRows];
  if (appliedPath) pinnedRows=pinnedRows.filter(r=>r.path.startsWith(appliedPath));
  const rows1 = [...pinnedRows,...baseRows];
  const total1=rows1.length, totalPages1=Math.max(1,Math.ceil(total1/pageSize1)), safePage1=Math.min(page1,totalPages1);
  const paged1=rows1.slice((safePage1-1)*pageSize1,safePage1*pageSize1);

  /* ── Step 2 filter ── */
  let rows2=[...STEP2_ROWS];
  if (s2Path)   rows2=rows2.filter(r=>r.path.includes(s2Path));
  if (s2Status) rows2=rows2.filter(r=>r.status===s2Status);
  if (s2Search.trim()) { const q=s2Search.toLowerCase(); rows2=rows2.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q))); }
  const reviewed2=rows2.filter(r=>r.status==='Completed').length;
  const pending2 =rows2.filter(r=>r.status==='Pending for L1').length;

  function handleS3Submit() {
    setSubmitAttempted(true);
    setSubmitSuccess(false);
    const allFilled = checkpoints.every(cp => cp.justification.trim());
    if (allFilled) {
      setSubmitSuccess(true);
      setSubmitAttempted(false);
    }
  }

  function SortIcon({k}) {
    if (sortKey!==k) return <span className="wf-sort-icon">⇅</span>;
    return <span className="wf-sort-icon wf-sort-icon--on">{sortDir==='asc'?'↑':'↓'}</span>;
  }

  /* ══════════════════════════
     RENDER
  ══════════════════════════ */
  return (
    <div className="wf-page">

      {/* ── Top bar ── */}
      <div className="wf-topbar">
        <div className="wf-topbar__tabs">
          <button className="wf-toptab wf-toptab--active">
            <i className="fa-solid fa-house wf-toptab__icon" /> CDS
          </button>
        </div>
        <div className="wf-topbar__right">
          <div className="wf-dropdown-pill"><span>Empower</span><i className="fa-solid fa-chevron-down"/></div>
          <div className="wf-dropdown-pill"><span>Batch Audit Trail Revi...</span><i className="fa-solid fa-chevron-down"/></div>
        </div>
      </div>

      {/* ── Step bar ── */}
      <div className="wf-stepbar-row">
        <div className="wf-stepbar">
          {STEPS.map((s,i)=>(
            <div key={i} className="wf-step-slot">
              {i>0 && <div className={`wf-connector ${activeStep>i?'wf-connector--done':''}`}/>}
              <div className={`wf-step-item ${activeStep===i?'wf-step-item--active':''} ${activeStep>i?'wf-step-item--done':''}`}
                onClick={()=>setActiveStep(i)}>
                <div className="wf-step-bubble">{activeStep>i?'✓':i+1}</div>
                <span className="wf-step-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="wf-more-btn" onClick={()=>setShowMore(p=>!p)}>
          <i className="fa-solid fa-table-cells-large"/> More
        </button>
      </div>

      {/* ════════════════════════════════
          STEP 1 — Sample Set Queue
      ════════════════════════════════ */}
      {activeStep===0 && (<>
        <div className="wf-actions-bar">
          <button className="wf-demand-btn" onClick={()=>setShowDemand(true)}>
            <i className="fa-solid fa-circle-plus"/> On Demand Request
          </button>
        </div>

        <div className="wf-filter-card">
          <div className="wf-filter-label">SELECT SAMPLE SET PATH</div>
          <div className="wf-filter-row">
            <div className="wf-select-wrap">
              <select className="wf-select" value={selPath} onChange={e=>setSelPath(e.target.value)}>
                {PATH_OPTIONS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down wf-select-arrow"/>
            </div>
            <button className="wf-btn wf-btn--go" onClick={handleGo}><i className="fa-solid fa-magnifying-glass"/> Go</button>
            <button className="wf-btn wf-btn--reset" onClick={handleReset}><i className="fa-solid fa-rotate-left"/> Reset</button>
          </div>
        </div>

        <div className="wf-table-card">
          <div className="wf-table-header">
            <div className="wf-table-header__left"><i className="fa-solid fa-table-list wf-table-icon"/><span className="wf-table-title">Sample Set Queue</span></div>
            <span className="wf-live-tag">Live queue data</span>
          </div>
          <div className="wf-controls">
            <div className="wf-controls__left">
              <select className="wf-page-size" value={pageSize1} onChange={e=>{setPageSize1(Number(e.target.value));setPage1(1);}}>
                {[5,10,20,50].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              <span className="wf-controls__label">entries per page</span>
            </div>
            <div className="wf-controls__right">
              <span className="wf-controls__label">Search:</span>
              <input className="wf-search-input" value={search1} onChange={e=>{setSearch1(e.target.value);setPage1(1);}}/>
            </div>
          </div>
          <div className="wf-table-wrap">
            <table className="wf-table">
              <thead>
                <tr>
                  {[['id','S.No.'],['pickedAt','Sampleset Picked Date/Time'],['path','Sampleset Path'],['name','Sampleset Name'],['instrId','Instrument ID'],['sampleSetId','Sample Set ID'],['reviewedBy','Reviewed By'],['status','Current Status']].map(([k,l])=>(
                    <th key={k} className="wf-th--sortable" onClick={()=>handleSort(k)}>{l}<SortIcon k={k}/></th>
                  ))}
                </tr>
                <tr className="wf-thead-sub">{Array(8).fill(null).map((_,i)=><th key={i}><span className="wf-sub-arrow" onClick={()=>{}}>↑</span></th>)}</tr>
              </thead>
              <tbody>
                {paged1.length===0?(<tr><td colSpan={8} className="wf-empty">No entries found.</td></tr>)
                :paged1.map((row,idx)=>(
                  <tr key={row.id} className="wf-tr">
                    <td>{(safePage1-1)*pageSize1+idx+1}</td>
                    <td className="wf-mono">{row.pickedAt}</td>
                    <td>{row.path}</td>
                    <td>{row.name}</td>
                    <td className="wf-center">{row.instrId}</td>
                    <td className="wf-center">{row.sampleSetId}</td>
                    <td>{row.reviewedBy}</td>
                    <td><span className={STATUS_CLS[row.status]||'wf-status'}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wf-footer">
            <span className="wf-footer__info">{total1===0?'No entries':`Showing ${(safePage1-1)*pageSize1+1} to ${Math.min(safePage1*pageSize1,total1)} of ${total1} entries`}</span>
            <div className="wf-pagination">
              <button className="wf-pg-btn" onClick={()=>setPage1(1)} disabled={safePage1===1}>«</button>
              <button className="wf-pg-btn" onClick={()=>setPage1(p=>Math.max(1,p-1))} disabled={safePage1===1}>‹</button>
              {Array.from({length:totalPages1},(_,i)=>i+1).map(p=>(
                <button key={p} className={`wf-pg-btn${safePage1===p?' wf-pg-btn--active':''}`} onClick={()=>setPage1(p)}>{p}</button>
              ))}
              <button className="wf-pg-btn" onClick={()=>setPage1(p=>Math.min(totalPages1,p+1))} disabled={safePage1===totalPages1}>›</button>
              <button className="wf-pg-btn" onClick={()=>setPage1(totalPages1)} disabled={safePage1===totalPages1}>»</button>
            </div>
          </div>
        </div>
      </>)}

      {/* ════════════════════════════════
          STEP 2 — Sample Set List
      ════════════════════════════════ */}
      {activeStep===1 && (<>
        <div className="wf-filter-card">
          <div className="wf-filter-row wf-filter-row--multi">
            {/* Date range */}
            <div className="wf-filter-group">
              <div className="wf-filter-label">DATE RANGE</div>
              <div className="wf-date-range">
                <div className="wf-date-input-wrap">
                  <span className="wf-date-label">FROM</span>
                  <div className="wf-date-input">
                    <i className="fa-regular fa-calendar wf-date-icon"/>
                    <input type="text" value={s2DateFrom} onChange={e=>setS2DateFrom(e.target.value)} className="wf-date-field"/>
                    <i className="fa-solid fa-chevron-down wf-date-arrow"/>
                  </div>
                </div>
                <span className="wf-date-sep">→</span>
                <div className="wf-date-input-wrap">
                  <span className="wf-date-label">TO</span>
                  <div className="wf-date-input">
                    <input type="text" value={s2DateTo} onChange={e=>setS2DateTo(e.target.value)} className="wf-date-field"/>
                    <i className="fa-solid fa-chevron-down wf-date-arrow"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Set Path */}
            <div className="wf-filter-group">
              <div className="wf-filter-label">SAMPLE SET PATH</div>
              <div className="wf-select-wrap wf-select-wrap--wide">
                <select className="wf-select" value={s2Path} onChange={e=>setS2Path(e.target.value)}>
                  <option value="">Select</option>
                  {PATH_OPTIONS.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>

            {/* Status */}
            <div className="wf-filter-group">
              <div className="wf-filter-label">STATUS</div>
              <div className="wf-select-wrap">
                <select className="wf-select" value={s2Status} onChange={e=>setS2Status(e.target.value)}>
                  <option value="">Select</option>
                  {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>

            {/* Buttons */}
            <div className="wf-filter-group wf-filter-group--btns">
              <button className="wf-btn wf-btn--go"><i className="fa-solid fa-magnifying-glass"/> Search</button>
              <button className="wf-btn wf-btn--reset"><i className="fa-solid fa-rotate-left"/> Reset</button>
              <button className="wf-btn wf-btn--excel"><i className="fa-solid fa-file-excel"/> Excel</button>
              <button className="wf-btn wf-btn--pdf"><i className="fa-solid fa-file-pdf"/> PDF</button>
            </div>
          </div>
        </div>

        <div className="wf-table-card">
          <div className="wf-controls wf-controls--s2">
            <div className="wf-controls__left">
              <span className="wf-controls__label">Rows</span>
              <select className="wf-page-size" value={s2Rows} onChange={e=>setS2Rows(Number(e.target.value))}>
                {[10,25,50,100].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              <span className="s2-badge s2-badge--total">Sample Sets Total <b>{rows2.length}</b></span>
              <span className="s2-badge s2-badge--reviewed">Reviewed <b>{reviewed2}</b></span>
              <span className="s2-badge s2-badge--pending">Pending <b>{pending2}</b></span>
            </div>
            <div className="wf-controls__right">
              <input className="wf-search-input" placeholder="Search..." value={s2Search} onChange={e=>setS2Search(e.target.value)}/>
              <button className="wf-icon-btn"><i className="fa-solid fa-magnifying-glass"/></button>
              <button className="wf-icon-btn"><i className="fa-solid fa-rotate-left"/></button>
            </div>
          </div>

          <div className="wf-table-wrap">
            <table className="wf-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>SAMPLE SET NAME</th>
                  <th>JOB ID</th>
                  <th>INSTRUMENT ID</th>
                  <th>SAMPLE SET PATH</th>
                  <th>PRODRE VERSION</th>
                  <th>AR_NO</th>
                  <th>BATCH_NO</th>
                  <th>DATE VALIDATED ON</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {rows2.length===0?(<tr><td colSpan={10} className="wf-empty">No entries found.</td></tr>)
                :rows2.map((row,idx)=>(
                  <tr key={row.id} className="wf-tr">
                    <td>{idx+1}</td>
                    <td>
                      <span className="wf-link" onClick={()=>openSampleReport(row)}>
                        {row.name}
                      </span>
                    </td>
                    <td>{row.jobId}</td>
                    <td>{row.instrId}</td>
                    <td className="wf-path-cell">{row.path}</td>
                    <td className="wf-center">{row.prodre}</td>
                    <td>{row.arNo}</td>
                    <td>{row.batchNo}</td>
                    <td className="wf-mono">{row.dateValidated}</td>
                    <td><span className={STATUS_CLS[row.status]||'wf-status'}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* ════════════════════════════════
          STEP 3 — Sample Set Reports
      ════════════════════════════════ */}
      {activeStep===2 && (<>
        <div className="s3-topbar">
          <button className="wf-btn wf-btn--unlock"><i className="fa-solid fa-lock-open"/> Unlock Checklist</button>
          <button className="wf-btn wf-btn--pdf"><i className="fa-solid fa-file-pdf"/> PDF</button>
        </div>

        {/* Filters row */}
        <div className="wf-filter-card">
          <div className="s3-filter-row">
            <div className="s3-filter-field">
              <label className="s3-filter-label"><i className="fa-regular fa-folder"/> Sample Set Path *</label>
              <div className="wf-select-wrap">
                <select className="wf-select" defaultValue={selectedSample?.path||PATH_OPTIONS[0]}>
                  {PATH_OPTIONS.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>
            <div className="s3-filter-field">
              <label className="s3-filter-label"><i className="fa-solid fa-pen"/> Sample Set Name</label>
              <input className="wf-select" defaultValue={selectedSample?.name||''} readOnly/>
            </div>
            <div className="s3-filter-field">
              <label className="s3-filter-label"><i className="fa-regular fa-copy"/> Sample Set Id(s)</label>
              <div className="wf-select-wrap">
                <select className="wf-select">
                  <option value="1">1</option>
                </select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>
            <div className="s3-filter-field">
              <label className="s3-filter-label"><i className="fa-solid fa-layer-group"/> PRODRE Version</label>
              <div className="wf-select-wrap">
                <select className="wf-select"><option>1</option></select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>
            <div className="s3-filter-field">
              <label className="s3-filter-label"><i className="fa-solid fa-microscope"/> Instrument ID</label>
              <input className="wf-select" defaultValue={selectedSample?.instrId||'TEst'} readOnly/>
            </div>
            <button className="wf-btn wf-btn--go s3-go-btn"><i className="fa-solid fa-magnifying-glass"/> Go</button>
          </div>
        </div>

        {/* Reports table */}
        <div className="wf-table-card">
          <div className="wf-table-header">
            <div className="wf-table-header__left">
              <i className="fa-solid fa-file-lines wf-table-icon"/>
              <span className="wf-table-title">Sample Set Reports</span>
            </div>
          </div>
          <div className="wf-table-wrap">
            <table className="wf-table s3-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>CHECKPOINT DESCRIPTION</th>
                  <th>EXCEPTION</th>
                  <th>JUSTIFICATION *</th>
                  <th>FURTHER REVIEW REQUIRED</th>
                  <th>INFO</th>
                  <th>HISTORY</th>
                  <th>REVIEWED BY</th>
                  <th>REVIEWED ON</th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp,idx)=>(
                  <tr key={cp.id} className={`wf-tr s3-tr ${submitAttempted && !cp.justification.trim() ? 's3-tr--error' : ''}`}>
                    <td>{idx+1}</td>
                    <td className="s3-desc-cell">{cp.desc}</td>
                    <td>
                      <div className="s3-radio-group">
                        <label className="s3-radio"><input type="radio" name={`ex-${cp.id}`} value="yes" checked={cp.exception==='yes'} onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,exception:'yes'}:r))}/> Yes</label>
                        <label className="s3-radio"><input type="radio" name={`ex-${cp.id}`} value="no"  checked={cp.exception==='no'}  onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,exception:'no'}:r))}/> No</label>
                      </div>
                    </td>
                    <td className="s3-justification-cell">
                      <textarea
                        className={`s3-textarea ${submitAttempted && !cp.justification.trim() ? 's3-textarea--error' : ''}`}
                        rows={3}
                        placeholder="Enter justification..."
                        value={cp.justification}
                        onChange={e=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,justification:e.target.value}:r))}
                      />
                      {submitAttempted && !cp.justification.trim() && (
                        <span className="s3-field-err">⚠ Justification is required</span>
                      )}
                    </td>
                    <td>
                      <div className="s3-radio-group">
                        <label className="s3-radio"><input type="radio" name={`fr-${cp.id}`} value="yes" checked={cp.furtherReview==='yes'} onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,furtherReview:'yes'}:r))}/> Yes</label>
                        <label className="s3-radio"><input type="radio" name={`fr-${cp.id}`} value="no"  checked={cp.furtherReview==='no'}  onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,furtherReview:'no'}:r))}/> No</label>
                      </div>
                    </td>
                    <td className="wf-center"><button className="s3-icon-btn"><i className="fa-regular fa-eye"/></button></td>
                    <td className="wf-center"><button className="s3-icon-btn"><i className="fa-solid fa-clock-rotate-left"/></button></td>
                    <td><span className="wf-link">{cp.reviewedBy}</span></td>
                    <td className="wf-mono">{cp.reviewedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit section */}
          <div className="s3-submit-section">
            {submitAttempted && checkpoints.some(cp => !cp.justification.trim()) && (
              <div className="s3-warning-box">
                <i className="fa-solid fa-triangle-exclamation"/> 
                Please fill in all required Justification fields before submitting.
              </div>
            )}
            {submitSuccess && (
              <div className="s3-success-box">
                <i className="fa-solid fa-circle-check"/> Report submitted successfully!
              </div>
            )}
            <button className="s3-submit-btn" onClick={handleS3Submit}>
              <i className="fa-solid fa-paper-plane"/> Submit
            </button>
          </div>
        </div>
      </>)}

      {/* ══ MODAL 1 — On Demand Request ══ */}
      {showDemand && (
        <div className="wf-modal-backdrop" onClick={()=>setShowDemand(false)}>
          <div className="wf-modal" onClick={e=>e.stopPropagation()}>
            <div className="wf-modal__header">
              <h3 className="wf-modal__title">On Demand Request</h3>
              <button className="wf-modal__close" onClick={()=>setShowDemand(false)}>✕</button>
            </div>
            <div className="wf-modal__body">
              <div className="wf-demand-table-wrap">
                <table className="wf-demand-table">
                  <thead><tr><th>Action</th><th>Sample Set Path</th><th>Sample Set Name</th><th>Sample Set Id</th></tr></thead>
                  <tbody><tr><td colSpan={4} className="wf-demand-empty">No data available</td></tr></tbody>
                </table>
              </div>
            </div>
            <div className="wf-modal__footer">
              <button className="wf-modal__add-btn" onClick={()=>setShowManual(true)}>Add Manually</button>
              <button className="wf-modal__queue-btn" onClick={()=>setShowDemand(false)}>Add To Queue</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL 2 — Add Manually ══ */}
      {showManual && (
        <div className="wf-modal-backdrop" onClick={()=>setShowManual(false)}>
          <div className="wf-modal wf-modal--sm" onClick={e=>e.stopPropagation()}>
            <div className="wf-modal__header">
              <h3 className="wf-modal__title">On Demand Request</h3>
              <button className="wf-modal__close" onClick={()=>setShowManual(false)}>✕</button>
            </div>
            <div className="wf-modal__body">
              <div className="wf-manual-form">
                <div className="wf-manual-field">
                  <label className="wf-manual-label">Sample Set Path *</label>
                  <select className="wf-manual-select" value={manualForm.path} onChange={e=>setManualForm(p=>({...p,path:e.target.value}))}>
                    {PATH_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="wf-manual-field">
                  <label className="wf-manual-label">Sample Set Name *</label>
                  <input className={`wf-manual-input${manualError.name?' wf-manual-input--err':''}`} placeholder="Enter SampleSet name" value={manualForm.name} onChange={e=>{setManualForm(p=>({...p,name:e.target.value}));setManualError(p=>({...p,name:''}));}}/>
                  {manualError.name && <span className="wf-manual-err">{manualError.name}</span>}
                </div>
                <div className="wf-manual-field">
                  <label className="wf-manual-label">Sample Set ID *</label>
                  <input className={`wf-manual-input${manualError.sampleSetId?' wf-manual-input--err':''}`} placeholder="Enter SampleSet Id" value={manualForm.sampleSetId} onChange={e=>{setManualForm(p=>({...p,sampleSetId:e.target.value}));setManualError(p=>({...p,sampleSetId:''}));}}/>
                  {manualError.sampleSetId && <span className="wf-manual-err">{manualError.sampleSetId}</span>}
                </div>
              </div>
            </div>
            <div className="wf-modal__footer">
              <button className="wf-modal__save-btn" onClick={handleManualSave}>Save/Add To Queue</button>
            </div>
          </div>
        </div>
      )}

      {/* ── More panel ── */}
      {showMore && (<>
        <div className="wf-more-backdrop" onClick={()=>setShowMore(false)}/>
        <div className="wf-more-panel">
          <div className="wf-more-panel__header">
            <div className="wf-more-panel__title"><i className="fa-solid fa-asterisk wf-more-panel__star"/> Tools & Navigation</div>
            <button className="wf-more-panel__close" onClick={()=>setShowMore(false)}>✕</button>
          </div>
          <div className="wf-more-grid">
            {[
              {icon:'fa-list-check',icon2:'fa-solid',label:'Jobs',           bg:'#fef9c3',color:'#ca8a04'},
              {icon:'fa-microchip',              label:'Assets',         bg:'#dcfce7',color:'#16a34a'},
              {icon:'fa-triangle-exclamation',   label:'Exception List', bg:'#fee2e2',color:'#dc2626'},
              {icon:'fa-shield-halved',          label:'BCP',            bg:'#ede9fe',color:'#7c3aed'},
            ].map(item=>(
              <div key={item.label} className="wf-more-tile" onClick={()=>setShowMore(false)}>
                <div className="wf-more-tile__icon" style={{background:item.bg}}>
                  <i className={`fa-solid ${item.icon}`} style={{color:item.color}}/>
                </div>
                <span className="wf-more-tile__label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </>)}

    </div>
  );
}