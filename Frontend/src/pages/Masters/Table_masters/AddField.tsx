import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './AddField.css'

interface TableInfo {
  tableSchema: string
  tableName: string
}

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

interface SectionHeadProps {
  title: string
  open: boolean
  onToggle: () => void
}

function SectionHead({ title, open, onToggle }: SectionHeadProps) {
  return (
    <div className={`af-section-head ${open ? 'af-section-head--open' : ''}`} onClick={onToggle}>
      <span className="af-section-title">{title}</span>
      <ChevronDownIcon open={open} />
    </div>
  )
}

export default function AddField() {
  const navigate = useNavigate()
  const location = useLocation()
  const state    = location.state as { tableName?: string; tableSchema?: string } | null

  const [tables, setTables] = useState<TableInfo[]>([])

  useEffect(() => {
    fetch('http://localhost:5134/api/TableMaster/tables')
      .then(res => res.json())
      .then((data: TableInfo[]) => setTables(data))
      .catch(() => {})
  }, [])

  const [sections, setSections] = useState({ basic: true, lookup: true, status: true })
  const toggle = (k: keyof typeof sections) => setSections(s => ({ ...s, [k]: !s[k] }))

  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [form, setForm] = useState({
    tableName:    state?.tableName    ?? '',
    tableSchema:  state?.tableSchema  ?? '',
    fieldName:    '',
    labelName:    '',
    fieldType:    '',
    fieldLength:  '',
    isPrimaryKey: '',
    defaultValue: '',
    lookupTable:  '',
    displayField: '',
    valueField:   '',
    where:        '',
    status:       'Active',
    displayList:  '',
  })

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('http://localhost:5134/api/TableMaster/create-columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_schema:             form.tableSchema  || '',
          table_name:               form.tableName    || '',
          column_name:              form.fieldName    || '',
          label_name:               form.labelName    || '',
          data_type:                form.fieldType    || '',
          character_maximum_length: form.fieldLength ? Number(form.fieldLength) : 0,
          column_default:           form.defaultValue || '',
          is_nullable:              form.isPrimaryKey === 'yes' ? 'NO' : 'YES',
          lookup_table_name:        form.lookupTable  || '',
          lookup_text_field:        form.displayField || '',
          lookup_value_field:       form.valueField   || '',
          lookup_filter:            form.where        || '',
          is_active:                form.status === 'Active',
          is_displaylist:           form.displayList.trim() !== '',
          is_dynamic:               true,
        }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      navigate(-1)
    } catch {
      setSaveError('Failed to save field. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="af-page">
      <div className="af-card">

        {/* sticky header */}
        <div className="af-header">
          <div className="af-header__text">
            <h2 className="af-header__title">Add Field</h2>
            <p className="af-header__sub">Fill in the details to create a new field.</p>
          </div>
          <button className="af-close-btn" onClick={() => navigate(-1)}>
            <XIcon />
          </button>
        </div>

        {/* scrollable body */}
        <div className="af-body">
          <div className="af-inner">

            {/* ── Basic Information ── */}
            <div className="af-section">
              <SectionHead title="Basic Information" open={sections.basic} onToggle={() => toggle('basic')} />
              {sections.basic && (
                <div className="af-section__body">

                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Table name *</label>
                      <div className="af-select-wrap">
                        <select
                          className="af-select"
                          value={form.tableName}
                          onChange={e => {
                            const selected = tables.find(t => t.tableName === e.target.value)
                            setForm(f => ({ ...f, tableName: e.target.value, tableSchema: selected?.tableSchema ?? '' }))
                          }}
                        >
                          <option value="">Select table</option>
                          {tables.map(t => (
                            <option key={t.tableName} value={t.tableName}>{t.tableName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="af-field">
                      <label className="af-label">Field Name *</label>
                      <input className="af-input" placeholder="Enter field name" value={form.fieldName} onChange={set('fieldName')} />
                    </div>
                  </div>

                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Label Name *</label>
                      <input className="af-input" placeholder="Enter label name" value={form.labelName} onChange={set('labelName')} />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Field Type *</label>
                      <div className="af-select-wrap">
                        <select className="af-select" value={form.fieldType} onChange={set('fieldType')}>
                          <option value="">Select field type</option>
                          <option value="character varying">Text (character varying)</option>
                          <option value="integer">Integer</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="numeric">Numeric (Float)</option>
                          <option value="timestamp">Timestamp</option>
                          <option value="text">Text (unlimited)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Field Length *</label>
                      <input className="af-input" placeholder="Enter field length" type="number" value={form.fieldLength} onChange={set('fieldLength')} />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Is primary key *</label>
                      <div className="af-select-wrap">
                        <select className="af-select" value={form.isPrimaryKey} onChange={set('isPrimaryKey')}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="af-row af-row--full">
                    <div className="af-field">
                      <label className="af-label">Default Value *</label>
                      <input className="af-input" placeholder="Enter default value" value={form.defaultValue} onChange={set('defaultValue')} />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ── Lookup Information ── */}
            <div className="af-section">
              <SectionHead title="Lookup Information" open={sections.lookup} onToggle={() => toggle('lookup')} />
              {sections.lookup && (
                <div className="af-section__body">

                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Lookup Table *</label>
                      <div className="af-select-wrap">
                        <select className="af-select" value={form.lookupTable} onChange={set('lookupTable')}>
                          <option value="">Select lookup table</option>
                          {tables.map(t => (
                            <option key={t.tableName} value={t.tableName}>{t.tableName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="af-field">
                      <label className="af-label">Lookup Display Field *</label>
                      <div className="af-select-wrap">
                        <select className="af-select" value={form.displayField} onChange={set('displayField')}>
                          <option value="">Select display field</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Value Field *</label>
                      <input className="af-input" placeholder="Enter value field" value={form.valueField} onChange={set('valueField')} />
                    </div>
                  </div>

                  <div className="af-row af-row--full">
                    <div className="af-field">
                      <label className="af-label">Where *</label>
                      <textarea className="af-textarea" placeholder="Enter" value={form.where} onChange={set('where')} rows={3} />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ── Status ── */}
            <div className="af-section">
              <SectionHead title="Status" open={sections.status} onToggle={() => toggle('status')} />
              {sections.status && (
                <div className="af-section__body">
                  <div className="af-row">
                    <div className="af-field">
                      <label className="af-label">Status *</label>
                      <div className="af-select-wrap">
                        <select className="af-select" value={form.status} onChange={set('status')}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="af-field">
                      <label className="af-label">Display List *</label>
                      <input className="af-input" placeholder="Enter display list" value={form.displayList} onChange={set('displayList')} />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* sticky footer */}
        <div className="af-footer">
          {saveError && <span style={{ color: '#f04438', fontSize: '13px', marginRight: 'auto' }}>{saveError}</span>}
          <button className="af-footer__cancel" onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
          <button className="af-footer__save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Field'}
          </button>
        </div>

      </div>
    </div>
  )
}
