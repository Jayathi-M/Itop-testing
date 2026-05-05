import './CreateTable.css'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onTableCreated: (tableName: string) => void
}

type Column = {
  name: string
  dataType: string
}

const DATA_TYPES = ['TEXT', 'INTEGER', 'BOOLEAN', 'DECIMAL', 'DATE', 'TIMESTAMP', 'UUID']

export default function CreateTable({ onClose, onTableCreated }: Props) {
  const [tableName, setTableName] = useState('')
  const [columns, setColumns] = useState<Column[]>([{ name: '', dataType: 'TEXT' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addColumn = () => {
    setColumns([...columns, { name: '', dataType: 'TEXT' }])
  }

  const updateColumn = (index: number, value: string) => {
    const updated = [...columns]
    updated[index].name = value
    setColumns(updated)
  }

  const updateDataType = (index: number, value: string) => {
    const updated = [...columns]
    updated[index].dataType = value
    setColumns(updated)
  }

  const removeColumn = (index: number) => {
    const updated = columns.filter((_, i) => i !== index)
    setColumns(updated)
  }

  const handleCreate = async () => {
    if (!tableName.trim()) {
      setError('Table name is required.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5134/api/TableMaster/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: tableName.trim(),
          tableSchema: 'UMS',
          columns: columns
            .filter(c => c.name.trim() !== '')
            .map(c => ({ name: c.name.trim(), dataType: c.dataType }))  // UPDATED - sends objects
        })
      })

      if (!response.ok) {
        const msg = await response.text()
        setError(msg || 'Failed to create table.')
        return
      }

      onTableCreated(tableName.trim())
      onClose()

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ctm-overlay">
      <div className="ctm-box">

        <h2>Create Table</h2>

        {error && <p className="ctm-error">{error}</p>}

        <input
          className="ctm-input"
          placeholder="Enter table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />

        <div className="ctm-columns">
          {columns.map((col, index) => (
            <div key={index} className="ctm-column-row">

              <input
                placeholder="Column Name"
                value={col.name}
                onChange={(e) => updateColumn(index, e.target.value)}
              />

              <select
                className="ctm-type-select"
                value={col.dataType}
                onChange={(e) => updateDataType(index, e.target.value)}
              >
                {DATA_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {columns.length > 1 && (
                <button
                  className="ctm-remove-btn"
                  onClick={() => removeColumn(index)}
                >
                  ❌
                </button>
              )}

            </div>
          ))}
        </div>

        <button className="ctm-add-col-btn" onClick={addColumn}>
          + Add Column
        </button>

        <div className="ctm-actions">
          <button className="ctm-create-btn" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button className="ctm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}