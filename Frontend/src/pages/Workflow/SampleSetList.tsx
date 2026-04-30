// import { useState } from 'react'
// import '../Workflow.css'

// interface Step2Row {
//   id: number
//   name: string
//   jobId: string
//   instrId: string
//   path: string
//   prodre: number
//   arNo: string
//   batchNo: string
//   dateValidated: string
//   status: string
// }

// const PATH_OPTIONS    = ['2024\\2025_New','2024\\2025_New\\MAR_2024','2024\\2025_New\\APR_2024','2023\\2024_Archive']
// const STATUS_OPTIONS  = ['Queue','Pending for L1','Completed','Cancelled']

// const STEP2_ROWS: Step2Row[] = [
//   { id:1, name:'Testing',               jobId:'BCPID_2603201013', instrId:'TEst', path:'2024\\2025_New',                     prodre:1, arNo:'12345678', batchNo:'23457', dateValidated:'20-03-2026 10:13:59', status:'Pending for L1' },
//   { id:2, name:'FESO_DS_143_060324_01', jobId:'-',                instrId:'-',    path:'2025\\MAR_2024\\2025_Demo\\MAR_2024', prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:56', status:'Pending for L1' },
//   { id:3, name:'FESO_RES_011_040324_01',jobId:'-',                instrId:'-',    path:'2025\\MAR_2024\\2025_Demo\\MAR_2024', prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:02', status:'Pending for L1' },
//   { id:4, name:'RAME_CU_276_120324_01', jobId:'-',                instrId:'-',    path:'2024\\2025_New\\MAR_2024',            prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:30:15', status:'Pending for L1' },
//   { id:5, name:'RAME_DS_268_110324_01', jobId:'-',                instrId:'-',    path:'2024\\2025_New\\MAR_2024',            prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:29:27', status:'Pending for L1' },
//   { id:6, name:'PIRF_RS_145_070324_01', jobId:'-',                instrId:'-',    path:'2024\\2025_New',                     prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:05:33', status:'Pending for L1' },
// ]

// const STATUS_CLS: Record<string, string> = {
//   Queue:            'wf-status wf-status--queue',
//   Cancelled:        'wf-status wf-status--cancelled',
//   Completed:        'wf-status wf-status--completed',
//   Pending:          'wf-status wf-status--pending',
//   'Pending for L1': 'wf-status wf-status--pending',
// }

// interface Props {
//   onSelectSample: (row: Step2Row) => void
//   checkpoints: any[]
//   setCheckpoints: (c: any[]) => void
// }

// const BASE_CHECKPOINTS = [
//   { id:1,  desc:'Pending for Sign-Off Level-1',                                                              reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
//   { id:2,  desc:'Unprocessed Channels',                                                                      reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
//   { id:3,  desc:'System Suitability - RSD',                                                                  reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
//   { id:4,  desc:'Peak Tailing Factor',                                                                       reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
//   { id:5,  desc:'Sample Set Finished Date incomplete',                                                       reviewedBy:'', reviewedOn:'' },
//   { id:6,  desc:'There are no Major breaks in the acquisition times',                                        reviewedBy:'system', reviewedOn:'' },
//   { id:7,  desc:'All the samples and standards are processed with the same processing method',               reviewedBy:'', reviewedOn:'' },
//   { id:8,  desc:'Channels marked as Manually integrated',                                                    reviewedBy:'', reviewedOn:'' },
//   { id:9,  desc:'Incomplete Data/ Missing Data/ Data File incomplete entries',                               reviewedBy:'system', reviewedOn:'' },
//   { id:10, desc:'Single injections (Not associated with any sample set)',                                    reviewedBy:'', reviewedOn:'' },
//   { id:11, desc:'Any Entry related to Deletion in the Project Audit trail',                                  reviewedBy:'', reviewedOn:'' },
//   { id:12, desc:'There are no duplicate sample sets created for the same AR_No + Batch_No Combination',      reviewedBy:'', reviewedOn:'' },
//   { id:13, desc:'Altered Sample Set',                                                                        reviewedBy:'', reviewedOn:'' },
//   { id:14, desc:'Renamed Sample Set',                                                                        reviewedBy:'system', reviewedOn:'' },
//   { id:15, desc:'Unlocked Channels Of Sample Set',                                                          reviewedBy:'', reviewedOn:'' },
//   { id:16, desc:'Sample set channels processed within 48 hours',                                             reviewedBy:'', reviewedOn:'' },
//   { id:17, desc:'Aborted Sample Set',                                                                        reviewedBy:'system', reviewedOn:'' },
//   { id:18, desc:'Reprocessed Results',                                                                       reviewedBy:'', reviewedOn:'' },
//   { id:19, desc:'No of injections and results',                                                              reviewedBy:'sysstem', reviewedOn:'' },
// ]

// export default function SampleSetList({ onSelectSample, checkpoints, setCheckpoints }: Props) {
//   const [s2DateFrom, setS2DateFrom] = useState('01/01/2024')
//   const [s2DateTo,   setS2DateTo]   = useState('03/20/2026')
//   const [s2Path,     setS2Path]     = useState('')
//   const [s2Status,   setS2Status]   = useState('')
//   const [s2Search,   setS2Search]   = useState('')
//   const [s2Rows,     setS2Rows]     = useState(100)

//   let rows2 = [...STEP2_ROWS]
//   if (s2Path)   rows2 = rows2.filter(r => r.path.includes(s2Path))
//   if (s2Status) rows2 = rows2.filter(r => r.status === s2Status)
//   if (s2Search.trim()) { const q = s2Search.toLowerCase(); rows2 = rows2.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q))) }

//   const reviewed2 = rows2.filter(r => r.status === 'Completed').length
//   const pending2  = rows2.filter(r => r.status === 'Pending for L1').length

//   function handleOpenReview(row: Step2Row) {
//     if (!checkpoints.length) {
//       const cps = BASE_CHECKPOINTS.map((c, i) => {
//         const exc = i < 6 ? 'yes' : 'no'
//         return { ...c, exception: exc, justification: '', furtherReview: exc === 'yes' ? 'yes' : 'no' }
//       })
//       setCheckpoints(cps)
//     }
//     onSelectSample(row)
//   }

//   return (
//     <div className="wf-page">
//       <div className="wf-filter-card">
//         <div className="wf-filter-row wf-filter-row--multi">
//           <div className="wf-filter-group">
//             <div className="wf-filter-label">DATE RANGE</div>
//             <div className="wf-date-range">
//               <div className="wf-date-input-wrap">
//                 <span className="wf-date-label">FROM</span>
//                 <div className="wf-date-input">
//                   <i className="fa-regular fa-calendar wf-date-icon" />
//                   <input type="text" value={s2DateFrom} onChange={e => setS2DateFrom(e.target.value)} className="wf-date-field" />
//                   <i className="fa-solid fa-chevron-down wf-date-arrow" />
//                 </div>
//               </div>
//               <span className="wf-date-sep">→</span>
//               <div className="wf-date-input-wrap">
//                 <span className="wf-date-label">TO</span>
//                 <div className="wf-date-input">
//                   <input type="text" value={s2DateTo} onChange={e => setS2DateTo(e.target.value)} className="wf-date-field" />
//                   <i className="fa-solid fa-chevron-down wf-date-arrow" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="wf-filter-group">
//             <div className="wf-filter-label">SAMPLE SET PATH</div>
//             <div className="wf-select-wrap wf-select-wrap--wide">
//               <select className="wf-select" value={s2Path} onChange={e => setS2Path(e.target.value)}>
//                 <option value="">Select</option>
//                 {PATH_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
//               </select>
//               <i className="fa-solid fa-chevron-down wf-select-arrow" />
//             </div>
//           </div>
//           <div className="wf-filter-group">
//             <div className="wf-filter-label">STATUS</div>
//             <div className="wf-select-wrap">
//               <select className="wf-select" value={s2Status} onChange={e => setS2Status(e.target.value)}>
//                 <option value="">Select</option>
//                 {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//               <i className="fa-solid fa-chevron-down wf-select-arrow" />
//             </div>
//           </div>
//           <div className="wf-filter-group wf-filter-group--btns">
//             <button className="wf-btn wf-btn--go"><i className="fa-solid fa-magnifying-glass" /> Search</button>
//             <button className="wf-btn wf-btn--reset"><i className="fa-solid fa-rotate-left" /> Reset</button>
//             <button className="wf-btn wf-btn--excel"><i className="fa-solid fa-file-excel" /> Excel</button>
//             <button className="wf-btn wf-btn--pdf"><i className="fa-solid fa-file-pdf" /> PDF</button>
//           </div>
//         </div>
//       </div>

//       <div className="wf-table-card">
//         <div className="wf-controls wf-controls--s2">
//           <div className="wf-controls__left">
//             <span className="wf-controls__label">Rows</span>
//             <select className="wf-page-size" value={s2Rows} onChange={e => setS2Rows(Number(e.target.value))}>
//               {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
//             </select>
//             <span className="s2-badge s2-badge--total">Sample Sets Total <b>{rows2.length}</b></span>
//             <span className="s2-badge s2-badge--reviewed">Reviewed <b>{reviewed2}</b></span>
//             <span className="s2-badge s2-badge--pending">Pending <b>{pending2}</b></span>
//           </div>
//           <div className="wf-controls__right">
//             <input className="wf-search-input" placeholder="Search..." value={s2Search} onChange={e => setS2Search(e.target.value)} />
//             <button className="wf-icon-btn"><i className="fa-solid fa-magnifying-glass" /></button>
//             <button className="wf-icon-btn"><i className="fa-solid fa-rotate-left" /></button>
//           </div>
//         </div>
//         <div className="wf-table-wrap">
//           <table className="wf-table">
//             <thead>
//               <tr>
//                 <th>S.NO.</th><th>SAMPLE SET NAME</th><th>JOB ID</th><th>INSTRUMENT ID</th>
//                 <th>SAMPLE SET PATH</th><th>PRODRE VERSION</th><th>AR_NO</th><th>BATCH_NO</th>
//                 <th>DATE VALIDATED ON</th><th>STATUS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows2.length === 0
//                 ? <tr><td colSpan={10} className="wf-empty">No entries found.</td></tr>
//                 : rows2.map((row, idx) => (
//                   <tr key={row.id} className="wf-tr">
//                     <td>{idx + 1}</td>
//                     <td><span className="wf-link" onClick={() => handleOpenReview(row)}>{row.name}</span></td>
//                     <td>{row.jobId}</td><td>{row.instrId}</td>
//                     <td className="wf-path-cell">{row.path}</td>
//                     <td className="wf-center">{row.prodre}</td>
//                     <td>{row.arNo}</td><td>{row.batchNo}</td>
//                     <td className="wf-mono">{row.dateValidated}</td>
//                     <td><span className={STATUS_CLS[row.status] || 'wf-status'}>{row.status}</span></td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }