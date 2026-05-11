import { useState, useEffect, useRef } from 'react'
import './FilterPanel.css'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FilterField {
  value: string
  label: string
}

export interface FilterRow {
  id: number
  logic: 'and' | 'or'
  field: string
  operator: string
  value: string
}

interface SavedFilter {
  name: string
  rows: Omit<FilterRow, 'id'>[]
}

interface FilterPanelProps {
  /** Dropdown options for the field selector */
  fields: FilterField[]
  /** Called whenever filter rows change — use to apply filtering in parent */
  onFilterChange: (rows: FilterRow[]) => void
  /** Storage key for saved filters (unique per page) — defaults to 'fp_saved_filters' */
  storageKey?: string
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const PlusGrayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)

const DotsHIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
)

// ── Constants ─────────────────────────────────────────────────────────────────

const OPERATORS = ['Contains', 'Is', 'Is not', 'Starts with', 'Ends with']

let nextId = 1
const newRow = (field: string): FilterRow => ({
  id: nextId++, logic: 'and', field, operator: 'Contains', value: ''
})

// ── Component ─────────────────────────────────────────────────────────────────

export default function FilterPanel({ fields, onFilterChange, storageKey = 'fp_saved_filters' }: FilterPanelProps) {
  const defaultField = fields[0]?.value ?? ''

  const [open, setOpen]               = useState(false)
  const [rows, setRows]               = useState<FilterRow[]>([newRow(defaultField)])
  const [openDotsId, setOpenDotsId]   = useState<number | null>(null)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [showSavedList, setShowSavedList] = useState(false)
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [saveNameInput, setSaveNameInput] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)

  // Notify parent whenever rows change
  useEffect(() => { onFilterChange(rows) }, [rows])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
        setOpenDotsId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ── Row helpers ──
  const updateRow = (id: number, key: keyof FilterRow, val: string) =>
    setRows(r => r.map(row => row.id === id ? { ...row, [key]: val } : row))

  const addRow = () =>
    setRows(r => [...r, newRow(defaultField)])

  const removeRow = (id: number) =>
    setRows(r => r.length === 1 ? r : r.filter(row => row.id !== id))

  const clearAll = () => {
    setRows([newRow(defaultField)])
    setOpen(false)
  }

  // ── Saved filter helpers ──
  const saveFilter = () => {
    const name = saveNameInput.trim()
    if (!name) return
    const updated = [...savedFilters.filter(s => s.name !== name), {
      name,
      rows: rows.map(({ id: _id, ...rest }) => rest)
    }]
    setSavedFilters(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setShowSaveInput(false)
    setSaveNameInput('')
  }

  const loadSavedFilter = (sf: SavedFilter) => {
    setRows(sf.rows.map(r => ({ ...r, id: nextId++ })))
    setShowSavedList(false)
  }

  const deleteSavedFilter = (name: string) => {
    const updated = savedFilters.filter(s => s.name !== name)
    setSavedFilters(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const activeCount = rows.filter(r => r.value.trim() !== '').length

  return (
    <div className="fp-wrap" ref={panelRef}>

      {/* Trigger button */}
      <button
        className={`fp-btn${open ? ' fp-btn--active' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <FilterIcon />
        <span>Filters</span>
        {activeCount > 0 && <span className="fp-badge">{activeCount}</span>}
      </button>

      {/* Panel */}
      {open && (
        <div className="fp-panel">

          {/* Saved filters */}
          {savedFilters.length > 0 && (
            <div className="fp-saved-section">
              <button className="fp-saved-toggle" onClick={() => setShowSavedList(o => !o)}>
                <SaveIcon />
                <span>Saved Filters ({savedFilters.length})</span>
                <ChevronIcon />
              </button>
              {showSavedList && (
                <div className="fp-saved-list">
                  {savedFilters.map(sf => (
                    <div key={sf.name} className="fp-saved-item">
                      <button className="fp-saved-item-name" onClick={() => loadSavedFilter(sf)}>
                        {sf.name}
                      </button>
                      <button className="fp-saved-item-del" onClick={() => deleteSavedFilter(sf.name)}>
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filter rows */}
          <div className="fp-rows">
            {rows.map((row, idx) => (
              <div key={row.id} className="fp-row">

                {/* Where / And-Or */}
                {idx === 0 ? (
                  <span className="fp-where">Where</span>
                ) : (
                  <div className="fp-select-wrap fp-logic-wrap">
                    <select
                      className="fp-select fp-logic-select"
                      value={row.logic}
                      onChange={e => updateRow(row.id, 'logic', e.target.value)}
                    >
                      <option value="and">And</option>
                      <option value="or">Or</option>
                    </select>
                    <ChevronIcon />
                  </div>
                )}

                {/* Field */}
                <div className="fp-select-wrap">
                  <select
                    className="fp-select"
                    value={row.field}
                    onChange={e => updateRow(row.id, 'field', e.target.value)}
                  >
                    {fields.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>

                {/* Operator */}
                <div className="fp-select-wrap">
                  <select
                    className="fp-select"
                    value={row.operator}
                    onChange={e => updateRow(row.id, 'operator', e.target.value)}
                  >
                    {OPERATORS.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>

                {/* Value */}
                <input
                  className="fp-input"
                  placeholder="Enter value"
                  value={row.value}
                  onChange={e => updateRow(row.id, 'value', e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') setOpen(false) }}
                />

                {/* Dots menu */}
                <div className="fp-row-menu-wrap">
                  <button
                    className="fp-row-dots"
                    onClick={() => setOpenDotsId(openDotsId === row.id ? null : row.id)}
                  >
                    <DotsHIcon />
                  </button>
                  {openDotsId === row.id && (
                    <div className="fp-row-menu">
                      <button
                        className="fp-row-menu-item"
                        onClick={() => { removeRow(row.id); setOpenDotsId(null) }}
                      >
                        <TrashIcon />
                        Remove filter
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Add filter */}
          <button className="fp-add" onClick={addRow}>
            <PlusGrayIcon />
            <span>Add filter</span>
          </button>

          {/* Footer */}
          <div className="fp-footer">
            <button className="fp-delete" onClick={clearAll}>
              <TrashIcon />
              <span>Delete filter</span>
            </button>
            <div className="fp-save-wrap">
              {showSaveInput ? (
                <>
                  <input
                    className="fp-save-input"
                    placeholder="Filter name"
                    value={saveNameInput}
                    autoFocus
                    onChange={e => setSaveNameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveFilter()
                      if (e.key === 'Escape') setShowSaveInput(false)
                    }}
                  />
                  <button className="fp-save-confirm" onClick={saveFilter}>Save</button>
                  <button className="fp-save-cancel" onClick={() => setShowSaveInput(false)}>✕</button>
                </>
              ) : (
                <button className="fp-save-btn" onClick={() => setShowSaveInput(true)}>
                  <SaveIcon />
                  <span>Save filter</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
