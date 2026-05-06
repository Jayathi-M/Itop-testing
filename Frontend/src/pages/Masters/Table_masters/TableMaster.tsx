import './TableMaster.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface TableInfo {
  tableSchema: string
  tableName: string
}

interface FieldRow {
  id: number
  column_name: string
  label_name: string
  data_type: string
  character_maximum_length: number | null
  column_default: string | null
  is_nullable: string
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function TableMaster() {
  const navigate = useNavigate()
  const [tables, setTables]               = useState<TableInfo[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [fields, setFields]               = useState<FieldRow[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [search, setSearch]               = useState('')
  const [page, setPage]                   = useState(1)
  const [pageSize, setPageSize]           = useState(10)

  useEffect(() => {
    fetch('http://localhost:5134/api/TableMaster/tables')
      .then(res => res.json())
      .then((data: TableInfo[]) => {
        setTables(data)
        setSelectedTable(data[0] ?? null)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load tables')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedTable) return
    setFieldsLoading(true)
    setSearch('')
    setPage(1)
    fetch(`http://localhost:5134/api/TableMaster?tableName=${encodeURIComponent(selectedTable.tableName)}&tableschema=${encodeURIComponent(selectedTable.tableSchema)}`)
      .then(res => res.json())
      .then((data: FieldRow[]) => { setFields(data); setFieldsLoading(false) })
      .catch(() => { setFields([]); setFieldsLoading(false) })
  }, [selectedTable])

  useEffect(() => { setPage(1) }, [search, pageSize])

  const filtered   = fields.filter(f => {
    const q = search.toLowerCase()
    return (
      f.column_name.toLowerCase().includes(q) ||
      (f.label_name ?? '').toLowerCase().includes(q) ||
      f.data_type.toLowerCase().includes(q)
    )
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function pageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return (
    <div className="tm-page">

      {/* Top bar */}
      <div className="tm-topbar">
        <div className="tm-topbar-right">
          <span className="tm-online-dot" />
          <button className="tm-all-btn">
            <GridIcon />
            All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      <div className="tm-body">

        {/* Left Panel */}
        <div className="tm-left">
          <ul className="tm-left__list">
            {loading && <li className="tm-left__item tm-left__item--info">Loading...</li>}
            {error   && <li className="tm-left__item tm-left__item--error">{error}</li>}
            {tables.map(t => {
              const isActive = selectedTable?.tableName === t.tableName
              return (
                <li key={t.tableName}>
                  <button
                    className={`tm-left__item${isActive ? ' tm-left__item--active' : ''}`}
                    onClick={() => setSelectedTable(t)}
                  >
                    <span className="tm-left__item-name">{t.tableName}</span>
                    {isActive && (
                      <span className="tm-left__item-badge tm-left__item-badge--active">
                        {fieldsLoading ? '…' : filtered.length}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="tm-left__footer">
            <button className="tm-left__create-btn">
              <PlusIcon />
              Create
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="tm-right">

          {/* Toolbar above card */}
          <div className="tm-toolbar">
            <div className="tm-search-wrap">
              <SearchIcon />
              <input
                className="tm-search"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="tm-toolbar-actions">
              <button className="tm-filter-btn">
                <FilterIcon />
                <span>Filters</span>
              </button>
              <button
                className="tm-add-btn"
                onClick={() => navigate('/masters/table/employee/add-field', {
                  state: { tableName: selectedTable?.tableName, tableSchema: selectedTable?.tableSchema }
                })}
              >
                <PlusIcon />
                <span>Add Field</span>
              </button>
              <button className="tm-dots-btn" title="More">
                <DotsIcon />
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="tm-table-card">

            <div className="tm-table-wrap">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>Field Name</th>
                    <th>Label Name</th>
                    <th>Field type</th>
                    <th>Field length</th>
                    <th>Default Value</th>
                    <th>Nullable</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsLoading ? (
                    <tr><td colSpan={8} className="tm-empty">Loading...</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={8} className="tm-empty">No fields found</td></tr>
                  ) : paginated.map((f, i) => {
                    const sno = String((safePage - 1) * pageSize + i + 1).padStart(2, '0')
                    return (
                      <tr key={`${f.id}-${f.column_name}`}>
                        <td className="tm-td-sno">{sno}</td>
                        <td>{f.column_name}</td>
                        <td>{f.label_name ?? '-'}</td>
                        <td>{f.data_type}</td>
                        <td>{f.character_maximum_length ?? '-'}</td>
                        <td>{f.column_default ?? '-'}</td>
                        <td>{f.is_nullable}</td>
                        <td>
                          <button className="tm-edit-btn" title="Edit">
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="tm-pagination">
              <button
                className="tm-pg-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ArrowLeftIcon />
                Previous
              </button>

              <div className="tm-pg-nums">
                {pageNumbers().map((p, idx) =>
                  p === '...'
                    ? <span key={`el-${idx}`} className="tm-ellipsis">...</span>
                    : <button
                        key={p}
                        className={`tm-pg-num${safePage === p ? ' tm-pg-num--active' : ''}`}
                        onClick={() => setPage(p as number)}
                      >{p}</button>
                )}
              </div>

              <button
                className="tm-pg-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages || fieldsLoading}
              >
                Next
                <ArrowRightIcon />
              </button>

              <div className="tm-page-size">
                <span className="tm-page-size-label">Rows per page</span>
                <select
                  className="tm-page-size-select"
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[5, 10, 15, 20, 25].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}