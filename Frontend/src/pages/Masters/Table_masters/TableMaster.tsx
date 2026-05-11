import './TableMaster.css'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterPanel, { FilterRow } from '../../../components/FilterPanel/FilterPanel'

interface TableInfo {
  tableSchema: string
  tableName: string
}

interface FieldRow {
  id: number
  column_name: string
  label_name: string | null
  data_type: string
  character_maximum_length: number | null
  column_default: string | null
  is_nullable: string
  lookup_table_name: string | null
  lookup_text_field: string | null
  lookup_value_field: string | null
  lookup_filter: string | null
  is_active: boolean | null
  is_displaylist: boolean | null
}

interface NewColumn {
  id: number
  name: string
  type: string
}

const FIELD_TYPES = ['INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'DATETIME', 'DECIMAL', 'FLOAT', 'BIGINT']

const FILTER_FIELDS = [
  { value: 'column_name', label: 'Field Name' },
  { value: 'label_name',  label: 'Label Name' },
  { value: 'data_type',   label: 'Field Type' },
  { value: 'is_nullable', label: 'Nullable'   },
]

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
  const [filterRows, setFilterRows]       = useState<FilterRow[]>([])
  const [apiFields, setApiFields]         = useState<FieldRow[] | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTableName, setNewTableName]   = useState('')
  const [newColumns, setNewColumns] = useState<NewColumn[]>([{ id: 1, name: '', type: '' }])
  const colIdRef = useRef(2)

  useEffect(() => {
    fetch('http://localhost:5134/api/dynamic-platform/tables')
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
    //fetch(`http://localhost:5134/api/TableMaster?tableName=${encodeURIComponent(selectedTable.tableName)}&tableschema=${encodeURIComponent(selectedTable.tableSchema)}`)
    fetch(`http://localhost:5134/api/dynamic-platform/tables/${encodeURIComponent(selectedTable.tableName)}/${encodeURIComponent(selectedTable.tableSchema)}`)  
      .then(res => res.json())
      .then((data: FieldRow[]) => { setFields(data); setFieldsLoading(false) })
      .catch(() => { setFields([]); setFieldsLoading(false) })
  }, [selectedTable])

  useEffect(() => { setPage(1) }, [search, pageSize, filterRows])

  // Call /GetFilterData API when FilterPanel has active rows
  useEffect(() => {
    if (!selectedTable) return
    const active = filterRows.filter(r => r.value.trim() !== '')
    if (active.length === 0) { setApiFields(null); return }

    const timer = setTimeout(() => {
      fetch('http://localhost:5134/api/dynamic-platform/GetFilterData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName:   selectedTable.tableName,
          tableSchema: selectedTable.tableSchema,
          filters: active.map((fr, i) => ({
            field:    fr.field,
            operator: fr.operator,
            value:    fr.value,
            logic:    i === 0 ? 'and' : fr.logic,
          })),
        }),
      })
        .then(r => r.json())
        .then((data: FieldRow[]) => setApiFields(data))
        .catch(() => setApiFields(null))
    }, 400)

    return () => clearTimeout(timer)
  }, [filterRows, selectedTable])

  // Apply search + FilterPanel rows (exclude auto-generated system columns)
  const HIDDEN_COLUMNS = new Set(['id', 'created_at'])
  const filtered = (apiFields ?? fields).filter(f => !HIDDEN_COLUMNS.has(f.column_name.toLowerCase())).filter(f => {
    const q = search.toLowerCase()
    const matchesSearch = (
      f.column_name.toLowerCase().includes(q) ||
      (f.label_name ?? '').toLowerCase().includes(q) ||
      f.data_type.toLowerCase().includes(q)
    )
    if (!matchesSearch) return false

    const activeFilters = filterRows.filter(r => r.value.trim() !== '')
    if (activeFilters.length === 0) return true

    const test = (fr: FilterRow) => {
      const raw  = f[fr.field as keyof FieldRow]
      const cell = (raw ?? '').toString().toLowerCase()
      const val  = fr.value.toLowerCase()
      switch (fr.operator) {
        case 'Is':          return cell === val
        case 'Is not':      return cell !== val
        case 'Starts with': return cell.startsWith(val)
        case 'Ends with':   return cell.endsWith(val)
        default:            return cell.includes(val)
      }
    }

    let result = test(activeFilters[0])
    for (let i = 1; i < activeFilters.length; i++) {
      const fr = activeFilters[i]
      result = fr.logic === 'or' ? result || test(fr) : result && test(fr)
    }
    return result
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function pageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  function openCreateModal() {
    setNewTableName('')
    setNewColumns([{ id: 1, name: '', type: 'VARCHAR' }])
    setCreateError(null)
    colIdRef.current = 2
    setShowCreateModal(true)
  }

  function addColumn() {
    setNewColumns(c => [...c, { id: colIdRef.current++, name: '', type: 'VARCHAR' }])
  }

  function removeColumn(id: number) {
    setNewColumns(c => c.length === 1 ? c : c.filter(col => col.id !== id))
  }

  function updateColumn(id: number, value: string) {
    setNewColumns(c => c.map(col => col.id === id ? { ...col, name: value } : col))
  }

  function updateColumnType(id: number, type: string) {
    setNewColumns(c => c.map(col => col.id === id ? { ...col, type } : col))
  }

  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError]     = useState<string | null>(null)

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editRow, setEditRow]             = useState<FieldRow | null>(null)
  const [editSections, setEditSections]   = useState({ basic: true, lookup: true, status: true })
  const [editForm, setEditForm]           = useState({
    labelName: '', fieldType: '', fieldLength: '', isPrimaryKey: '',
    defaultValue: '', lookupTable: '', displayField: '', valueField: '',
    where: '', status: 'Active', displayList: '',
  })
  const [editLoading, setEditLoading]     = useState(false)
  const [editError, setEditError]         = useState<string | null>(null)

  function openEditModal(f: FieldRow) {
    setEditRow(f)
    setEditForm({
      labelName:    f.label_name    ?? '',
      fieldType:    f.data_type,
      fieldLength:  f.character_maximum_length != null ? String(f.character_maximum_length) : '',
      isPrimaryKey: f.is_nullable === 'NO' ? 'yes' : 'no',
      defaultValue: f.column_default       ?? '',
      lookupTable:  f.lookup_table_name    ?? '',
      displayField: f.lookup_text_field    ?? '',
      valueField:   f.lookup_value_field   ?? '',
      where:        f.lookup_filter        ?? '',
      status:       f.is_active === false ? 'Inactive' : 'Active',
      displayList:  f.is_displaylist ? 'yes' : '',
    })
    setEditSections({ basic: true, lookup: true, status: true })
    setEditError(null)
    setShowEditModal(true)
  }

  const setEdit = (k: keyof typeof editForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.value }))

  async function handleEditSubmit() {
    if (!editRow || !selectedTable) return
    setEditLoading(true)
    setEditError(null)
    try {
      const res = await fetch('http://localhost:5134/api/dynamic-platform/create-columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_schema:             selectedTable.tableSchema,
          table_name:               selectedTable.tableName,
          column_name:              editRow.column_name,
          label_name:               editForm.labelName,
          data_type:                editForm.fieldType,
          character_maximum_length: editForm.fieldLength ? Number(editForm.fieldLength) : 0,
          column_default:           editForm.defaultValue,
          is_nullable:              editForm.isPrimaryKey === 'yes' ? 'NO' : 'YES',
          lookup_table_name:        editForm.lookupTable,
          lookup_text_field:        editForm.displayField,
          lookup_value_field:       editForm.valueField,
          lookup_filter:            editForm.where,
          is_active:                editForm.status === 'Active',
          is_displaylist:           editForm.displayList.trim() !== '',
          is_dynamic:               true,
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      // Refresh column list
      const updated: FieldRow[] = await fetch(
        `http://localhost:5134/api/dynamic-platform?tableName=${encodeURIComponent(selectedTable.tableName)}&tableschema=${encodeURIComponent(selectedTable.tableSchema)}`
      ).then(r => r.json())
      setFields(updated)
      setShowEditModal(false)
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update field')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleCreateSubmit() {
    setCreateLoading(true)
    setCreateError(null)
    try {
      const res = await fetch('http://localhost:5134/api/dynamic-platform/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: newTableName.trim(),
          tableSchema: 'UMS',
          columns: newColumns
            .filter(c => c.name.trim() !== '')
            .map(c => ({ name: c.name.trim(), dataType: c.type })),
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      // Refresh table list and select the newly created table
      const updated: TableInfo[] = await fetch('http://localhost:5134/api/dynamic-platform/tables').then(r => r.json())
      setTables(updated)
      const created = updated.find(t => t.tableName === newTableName.trim()) ?? updated[0] ?? null
      setSelectedTable(created)
      setShowCreateModal(false)
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create table')
    } finally {
      setCreateLoading(false)
    }
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

      {/* Toolbar */}
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

          <FilterPanel
            fields={FILTER_FIELDS}
            onFilterChange={setFilterRows}
            storageKey="tm_saved_filters"
          />

          <button
            className="tm-add-btn"
            onClick={() => navigate('/masters/table/employee/add-field', {
              state: { tableName: selectedTable?.tableName, tableSchema: selectedTable?.tableSchema }
            })}
          >
            <PlusIcon />
            <span>Add Column</span>
          </button>
          <button className="tm-dots-btn" title="More">
            <DotsIcon />
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
            <button className="tm-left__create-btn" onClick={openCreateModal}>
              <PlusIcon />
              Create
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="tm-right">
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
                          <button className="tm-edit-btn" title="Edit" onClick={() => openEditModal(f)}>
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

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="tm-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="tm-modal" onClick={e => e.stopPropagation()}>

            <div className="tm-modal__header">
              <h3>Create New Table</h3>
              <button className="tm-modal__close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <div className="tm-modal__body">

              {/* Table Name */}
              <div className="tm-modal__field">
                <label className="tm-modal__label">Table Name</label>
                <input
                  className="tm-modal__input"
                  placeholder="Enter table name"
                  value={newTableName}
                  onChange={e => setNewTableName(e.target.value)}
                />
              </div>

              {/* Columns */}
              <div className="tm-modal__field">
                <div className="tm-modal__col-header">
                  <label className="tm-modal__label">Columns</label>
                  <button className="tm-modal__add-col-btn" onClick={addColumn}>
                    <PlusIcon />
                    Add Column
                  </button>
                </div>
                <div className="tm-modal__col-list">
                  {newColumns.map((col, idx) => (
                    <div key={col.id} className="tm-modal__col-row">
                      <span className="tm-modal__col-num">{String(idx + 1).padStart(2, '0')}</span>
                      <input
                        className="tm-modal__input"
                        placeholder={`Column ${idx + 1} name`}
                        value={col.name}
                        onChange={e => updateColumn(col.id, e.target.value)}
                      />
                      <div className="tm-modal__select-wrap">
                        <select
                          className="tm-modal__select"
                          value={col.type}
                          onChange={e => updateColumnType(col.id, e.target.value)}
                        >
                          {FIELD_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      {newColumns.length > 1 && (
                        <button
                          className="tm-modal__col-del"
                          onClick={() => removeColumn(col.id)}
                          title="Remove"
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="tm-modal__footer">
              {createError && <span className="tm-modal__error">{createError}</span>}
              <button className="tm-modal__cancel-btn" onClick={() => setShowCreateModal(false)} disabled={createLoading}>Cancel</button>
              <button
                className="tm-modal__submit-btn"
                onClick={handleCreateSubmit}
                disabled={!newTableName.trim() || createLoading}
              >{createLoading ? 'Creating…' : 'Submit'}</button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Column Modal */}
      {showEditModal && editRow && (
        <div className="tm-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="tm-modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>

            <div className="tm-modal__header">
              <h3>Edit Column — {editRow.column_name}</h3>
              <button className="tm-modal__close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="tm-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              {/* Basic Information */}
              <div className="tm-modal__section-head" onClick={() => setEditSections(s => ({ ...s, basic: !s.basic }))}>
                <span>Basic Information</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: editSections.basic ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {editSections.basic && (
                <div className="tm-modal__section-body">
                  <div className="tm-modal__row">
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Field Name</label>
                      <input className="tm-modal__input" value={editRow.column_name} readOnly style={{ background: '#f9fafb', color: '#667085' }} />
                    </div>
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Label Name</label>
                      <input className="tm-modal__input" placeholder="Enter label name" value={editForm.labelName} onChange={setEdit('labelName')} />
                    </div>
                  </div>
                  <div className="tm-modal__row">
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Field Type</label>
                      <div className="tm-modal__select-wrap">
                        <select className="tm-modal__select" value={editForm.fieldType} onChange={setEdit('fieldType')}>
                          <option value="">Select type</option>
                          <option value="character varying">Text (character varying)</option>
                          <option value="integer">Integer</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="numeric">Numeric (Float)</option>
                          <option value="timestamp">Timestamp</option>
                          <option value="text">Text (unlimited)</option>
                        </select>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Field Length</label>
                      <input className="tm-modal__input" type="number" placeholder="Enter length" value={editForm.fieldLength} onChange={setEdit('fieldLength')} />
                    </div>
                  </div>
                  <div className="tm-modal__row">
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Is Primary Key</label>
                      <div className="tm-modal__select-wrap">
                        <select className="tm-modal__select" value={editForm.isPrimaryKey} onChange={setEdit('isPrimaryKey')}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Default Value</label>
                      <input className="tm-modal__input" placeholder="Enter default value" value={editForm.defaultValue} onChange={setEdit('defaultValue')} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lookup Information */}
              <div className="tm-modal__section-head" onClick={() => setEditSections(s => ({ ...s, lookup: !s.lookup }))}>
                <span>Lookup Information</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: editSections.lookup ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {editSections.lookup && (
                <div className="tm-modal__section-body">
                  <div className="tm-modal__row">
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Lookup Table</label>
                      <div className="tm-modal__select-wrap">
                        <select className="tm-modal__select" value={editForm.lookupTable} onChange={setEdit('lookupTable')}>
                          <option value="">Select lookup table</option>
                          {tables.map(t => <option key={t.tableName} value={t.tableName}>{t.tableName}</option>)}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Value Field</label>
                      <input className="tm-modal__input" placeholder="Enter value field" value={editForm.valueField} onChange={setEdit('valueField')} />
                    </div>
                  </div>
                  <div className="tm-modal__field" style={{ marginTop: 12 }}>
                    <label className="tm-modal__label">Where</label>
                    <textarea className="tm-modal__input" placeholder="Enter where clause" value={editForm.where}
                      onChange={setEdit('where')} rows={3} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="tm-modal__section-head" onClick={() => setEditSections(s => ({ ...s, status: !s.status }))}>
                <span>Status</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: editSections.status ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {editSections.status && (
                <div className="tm-modal__section-body">
                  <div className="tm-modal__row">
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Status</label>
                      <div className="tm-modal__select-wrap">
                        <select className="tm-modal__select" value={editForm.status} onChange={setEdit('status')}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div className="tm-modal__field">
                      <label className="tm-modal__label">Display List</label>
                      <input className="tm-modal__input" placeholder="Enter display list" value={editForm.displayList} onChange={setEdit('displayList')} />
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="tm-modal__footer">
              {editError && <span className="tm-modal__error">{editError}</span>}
              <button className="tm-modal__cancel-btn" onClick={() => setShowEditModal(false)} disabled={editLoading}>Cancel</button>
              <button className="tm-modal__submit-btn" onClick={handleEditSubmit} disabled={editLoading}>
                {editLoading ? 'Updating…' : 'Update'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
