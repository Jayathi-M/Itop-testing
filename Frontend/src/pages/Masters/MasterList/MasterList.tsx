import { useState } from 'react'
import './MasterList.css'

interface MasterType {
  id: number
  name: string
  count: number
}

interface MasterValue {
  id: number
  valueName: string
  valueCode: string
  status: 'Completed' | 'Pending' | 'Inactive'
}

const MASTER_TYPES: MasterType[] = [
  { id: 1, name: 'Department',     count: 7 },
  { id: 2, name: 'Designation',    count: 2 },
  { id: 3, name: 'Business Unit',  count: 2 },
  { id: 4, name: 'Module',         count: 2 },
  { id: 5, name: 'Plant',          count: 2 },
  { id: 6, name: 'Group',          count: 2 },
  { id: 7, name: 'Gender',         count: 2 },
  { id: 8, name: 'Organization',   count: 2 },
]

const MOCK_VALUES: Record<string, MasterValue[]> = {
  Department: [
    { id: 1, valueName: 'Manufacturing',   valueCode: 'FESO_RES_002', status: 'Completed' },
    { id: 2, valueName: 'Quality Control', valueCode: 'FESO_RES_002', status: 'Completed' },
    { id: 3, valueName: 'Research',        valueCode: 'FESO_RES_002', status: 'Completed' },
    { id: 4, valueName: 'Packaging',       valueCode: 'FESO_RES_002', status: 'Completed' },
    { id: 5, valueName: 'Logistics',       valueCode: 'FESO_RES_003', status: 'Completed' },
    { id: 6, valueName: 'Finance',         valueCode: 'FESO_RES_004', status: 'Completed' },
    { id: 7, valueName: 'Human Resources', valueCode: 'FESO_RES_005', status: 'Completed' },
  ],
  Designation: [
    { id: 1, valueName: 'Manager',   valueCode: 'DSGN_001', status: 'Completed' },
    { id: 2, valueName: 'Executive', valueCode: 'DSGN_002', status: 'Completed' },
  ],
  'Business Unit': [
    { id: 1, valueName: 'Unit A', valueCode: 'BU_001', status: 'Completed' },
    { id: 2, valueName: 'Unit B', valueCode: 'BU_002', status: 'Completed' },
  ],
  Module: [
    { id: 1, valueName: 'Payroll', valueCode: 'MOD_001', status: 'Completed' },
    { id: 2, valueName: 'Leaves',  valueCode: 'MOD_002', status: 'Completed' },
  ],
  Plant: [
    { id: 1, valueName: 'Plant A', valueCode: 'PLT_001', status: 'Completed' },
    { id: 2, valueName: 'Plant B', valueCode: 'PLT_002', status: 'Completed' },
  ],
  Group: [
    { id: 1, valueName: 'Group A', valueCode: 'GRP_001', status: 'Completed' },
    { id: 2, valueName: 'Group B', valueCode: 'GRP_002', status: 'Completed' },
  ],
  Gender: [
    { id: 1, valueName: 'Male',   valueCode: 'GEN_001', status: 'Completed' },
    { id: 2, valueName: 'Female', valueCode: 'GEN_002', status: 'Completed' },
  ],
  Organization: [
    { id: 1, valueName: 'Org A', valueCode: 'ORG_001', status: 'Completed' },
    { id: 2, valueName: 'Org B', valueCode: 'ORG_002', status: 'Completed' },
  ],
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

const PlusIcon = ({ color = 'white' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
)

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#d0d5dd">
    <circle cx="9"  cy="5"  r="1.5"/><circle cx="15" cy="5"  r="1.5"/>
    <circle cx="9"  cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
    <circle cx="9"  cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#039855" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export default function MasterList() {
  const [selectedType, setSelectedType]     = useState<MasterType>(MASTER_TYPES[0])
  const [search, setSearch]                 = useState('')
  const [page, setPage]                     = useState(1)
  const [pageSize]                          = useState(7)

  const [panelOpen, setPanelOpen]           = useState(true)

  // Add Value modal state
  const [showAddModal, setShowAddModal]     = useState(false)
  const [addValueName, setAddValueName]     = useState('')
  const [addValueCode, setAddValueCode]     = useState('')
  const [addError, setAddError]             = useState<string | null>(null)

  const allValues = MOCK_VALUES[selectedType.name] ?? []

  const filtered = allValues.filter(v => {
    const q = search.toLowerCase()
    return (
      v.valueName.toLowerCase().includes(q) ||
      v.valueCode.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function pageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  function handleSelectType(t: MasterType) {
    setSelectedType(t)
    setSearch('')
    setPage(1)
  }

  function openAddModal() {
    setAddValueName('')
    setAddValueCode('')
    setAddError(null)
    setShowAddModal(true)
  }

  function handleAddSubmit() {
    if (!addValueName.trim()) { setAddError('Value name is required'); return }
    const values = MOCK_VALUES[selectedType.name] ?? []
    const newId = values.length > 0 ? Math.max(...values.map(v => v.id)) + 1 : 1
    values.push({ id: newId, valueName: addValueName.trim(), valueCode: addValueCode.trim() || 'FESO_RES_000', status: 'Completed' })
    MOCK_VALUES[selectedType.name] = [...values]
    const found = MASTER_TYPES.find(t => t.id === selectedType.id)
    if (found) found.count = values.length
    setShowAddModal(false)
  }

  return (
    <div className="ml-page">

      {/* Top bar */}
      <div className="ml-topbar">
        <div className="ml-topbar-right">
          <span className="ml-online-dot" />
          <button className="ml-all-btn">
            <GridIcon />
            All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ml-toolbar">
        <div className="ml-search-wrap">
          <SearchIcon />
          <input
            className="ml-search"
            placeholder="Search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-toolbar-actions">
          <button className="ml-filter-btn">
            <FilterIcon />
            Filters
          </button>
          <button className="ml-add-btn" onClick={openAddModal}>
            <PlusIcon />
            Add Value
          </button>
          <button className="ml-dots-btn" title="More">
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="ml-body">

        {/* Left panel — master types */}
        <div className={`ml-left${panelOpen ? '' : ' ml-left--collapsed'}`}>
          <div className="ml-left__title">
            {panelOpen && <span>Master List</span>}
            <button
              className="ml-left__collapse-btn"
              onClick={() => setPanelOpen(o => !o)}
              title={panelOpen ? 'Collapse panel' : 'Expand panel'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          </div>
          {panelOpen && <ul className="ml-left__list">
            {MASTER_TYPES.map(t => {
              const isActive = selectedType.id === t.id
              return (
                <li key={t.id}>
                  <button
                    className={`ml-left__item${isActive ? ' ml-left__item--active' : ''}`}
                    onClick={() => handleSelectType(t)}
                  >
                    <span className="ml-left__item-name">{t.name}</span>
                    <span className={`ml-left__item-badge${isActive ? ' ml-left__item-badge--active' : ''}`}>
                      {t.count}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>}
          {panelOpen && (
            <div className="ml-left__footer">
              <button className="ml-left__create-btn">
                <PlusIcon color="#4361ee" />
                Create
              </button>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="ml-right">
          <div className="ml-table-card">
            <div className="ml-table-wrap">
              <table className="ml-table">
                <thead>
                  <tr>
                    <th className="ml-th-drag"></th>
                    <th>S.NO.</th>
                    <th>Value Name</th>
                    <th>Value Code</th>
                    <th>
                      Status
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                      </svg>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} className="ml-empty">No values found</td></tr>
                  ) : paginated.map((v, i) => {
                    const sno = String((safePage - 1) * pageSize + i + 1).padStart(2, '0')
                    return (
                      <tr key={v.id} className="ml-tr">
                        <td className="ml-td-drag"><DragIcon /></td>
                        <td className="ml-td-sno">{sno}</td>
                        <td>{v.valueName}</td>
                        <td className="ml-td-code">{v.valueCode}</td>
                        <td>
                          <span className={`ml-status ml-status--${v.status.toLowerCase()}`}>
                            {v.status === 'Completed' && <CheckIcon />}
                            {v.status}
                          </span>
                        </td>
                        <td>
                          <div className="ml-actions">
                            <button className="ml-action-btn" title="Edit"><EditIcon /></button>
                            <button className="ml-action-btn ml-action-btn--plus" title="Add"><PlusIcon color="#667085" /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="ml-pagination">
              <button
                className="ml-pg-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ArrowLeftIcon />
                Previous
              </button>

              <div className="ml-pg-nums">
                {pageNumbers().map((p, idx) =>
                  p === '...'
                    ? <span key={`el-${idx}`} className="ml-ellipsis">...</span>
                    : <button
                        key={p}
                        className={`ml-pg-num${safePage === p ? ' ml-pg-num--active' : ''}`}
                        onClick={() => setPage(p as number)}
                      >{p}</button>
                )}
              </div>

              <button
                className="ml-pg-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                Next
                <ArrowRightIcon />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Add Value Modal */}
      {showAddModal && (
        <div className="ml-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ml-modal" onClick={e => e.stopPropagation()}>
            <div className="ml-modal__header">
              <h3>Add Value — {selectedType.name}</h3>
              <button className="ml-modal__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="ml-modal__body">
              <div className="ml-modal__field">
                <label className="ml-modal__label">Value Name *</label>
                <input
                  className="ml-modal__input"
                  placeholder="Enter value name"
                  value={addValueName}
                  onChange={e => setAddValueName(e.target.value)}
                />
              </div>
              <div className="ml-modal__field">
                <label className="ml-modal__label">Value Code</label>
                <input
                  className="ml-modal__input"
                  placeholder="Enter value code"
                  value={addValueCode}
                  onChange={e => setAddValueCode(e.target.value)}
                />
              </div>
            </div>
            <div className="ml-modal__footer">
              {addError && <span className="ml-modal__error">{addError}</span>}
              <button className="ml-modal__cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="ml-modal__submit" onClick={handleAddSubmit}>Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
