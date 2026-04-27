import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './Workflow.css'

interface WorkflowRow {
  id: number
  pickedAt: string
  path: string
  name: string
  instrId: string
  sampleSetId: number | string
  reviewedBy: string
  status: string
}

interface Step2Row {
  id: number
  name: string
  jobId: string
  instrId: string
  path: string
  prodre: number
  arNo: string
  batchNo: string
  dateValidated: string
  status: string
}

interface Checkpoint {
  id: number
  desc: string
  reviewedBy: string
  reviewedOn: string
  exception: string
  justification: string
  furtherReview: string
}

interface SubmittedReport {
  id: number
  reportName: string
  generatedOn: string
  generatedBy: string
  status: string
  sampleName: string
  samplePath: string
  arNo: string
  batchNo: string
  prodreVersion: number | string
  instrId: string
  checkpoints: Checkpoint[]
}

interface ManualForm {
  path: string
  name: string
  sampleSetId: string
}

interface ManualError {
  name?: string
  sampleSetId?: string
}

interface InfoModal {
  sno: number
  desc: string
  rows: string[]
}

interface DetailModal {
  title: string
  cp: Checkpoint
}

interface ReviewDetailsModal {
  cp: Checkpoint
}

interface PdfPreviewModal {
  blobUrl: string
  report: SubmittedReport
}

const PATH_OPTIONS = ['2024\\2025_New','2024\\2025_New\\MAR_2024','2024\\2025_New\\APR_2024','2023\\2024_Archive']
const STATUS_OPTIONS = ['Queue','Pending for L1','Completed','Cancelled']

const ALL_ROWS: WorkflowRow[] = [
  { id:1,  pickedAt:'18-03-2026 14:30:08', path:'2024\\2025_New',           name:'123',                   instrId:'-',  sampleSetId:32,   reviewedBy:'Service', status:'Queue'    },
  { id:2,  pickedAt:'23-12-2025 14:29:45', path:'2024\\2025_New\\MAR_2024', name:'PIRF_RS_145_070324_01', instrId:'-',  sampleSetId:2942, reviewedBy:'Service', status:'Cancelled'},
  { id:3,  pickedAt:'10-02-2026 09:15:00', path:'2024\\2025_New',           name:'BATCH_QC_031',          instrId:'E1', sampleSetId:105,  reviewedBy:'A.Sharma',status:'Completed'},
  { id:4,  pickedAt:'05-03-2026 11:45:22', path:'2024\\2025_New\\APR_2024', name:'RUN_APR_001',           instrId:'E2', sampleSetId:210,  reviewedBy:'R.Kumar', status:'Pending'  },
  { id:5,  pickedAt:'12-01-2026 08:00:55', path:'2023\\2024_Archive',       name:'ARCH_JAN_QC',           instrId:'E1', sampleSetId:78,   reviewedBy:'Service', status:'Queue'    },
  { id:6,  pickedAt:'28-02-2026 16:10:33', path:'2024\\2025_New\\MAR_2024', name:'PIRF_RS_200_280226',    instrId:'-',  sampleSetId:3100, reviewedBy:'S.Mehta', status:'Cancelled'},
]

const STEP2_ROWS: Step2Row[] = [
  { id:1, name:'Testing',               jobId:'BCPID_2603201013', instrId:'TEst',  path:'2024\\2025_New',                     prodre:1, arNo:'12345678', batchNo:'23457', dateValidated:'20-03-2026 10:13:59', status:'Pending for L1' },
  { id:2, name:'FESO_DS_143_060324_01', jobId:'-',                instrId:'-',     path:'2025\\MAR_2024\\2025_Demo\\MAR_2024', prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:56', status:'Pending for L1' },
  { id:3, name:'FESO_RES_011_040324_01',jobId:'-',                instrId:'-',     path:'2025\\MAR_2024\\2025_Demo\\MAR_2024', prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:31:02', status:'Pending for L1' },
  { id:4, name:'RAME_CU_276_120324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New\\MAR_2024',            prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:30:15', status:'Pending for L1' },
  { id:5, name:'RAME_DS_268_110324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New\\MAR_2024',            prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:29:27', status:'Pending for L1' },
  { id:6, name:'PIRF_RS_145_070324_01', jobId:'-',                instrId:'-',     path:'2024\\2025_New',                     prodre:1, arNo:'-',       batchNo:'-',     dateValidated:'23-12-2025 15:05:33', status:'Pending for L1' },
]

const BASE_CHECKPOINTS = [
  { id:1,  desc:'Pending for Sign-Off Level-1',                                                              reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
  { id:2,  desc:'Unprocessed Channels',                                                                      reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
  { id:3,  desc:'System Suitability - RSD',                                                                  reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
  { id:4,  desc:'Peak Tailing Factor',                                                                       reviewedBy:'system', reviewedOn:'20-03-2026 10:13:59' },
  { id:5,  desc:'Sample Set Finished Date incomplete',                                                       reviewedBy:'', reviewedOn:'' },
  { id:6,  desc:'There are no Major breaks in the acquisition times',                                        reviewedBy:'system', reviewedOn:'' },
  { id:7,  desc:'All the samples and standards are processed with the same processing method',               reviewedBy:'', reviewedOn:'' },
  { id:8,  desc:'Channels marked as Manually integrated',                                                    reviewedBy:'', reviewedOn:'' },
  { id:9,  desc:'Incomplete Data/ Missing Data/ Data File incomplete entries',                               reviewedBy:'system', reviewedOn:'' },
  { id:10, desc:'Single injections (Not associated with any sample set)',                                    reviewedBy:'', reviewedOn:'' },
  { id:11, desc:'Any Entry related to Deletion in the Project Audit trail',                                  reviewedBy:'', reviewedOn:'' },
  { id:12, desc:'There are no duplicate sample sets created for the same AR_No + Batch_No Combination',      reviewedBy:'', reviewedOn:'' },
  { id:13, desc:'Altered Sample Set',                                                                        reviewedBy:'', reviewedOn:'' },
  { id:14, desc:'Renamed Sample Set',                                                                        reviewedBy:'system', reviewedOn:'' },
  { id:15, desc:'Unlocked Channels Of Sample Set',                                                          reviewedBy:'', reviewedOn:'' },
  { id:16, desc:'Sample set channels processed within 48 hours',                                             reviewedBy:'', reviewedOn:'' },
  { id:17, desc:'Aborted Sample Set',                                                                        reviewedBy:'system', reviewedOn:'' },
  { id:18, desc:'Reprocessed Results',                                                                       reviewedBy:'', reviewedOn:'' },
  { id:19, desc:'No of injections and results',                                                              reviewedBy:'sysstem', reviewedOn:'' },
]

const ADDITIONAL_INFO: Record<number, string[]> = {
  1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],
  9:['Vial Id: 1968, Sample Name: Sample preparation_2, Channel Id: 1970, Injection Id: 1969, Channel: GC.0.2, Channel Description: Back Signal, Date Acquired: 05-03-2024 02:42:10 AM, System Name: CIF_QC_GC_011'],
  10:[],11:[],12:[],13:[],
  14:['Vial Id: 2105, Sample Name: Sample preparation_1, Channel Id: 2107, Injection Id: 2106, Channel: GC.0.2, Channel Description: Back Signal, Date Acquired: 06-03-2024 08:10:05 AM, System Name: CIF_QC_GC_011'],
  15:['Vial Id: 2201, Sample Name: Sample preparation_1, Channel Id: 2203, Injection Id: 2202, Channel: GC.0.2, Channel Description: Back Signal, Date Acquired: 07-03-2024 07:00:05 AM, System Name: CIF_QC_GC_011'],
  16:[],17:[],18:[],19:[],
}

const STEPS = [
  { label:'Sample Set Queue'  },
  { label:'Sample Set List'   },
  { label:'Sample Set Review' },
  { label:'Sample Set Report' },
]

const STATUS_CLS: Record<string, string> = {
  Queue:            'wf-status wf-status--queue',
  Cancelled:        'wf-status wf-status--cancelled',
  Completed:        'wf-status wf-status--completed',
  Pending:          'wf-status wf-status--pending',
  'Pending for L1': 'wf-status wf-status--pending',
}

export default function WorkflowPage() {
  const [activeStep,    setActiveStep]    = useState(0)
  const [showMore,      setShowMore]      = useState(false)
  const [showDemand,    setShowDemand]    = useState(false)
  const [showManual,    setShowManual]    = useState(false)
  const [manualForm,    setManualForm]    = useState<ManualForm>({ path:PATH_OPTIONS[0], name:'', sampleSetId:'' })
  const [manualError,   setManualError]   = useState<ManualError>({})
  const [addedRows,     setAddedRows]     = useState<WorkflowRow[]>([])
  const [selPath,       setSelPath]       = useState(PATH_OPTIONS[0])
  const [appliedPath,   setAppliedPath]   = useState('')
  const [search1,       setSearch1]       = useState('')
  const [pageSize1,     setPageSize1]     = useState(10)
  const [page1,         setPage1]         = useState(1)
  const [sortKey,       setSortKey]       = useState<keyof WorkflowRow>('id')
  const [sortDir,       setSortDir]       = useState<'asc'|'desc'>('asc')
  const [s2DateFrom,    setS2DateFrom]    = useState('01/01/2024')
  const [s2DateTo,      setS2DateTo]      = useState('03/20/2026')
  const [s2Path,        setS2Path]        = useState('')
  const [s2Status,      setS2Status]      = useState('')
  const [s2Search,      setS2Search]      = useState('')
  const [s2Rows,        setS2Rows]        = useState(100)
  const [selectedSample,setSelectedSample]= useState<Step2Row | null>(null)
  const [checkpoints,   setCheckpoints]   = useState<Checkpoint[]>(
    BASE_CHECKPOINTS.map((c, i) => {
      const exc = i < 6 ? 'yes' : 'no'
      return { ...c, exception: exc, justification: '', furtherReview: exc === 'yes' ? 'yes' : 'no' }
    })
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitSuccess,   setSubmitSuccess]   = useState(false)
  const [submittedReports, setSubmittedReports] = useState<SubmittedReport[]>([])
  const [infoModal,       setInfoModal]       = useState<InfoModal | null>(null)
  const [detailModal,     setDetailModal]     = useState<DetailModal | null>(null)
  const [reviewDetailsModal, setReviewDetailsModal] = useState<ReviewDetailsModal | null>(null)
  const [pdfPreviewModal, setPdfPreviewModal] = useState<PdfPreviewModal | null>(null)

  function handleGo()    { setAppliedPath(selPath); setPage1(1) }
  function handleReset() { setSelPath(PATH_OPTIONS[0]); setAppliedPath(''); setPage1(1); setSearch1('') }

  function handleSort(key: keyof WorkflowRow) {
    if (sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function handleManualSave() {
    const errs: ManualError = {}
    if (!manualForm.name.trim())        errs.name='Required'
    if (!manualForm.sampleSetId.trim()) errs.sampleSetId='Required'
    if (Object.keys(errs).length) { setManualError(errs); return }
    setAddedRows(prev => [{
      id:Date.now(), pickedAt:new Date().toLocaleString('en-GB').replace(',',''),
      path:manualForm.path, name:manualForm.name.trim(), instrId:'-',
      sampleSetId:manualForm.sampleSetId.trim(), reviewedBy:'Service', status:'Queue',
    }, ...prev])
    setManualForm({path:PATH_OPTIONS[0],name:'',sampleSetId:''})
    setManualError({})
    setShowManual(false); setShowDemand(false)
  }

  function openSampleReport(row: Step2Row) {
    setSelectedSample(row)
    setActiveStep(2)
  }

  let baseRows = [...ALL_ROWS]
  if (appliedPath) baseRows = baseRows.filter(r=>r.path.startsWith(appliedPath))
  if (search1.trim()) { const q=search1.toLowerCase(); baseRows=baseRows.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q))) }
  baseRows = baseRows.sort((a,b)=>{ const cmp=String(a[sortKey]).localeCompare(String(b[sortKey]),undefined,{numeric:true}); return sortDir==='asc'?cmp:-cmp })
  let pinnedRows=[...addedRows]
  if (appliedPath) pinnedRows=pinnedRows.filter(r=>r.path.startsWith(appliedPath))
  const rows1 = [...pinnedRows,...baseRows]
  const total1=rows1.length, totalPages1=Math.max(1,Math.ceil(total1/pageSize1)), safePage1=Math.min(page1,totalPages1)
  const paged1=rows1.slice((safePage1-1)*pageSize1,safePage1*pageSize1)

  let rows2=[...STEP2_ROWS]
  if (s2Path)   rows2=rows2.filter(r=>r.path.includes(s2Path))
  if (s2Status) rows2=rows2.filter(r=>r.status===s2Status)
  if (s2Search.trim()) { const q=s2Search.toLowerCase(); rows2=rows2.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q))) }
  const reviewed2=rows2.filter(r=>r.status==='Completed').length
  const pending2 =rows2.filter(r=>r.status==='Pending for L1').length

  function buildPdfDoc(r: SubmittedReport): jsPDF {
    const doc  = new jsPDF({ orientation:'landscape', unit:'pt', format:'a4' })
    const pW   = doc.internal.pageSize.getWidth()
    const pH   = doc.internal.pageSize.getHeight()
    const ml   = 30, mr = 30
    const cW   = pW - ml - mr
    const rH   = 18
    const lbW  = 110

    function drawHeader(yStart: number) {
      let y = yStart
      doc.setDrawColor(0); doc.setLineWidth(0.5)
      doc.setFillColor(255,255,255)
      doc.rect(ml, y, cW, 22, 'S')
      doc.setFontSize(12); doc.setFont('helvetica','bold')
      doc.text('Sample Audit Trail Review Report', pW/2, y+15, {align:'center'})
      y += 22
      doc.setFontSize(8)
      const midW = cW - lbW - 80 - 80
      doc.setFont('helvetica','bold')
      doc.rect(ml,      y, lbW,  rH,'S'); doc.text('Location',        ml+4,            y+12)
      doc.rect(ml+lbW,  y, midW, rH,'S')
      doc.rect(ml+lbW+midW, y, 80, rH,'S'); doc.text('Plant',         ml+lbW+midW+4,   y+12)
      doc.rect(ml+lbW+midW+80, y, 80, rH,'S')
      doc.setFont('helvetica','normal'); doc.text('Chemo',             ml+lbW+midW+84,  y+12)
      y += rH
      const c2=155, c3=90, c4=55, c5=80, c6=cW-lbW-c2-c3-c4-c5
      doc.setFont('helvetica','bold')
      doc.rect(ml,y,lbW,rH,'S');             doc.text('Sample Set Name',  ml+4,             y+12)
      doc.rect(ml+lbW,y,c2,rH,'S');          doc.setFont('helvetica','normal'); doc.text(r.sampleName||'-', ml+lbW+4, y+12)
      doc.setFont('helvetica','bold')
      doc.rect(ml+lbW+c2,y,c3,rH,'S');       doc.text('PRODRE Version',   ml+lbW+c2+4,      y+12)
      doc.rect(ml+lbW+c2+c3,y,c4,rH,'S');    doc.setFont('helvetica','normal'); doc.text(String(r.prodreVersion||'1'), ml+lbW+c2+c3+4, y+12)
      doc.setFont('helvetica','bold')
      doc.rect(ml+lbW+c2+c3+c4,y,c5,rH,'S'); doc.text('Instrument ID',    ml+lbW+c2+c3+c4+4,y+12)
      doc.rect(ml+lbW+c2+c3+c4+c5,y,c6,rH,'S'); doc.setFont('helvetica','normal'); doc.text(r.instrId||'', ml+lbW+c2+c3+c4+c5+4, y+12)
      y += rH
      doc.setFont('helvetica','bold')
      doc.rect(ml,y,lbW,rH,'S'); doc.text('Product Name',  ml+4, y+12)
      doc.rect(ml+lbW,y,cW-lbW,rH,'S'); doc.setFont('helvetica','normal'); doc.text('-', ml+lbW+4, y+12)
      y += rH
      doc.setFont('helvetica','bold')
      doc.rect(ml,y,lbW,rH,'S'); doc.text('Sample Set Path', ml+4, y+12)
      doc.rect(ml+lbW,y,cW-lbW,rH,'S'); doc.setFont('helvetica','normal'); doc.text(r.samplePath||'-', ml+lbW+4, y+12)
      y += rH
      doc.setFont('helvetica','bold')
      doc.rect(ml,y,lbW,rH,'S'); doc.text('AR_No', ml+4, y+12)
      doc.rect(ml+lbW,y,cW-lbW,rH,'S'); doc.setFont('helvetica','normal'); doc.text(r.arNo||'-', ml+lbW+4, y+12)
      y += rH
      doc.setFont('helvetica','bold')
      doc.rect(ml,y,lbW,rH,'S'); doc.text('Batch_No', ml+4, y+12)
      doc.rect(ml+lbW,y,cW-lbW,rH,'S'); doc.setFont('helvetica','normal'); doc.text(r.batchNo||'-', ml+lbW+4, y+12)
      y += rH
      return y
    }

    function drawFooter(pageNum: number, total: number) {
      const y = pH - 14
      doc.setFontSize(7.5); doc.setFont('helvetica','normal')
      doc.text(`Generated By : Chromeleon (${r.generatedBy}) ${r.generatedOn}`, ml, y)
      doc.text('"Reference copy" Electronically generated document', pW/2, y, {align:'center'})
      doc.text(`Page ${pageNum} of ${total}`, pW-mr, y, {align:'right'})
    }

    function drawSigHeader(y: number) {
      const sigW = cW/4
      ;['Submitted By','Verified By','Approved By','Comments'].forEach((col,i)=>{
        doc.setFillColor(210,210,210); doc.setFont('helvetica','bold'); doc.setFontSize(8.5)
        doc.rect(ml+i*sigW, y, sigW, rH, 'FD')
        doc.text(col, ml+i*sigW+sigW/2, y+12, {align:'center'})
      })
      return y + rH
    }

    const startY = drawHeader(30) + 4
    autoTable(doc, {
      startY,
      head: [['S.No','Checkpoint Description','Exception','Justification','Further Review Required']],
      body: r.checkpoints.map((cp,i)=>[i+1, cp.desc, cp.exception||'-', cp.justification||'-', cp.furtherReview||'-']),
      styles:      { fontSize:8, cellPadding:3, lineColor:[0,0,0] as [number,number,number], lineWidth:0.3, overflow:'linebreak' },
      headStyles:  { fillColor:[255,255,255] as [number,number,number], textColor:[0,0,0] as [number,number,number], fontStyle:'bold', lineColor:[0,0,0] as [number,number,number], lineWidth:0.3 },
      alternateRowStyles: { fillColor:[255,255,255] as [number,number,number] },
      margin:      { left:ml, right:mr, top:160 },
      tableWidth:  cW,
      columnStyles:{ 0:{ cellWidth:30 }, 1:{ cellWidth:290 }, 2:{ cellWidth:55 }, 3:{ cellWidth:150 }, 4:{ cellWidth:cW-30-290-55-150 } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didDrawPage:(data: any)=>{ if(data.pageNumber>1) drawHeader(30) },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const afterTable = (doc as any).lastAutoTable.finalY + 4
    drawSigHeader(afterTable)

    doc.addPage()
    let y2 = drawHeader(30) + 4
    y2 = drawSigHeader(y2)
    const dataH = 32
    const sigW  = cW/4
    doc.setFillColor(255,255,255); doc.setFont('helvetica','normal'); doc.setFontSize(8)
    ;[
      [`Chromeleon (${r.generatedBy})`, r.generatedOn],
      [`Chromeleon (${r.generatedBy})`, r.generatedOn],
      [`Chromeleon (${r.generatedBy})`, r.generatedOn],
      ['',''],
    ].forEach(([line1,line2],i)=>{
      doc.rect(ml+i*sigW, y2, sigW, dataH, 'S')
      if(line1) doc.text(line1, ml+i*sigW+4, y2+11)
      if(line2) doc.text(line2, ml+i*sigW+4, y2+22)
    })

    const total = doc.internal.getNumberOfPages()
    for(let p=1; p<=total; p++){ doc.setPage(p); drawFooter(p, total) }
    return doc
  }

  function downloadReportPDF(r: SubmittedReport) {
    const doc = buildPdfDoc(r)
    doc.save(`${r.reportName.replace(/\s+/g,'_')}_report.pdf`)
  }

  function previewReportPDF(r: SubmittedReport) {
    const doc = buildPdfDoc(r)
    const blobUrl = doc.output('bloburl') as string
    setPdfPreviewModal({ blobUrl, report: r })
  }

  function handleS3Submit() {
    setSubmitAttempted(true)
    setSubmitSuccess(false)
    const allFilled = checkpoints.every(cp => cp.exception !== 'yes' || cp.justification.trim())
    if (allFilled) {
      const now = new Date()
      const generatedOn = now.toLocaleDateString('en-GB').replace(/\//g,'-') + ' ' + now.toLocaleTimeString('en-GB')
      setSubmittedReports(prev => [...prev, {
        id: Date.now(),
        reportName: selectedSample?.name || 'Sample Set Review Report',
        generatedOn,
        generatedBy: 'chrom_dev',
        status: 'Completed',
        sampleName:  selectedSample?.name    || '-',
        samplePath:  selectedSample?.path    || '-',
        arNo:        selectedSample?.arNo    || '-',
        batchNo:     selectedSample?.batchNo || '-',
        prodreVersion: selectedSample?.prodre || '1',
        instrId:     selectedSample?.instrId  || '',
        checkpoints: checkpoints.map(cp => ({ ...cp })),
      }])
      setSubmitSuccess(true)
      setSubmitAttempted(false)
      setTimeout(() => setActiveStep(3), 1000)
    }
  }

  function SortIcon({ k }: { k: keyof WorkflowRow }) {
    if (sortKey!==k) return <span className="wf-sort-icon">⇅</span>
    return <span className="wf-sort-icon wf-sort-icon--on">{sortDir==='asc'?'↑':'↓'}</span>
  }

  return (
    <div className="wf-page">

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

      {/* STEP 1 */}
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
                  {(['id','pickedAt','path','name','instrId','sampleSetId','reviewedBy','status'] as (keyof WorkflowRow)[]).map((k,idx)=>{
                    const labels = ['S.No.','Sampleset Picked Date/Time','Sampleset Path','Sampleset Name','Instrument ID','Sample Set ID','Reviewed By','Current Status']
                    return <th key={k} className="wf-th--sortable" onClick={()=>handleSort(k)}>{labels[idx]}<SortIcon k={k}/></th>
                  })}
                </tr>
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

      {/* STEP 2 */}
      {activeStep===1 && (<>
        <div className="wf-filter-card">
          <div className="wf-filter-row wf-filter-row--multi">
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
                  <th>S.NO.</th><th>SAMPLE SET NAME</th><th>JOB ID</th><th>INSTRUMENT ID</th>
                  <th>SAMPLE SET PATH</th><th>PRODRE VERSION</th><th>AR_NO</th><th>BATCH_NO</th>
                  <th>DATE VALIDATED ON</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {rows2.length===0?(<tr><td colSpan={10} className="wf-empty">No entries found.</td></tr>)
                :rows2.map((row,idx)=>(
                  <tr key={row.id} className="wf-tr">
                    <td>{idx+1}</td>
                    <td><span className="wf-link" onClick={()=>openSampleReport(row)}>{row.name}</span></td>
                    <td>{row.jobId}</td><td>{row.instrId}</td>
                    <td className="wf-path-cell">{row.path}</td>
                    <td className="wf-center">{row.prodre}</td>
                    <td>{row.arNo}</td><td>{row.batchNo}</td>
                    <td className="wf-mono">{row.dateValidated}</td>
                    <td><span className={STATUS_CLS[row.status]||'wf-status'}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* STEP 3 */}
      {activeStep===2 && (<>
        <div className="s3-topbar">
          <button className="wf-btn wf-btn--unlock"><i className="fa-solid fa-lock-open"/> Unlock Checklist</button>
        </div>
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
                <select className="wf-select"><option value="1">1</option></select>
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
        <div className="wf-table-card">
          <div className="wf-table-header">
            <div className="wf-table-header__left">
              <i className="fa-solid fa-file-lines wf-table-icon"/>
              <span className="wf-table-title">Sample Set Reports</span>
            </div>
          </div>
          <div className="wf-table-wrap">
            <table className="wf-table s3-table">
              <colgroup>
                <col style={{width:'44px'}}/><col style={{width:'230px'}}/><col style={{width:'170px'}}/>
                <col style={{width:'105px'}}/><col style={{width:'46px'}}/><col style={{width:'54px'}}/>
                <col style={{width:'95px'}}/><col style={{width:'130px'}}/>
              </colgroup>
              <thead>
                <tr>
                  <th>S.NO.</th><th>CHECKPOINT DESCRIPTION</th><th>JUSTIFICATION *</th>
                  <th>FURTHER REVIEW REQUIRED</th><th>INFO</th><th>HISTORY</th>
                  <th>REVIEWED BY</th><th>REVIEWED ON</th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp,idx)=>(
                  <tr key={cp.id} className={`wf-tr s3-tr ${cp.exception==='yes' && (submitSuccess || cp.justification.trim()) ? 's3-tr--exception-no' : cp.exception==='yes' ? 's3-tr--exception-yes' : cp.exception==='no' ? 's3-tr--exception-no' : ''} ${submitAttempted && cp.exception==='yes' && !cp.justification.trim() ? 's3-tr--error' : ''}`}>
                    <td>{idx+1}</td>
                    <td className="s3-desc-cell"><div className="s3-desc-inner">{cp.desc}</div></td>
                    <td className="s3-justification-cell">
                      <textarea
                        className={`s3-textarea ${submitAttempted && cp.exception==='yes' && !cp.justification.trim() ? 's3-textarea--error' : ''} ${cp.exception==='no' ? 's3-textarea--disabled' : ''}`}
                        rows={3}
                        placeholder={cp.exception==='yes' ? 'Enter justification... *' : 'N/A'}
                        value={cp.justification}
                        disabled={cp.exception==='no'}
                        onChange={e=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,justification:e.target.value}:r))}
                      />
                      {submitAttempted && cp.exception==='yes' && !cp.justification.trim() && (
                        <span className="s3-field-err">⚠ Justification is required</span>
                      )}
                    </td>
                    <td>
                      <div className="s3-radio-group">
                        <label className="s3-radio"><input type="radio" name={`fr-${cp.id}`} value="yes" checked={cp.furtherReview==='yes'} onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,furtherReview:'yes'}:r))} disabled={cp.exception==='yes'}/> Yes</label>
                        <label className="s3-radio"><input type="radio" name={`fr-${cp.id}`} value="no"  checked={cp.furtherReview==='no'}  onChange={()=>setCheckpoints(p=>p.map(r=>r.id===cp.id?{...r,furtherReview:'no'}:r))}  disabled={cp.exception==='yes'}/> No</label>
                      </div>
                    </td>
                    <td className="wf-center">
                      <button className="s3-icon-btn" onClick={()=>setInfoModal({sno:idx+1, desc:cp.desc, rows: ADDITIONAL_INFO[cp.id]||[]})}><i className="fa-regular fa-eye"/></button>
                    </td>
                    <td className="wf-center">
                      <button className="s3-icon-btn" onClick={()=>setDetailModal({title:'History', cp})}><i className="fa-solid fa-clock-rotate-left"/></button>
                    </td>
                    <td><span className="wf-link" onClick={()=>cp.reviewedBy && setReviewDetailsModal({cp})}>{cp.reviewedBy}</span></td>
                    <td className="wf-mono">{cp.reviewedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* STEP 4 */}
      {activeStep===3 && (<>
        <div className="s3-topbar"/>
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
                <select className="wf-select"><option value="1">1</option></select>
                <i className="fa-solid fa-chevron-down wf-select-arrow"/>
              </div>
            </div>
            <button className="wf-btn wf-btn--go s3-go-btn"><i className="fa-solid fa-magnifying-glass"/> Go</button>
          </div>
        </div>
        <div className="wf-table-card">
          <div className="wf-table-header">
            <div className="wf-table-header__left">
              <i className="fa-solid fa-file-lines wf-table-icon"/>
              <span className="wf-table-title">Sample Set Report</span>
            </div>
          </div>
          <div className="wf-table-wrap">
            <table className="wf-table s3-table">
              <thead>
                <tr>
                  <th>S.NO.</th><th>REPORT NAME</th><th>GENERATED ON</th>
                  <th>GENERATED BY</th><th>STATUS</th><th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {submittedReports.length === 0
                  ? <tr><td colSpan={6} className="wf-empty">No report data available.</td></tr>
                  : submittedReports.map((r, idx) => (
                    <tr key={r.id} className="wf-tr">
                      <td>{idx + 1}</td>
                      <td>{r.reportName}</td>
                      <td className="wf-mono">{r.generatedOn}</td>
                      <td>{r.generatedBy}</td>
                      <td><span className="wf-status wf-status--completed">{r.status}</span></td>
                      <td className="wf-center">
                        <button className="s3-icon-btn" title="Preview PDF" onClick={()=>previewReportPDF(r)}><i className="fa-regular fa-eye"/></button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* MODAL — On Demand */}
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

      {/* MODAL — Add Manually */}
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

      {/* More panel */}
      {showMore && (<>
        <div className="wf-more-backdrop" onClick={()=>setShowMore(false)}/>
        <div className="wf-more-panel">
          <div className="wf-more-panel__header">
            <div className="wf-more-panel__title"><i className="fa-solid fa-asterisk wf-more-panel__star"/> Tools & Navigation</div>
            <button className="wf-more-panel__close" onClick={()=>setShowMore(false)}>✕</button>
          </div>
          <div className="wf-more-grid">
            {[
              {icon:'fa-list-check',             label:'Jobs',           bg:'#fef9c3',color:'#ca8a04'},
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

      {/* MODAL — Additional Info */}
      {infoModal && (
        <div className="wf-modal-backdrop" onClick={()=>setInfoModal(null)}>
          <div className="info-modal" onClick={e=>e.stopPropagation()}>
            <div className="info-modal__header">
              <h3 className="info-modal__title">Additional Info</h3>
              <button className="wf-modal__close" onClick={()=>setInfoModal(null)}>✕</button>
            </div>
            <div className="info-modal__body">
              <table className="info-modal__table">
                <thead><tr><th>S.No.</th><th>CheckPoint Description</th><th>Additional Info</th></tr></thead>
                <tbody>
                  {infoModal.rows.length === 0 ? (
                    <tr><td colSpan={3} className="info-modal__empty">No additional info available.</td></tr>
                  ) : (
                    <tr>
                      <td className="info-modal__sno">1</td>
                      <td className="info-modal__desc">{infoModal.desc}</td>
                      <td className="info-modal__detail">
                        {infoModal.rows.map((text, i) => (
                          <p key={i} className="info-modal__para">{text}</p>
                        ))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="info-modal__footer">
              <button className="info-modal__close-btn" onClick={()=>setInfoModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — History */}
      {detailModal && (
        <div className="wf-modal-backdrop" onClick={()=>setDetailModal(null)}>
          <div className="info-modal info-modal--detail" onClick={e=>e.stopPropagation()}>
            <div className="info-modal__header">
              <h3 className="info-modal__title">{detailModal.title}</h3>
              <button className="wf-modal__close" onClick={()=>setDetailModal(null)}>✕</button>
            </div>
            <div className="info-modal__body detail-body">
              <div className="detail-meta">
                <div className="detail-meta__row detail-meta__row--full">
                  <div className="detail-meta__field">
                    <span className="detail-meta__label">Exception</span>
                    <span className="detail-meta__value">{detailModal.cp.desc}</span>
                  </div>
                </div>
                <div className="detail-meta__divider"/>
                <div className="detail-meta__row">
                  <div className="detail-meta__field"><span className="detail-meta__label">Submitted By</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Submitted On</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Further Review Required</span><span className="detail-meta__value">{detailModal.cp.furtherReview || '-'}</span></div>
                </div>
                <div className="detail-meta__row">
                  <div className="detail-meta__field"><span className="detail-meta__label">Verified By</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Verified On</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Verification Type</span><span className="detail-meta__value">-</span></div>
                </div>
                <div className="detail-meta__row">
                  <div className="detail-meta__field"><span className="detail-meta__label">Approved By</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Approved On</span><span className="detail-meta__value">-</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Approval Type</span><span className="detail-meta__value">-</span></div>
                </div>
                <div className="detail-meta__row">
                  <div className="detail-meta__field"><span className="detail-meta__label">Status</span><span className="detail-meta__value">Open</span></div>
                  <div className="detail-meta__field"><span className="detail-meta__label">Processed By</span><span className="detail-meta__value">Service</span></div>
                  <div className="detail-meta__field"/>
                </div>
              </div>
              {['Submit History','Verification History','Approver History','Unlock History'].map(section=>(
                <div key={section} className="detail-section">
                  <h4 className="detail-section__title">{section}</h4>
                  <table className="detail-history-table">
                    <thead><tr><th>Action By</th><th>Action On</th><th>Action Type</th><th>Comments</th></tr></thead>
                    <tbody><tr><td colSpan={4} className="detail-history-empty">No data available in table</td></tr></tbody>
                  </table>
                </div>
              ))}
            </div>
            <div className="info-modal__footer">
              <button className="info-modal__close-btn" onClick={()=>setDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Review Details */}
      {reviewDetailsModal && (
        <div className="wf-modal-backdrop" onClick={()=>setReviewDetailsModal(null)}>
          <div className="info-modal info-modal--history" onClick={e=>e.stopPropagation()}>
            <div className="info-modal__header">
              <h3 className="info-modal__title">Review Details</h3>
              <button className="wf-modal__close" onClick={()=>setReviewDetailsModal(null)}>✕</button>
            </div>
            <div className="info-modal__body">
              <table className="detail-history-table">
                <thead>
                  <tr><th>S.No.</th><th>Exception</th><th>Justification</th><th>Further Review Required</th><th>Reviewed By</th><th>Reviewed On</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{reviewDetailsModal.cp.exception || '-'}</td>
                    <td>{reviewDetailsModal.cp.justification || '-'}</td>
                    <td>{reviewDetailsModal.cp.furtherReview || '-'}</td>
                    <td>{reviewDetailsModal.cp.reviewedBy || 'system'}</td>
                    <td>{reviewDetailsModal.cp.reviewedOn || '23-12-2025 15:31:02'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="info-modal__footer">
              <button className="info-modal__close-btn" onClick={()=>setReviewDetailsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — PDF Preview */}
      {pdfPreviewModal && (
        <div className="wf-modal-backdrop" onClick={()=>setPdfPreviewModal(null)}>
          <div className="pdf-preview-modal" onClick={e=>e.stopPropagation()}>
            <div className="pdf-preview-modal__header">
              <span className="pdf-preview-modal__title">{pdfPreviewModal.report.reportName}</span>
              <div className="pdf-preview-modal__actions">
                <button className="pdf-preview-modal__download-btn" onClick={()=>downloadReportPDF(pdfPreviewModal.report)}>
                  <i className="fa-solid fa-download"/> Download
                </button>
                <button className="pdf-preview-modal__close" onClick={()=>setPdfPreviewModal(null)}>✕</button>
              </div>
            </div>
            <div className="pdf-preview-modal__body">
              <iframe
                src={pdfPreviewModal.blobUrl}
                title="PDF Preview"
                className="pdf-preview-modal__iframe"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
