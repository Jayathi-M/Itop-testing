import { useState, useMemo } from 'react'
import './Queue.css'

/* ───────────────── TYPES ───────────────── */

type Status = 'Approved' | 'Rejected'

interface QueueRow {
  id: number
  path: string
  name: string
  samplesetId: string
  requestedType: string
  requestedBy: string
  requestedOn: string
  status: Status
}

/* ───────────────── MOCK DATA ───────────────── */

const MOCK_ROWS: QueueRow[] = [
  {
    id: 1,
    path: 'Production/2024/Batch_01',
    name: 'FESO_RES_001',
    samplesetId: 'EX-248',
    requestedType: 'CHK-248',
    requestedBy: 'Harshita',
    requestedOn: 'Apr 17, 10:20 AM',
    status: 'Approved',
  },
  {
    id: 2,
    path: 'Production/2024/Batch_02',
    name: 'FESO_RES_002',
    samplesetId: 'EX-249',
    requestedType: 'CHK-249',
    requestedBy: 'Abhishek',
    requestedOn: 'Apr 18, 11:10 AM',
    status: 'Rejected',
  },
  {
    id: 3,
    path: 'Stability/April',
    name: 'STAB_RES_003',
    samplesetId: 'EX-250',
    requestedType: 'CHK-250',
    requestedBy: 'Pavan',
    requestedOn: 'Apr 18, 03:15 PM',
    status: 'Approved',
  },
]

const PATH_OPTIONS = [
  'All',
  'Production/2024/Batch_01',
  'Production/2024/Batch_02',
  'Stability/April',
  'Validation/System_A',
  'Archive/2023',
]

const PAGE_SIZE = 7

/* ───────────────── COMPONENT ───────────────── */

export default function AuditQueue() {

  const [search, setSearch] =
    useState('')

  const [pathFilter, setPathFilter] =
    useState('All')

  const [page, setPage] =
    useState(1)

  /* TABLE ROWS */

  const [rows, setRows] =
    useState<QueueRow[]>(MOCK_ROWS)

  /* MODAL */

  const [showOnDemand, setShowOnDemand] =
    useState(false)

  /* FORM FIELDS */

  const [odPath, setOdPath] =
    useState(PATH_OPTIONS[1])

  const [odName, setOdName] =
    useState('')

  const [odId, setOdId] =
    useState('')

  const [odReason, setOdReason] =
    useState('')

  const [odErrors, setOdErrors] =
    useState<Record<string, string>>({})

  /* ───────────────── FILTER ───────────────── */

  const filtered = useMemo(() => {

    let filteredRows = [...rows]

    if (pathFilter !== 'All') {

      filteredRows =
        filteredRows.filter(
          r => r.path === pathFilter
        )
    }

    if (search.trim()) {

      const q =
        search.toLowerCase()

      filteredRows =
        filteredRows.filter(r =>
          Object.values(r).some(v =>
            String(v)
              .toLowerCase()
              .includes(q)
          )
        )
    }

    return filteredRows

  }, [rows, search, pathFilter])

  /* ───────────────── PAGINATION ───────────────── */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const safePage =
    Math.min(page, totalPages)

  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  function pageNumbers():
    (number | '...')[] {

    if (totalPages <= 7) {

      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      )
    }

    return [1, 2, 3, '...', totalPages]
  }

  /* ───────────────── RETRY ───────────────── */

  function handleRetry(id: number) {

    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              requestedOn:
                new Date().toLocaleString(),
            }
          : r
      )
    )
  }

  /* ───────────────── DELETE ───────────────── */

  function handleRemove(id: number) {

    setRows(prev =>
      prev.filter(r => r.id !== id)
    )
  }

  /* ───────────────── SAVE ───────────────── */

  function handleOdSave() {

    const errs:
      Record<string, string> = {}

    if (!odName.trim()) {
      errs.name = 'Required'
    }

    if (!odId.trim()) {
      errs.id = 'Required'
    }

    if (!odReason.trim()) {
      errs.reason = 'Required'
    }

    if (
      Object.keys(errs).length > 0
    ) {
      setOdErrors(errs)
      return
    }

    const now = new Date()

    const formatted =
      now.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
        }
      ) +
      ', ' +
      now.toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      )

    const newRow: QueueRow = {

      id: Date.now(),

      path: odPath,

      name: odName,

      samplesetId: odId,

      requestedType: 'Manual',

      requestedBy: odReason,

      requestedOn: formatted,

      status: 'Approved',
    }

    /* ADD TO TABLE */

    setRows(prev => [
      newRow,
      ...prev,
    ])

    /* CLOSE MODAL */

    setShowOnDemand(false)

    /* RESET FIELDS */

    setOdName('')
    setOdId('')
    setOdReason('')

    setOdErrors({})
  }

  return (

    <div className="aq-page">

      {/* ───────── TOOLBAR ───────── */}

      <div className="aq-toolbar">

        <div className="aq-search-wrap">

          <i className="fa-solid fa-magnifying-glass aq-search-icon" />

          <input
            className="aq-search"
            placeholder="Search"
            value={search}
            onChange={e => {
              setSearch(
                e.target.value
              )
              setPage(1)
            }}
          />

        </div>

        <div className="aq-toolbar__right">

          {/* REFRESH */}

          <button className="aq-icon-btn">
            <i className="fa-solid fa-rotate" />
          </button>

          {/* FILTER */}

          <div className="aq-path-pill">

            <span>Path:</span>

            <select
              className="aq-path-select"
              value={pathFilter}
              onChange={e => {
                setPathFilter(
                  e.target.value
                )
                setPage(1)
              }}
            >

              {PATH_OPTIONS.map(p => (

                <option
                  key={p}
                  value={p}
                >
                  {p}
                </option>

              ))}

            </select>

          </div>

          {/* ADD BUTTON */}

          <button
            className="aq-demand-btn"
            onClick={() =>
              setShowOnDemand(true)
            }
          >

            <i className="fa-solid fa-plus" />

            On Demand Request

          </button>

        </div>

      </div>

      {/* ───────── TABLE ───────── */}

      <div className="aq-table-wrap">

        <table className="aq-table">

          <thead>

            <tr>
              <th>S.NO</th>
              <th>Path</th>
              <th>Name</th>
              <th>Sampleset ID</th>
              <th>Requested Type</th>
              <th>Requested By</th>
              <th>Requested On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {paged.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="aq-empty"
                >
                  No records found
                </td>

              </tr>

            ) : (

              paged.map((row, i) => (

                <tr
                  key={row.id}
                  className="aq-row"
                >

                  {/* FIXED SERIAL NUMBER */}

                  <td>
                    {((safePage - 1) * PAGE_SIZE) + i + 1}
                  </td>

                  <td>{row.path}</td>

                  <td>{row.name}</td>

                  <td>
                    {row.samplesetId}
                  </td>

                  <td>
                    {row.requestedType}
                  </td>

                  <td>
                    {row.requestedBy}
                  </td>

                  <td>
                    {row.requestedOn}
                  </td>

                  <td>

                    <span
                      className={`aq-badge aq-badge--${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>

                  </td>

                  <td>

                    <div className="aq-actions">

                      {/* RETRY */}

                      <button
                        className="aq-act-btn aq-act-btn--retry"
                        onClick={() =>
                          handleRetry(
                            row.id
                          )
                        }
                      >
                        <i className="fa-solid fa-rotate-right" />
                      </button>

                      {/* DELETE */}

                      <button
                        className="aq-act-btn aq-act-btn--remove"
                        onClick={() =>
                          handleRemove(
                            row.id
                          )
                        }
                      >
                        <i className="fa-solid fa-trash" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ───────── PAGINATION ───────── */}

      <div className="aq-pagination">

        <button
          className="aq-pg-nav"
          disabled={safePage === 1}
          onClick={() =>
            setPage(p =>
              Math.max(1, p - 1)
            )
          }
        >
          ← Previous
        </button>

        <div className="aq-pg-nums">

          {pageNumbers().map(
            (n, i) =>

              n === '...' ? (

                <span
                  key={i}
                  className="aq-pg-ellipsis"
                >
                  ...
                </span>

              ) : (

                <button
                  key={n}
                  className={`aq-pg-num ${
                    safePage === n
                      ? 'aq-pg-num--active'
                      : ''
                  }`}
                  onClick={() =>
                    setPage(
                      n as number
                    )
                  }
                >
                  {n}
                </button>

              )
          )}

        </div>

        <button
          className="aq-pg-nav"
          disabled={
            safePage === totalPages
          }
          onClick={() =>
            setPage(p =>
              Math.min(
                totalPages,
                p + 1
              )
            )
          }
        >
          Next →
        </button>

      </div>

      {/* ───────── MODAL ───────── */}

      {showOnDemand && (

        <div
          className="aq-modal-backdrop"
          onClick={() =>
            setShowOnDemand(false)
          }
        >

          <div
            className="aq-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="aq-modal__header">

              <div>

                <h2>
                  On demand request
                </h2>

                <p>
                  Supporting text
                </p>

              </div>

              <button
                className="aq-modal__close"
                onClick={() =>
                  setShowOnDemand(false)
                }
              >
                ✕
              </button>

            </div>

            {/* BODY */}

            <div className="aq-modal__body">

              {/* PATH */}

              <div className="aq-field">

                <label>
                  Checklist Path
                </label>

                <select
                  className="aq-input"
                  value={odPath}
                  onChange={e =>
                    setOdPath(
                      e.target.value
                    )
                  }
                >

                  {PATH_OPTIONS
                    .filter(
                      p => p !== 'All'
                    )
                    .map(p => (

                      <option
                        key={p}
                        value={p}
                      >
                        {p}
                      </option>

                    ))}

                </select>

              </div>

              {/* NAME */}

              <div className="aq-field">

                <label>
                  Checklist Name
                </label>

                <input
                  className="aq-input"
                  placeholder="Enter checklist name"
                  value={odName}
                  onChange={e =>
                    setOdName(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* ID */}

              <div className="aq-field">

                <label>
                  Checklist ID
                </label>

                <input
                  className="aq-input"
                  placeholder="Enter checklist ID"
                  value={odId}
                  onChange={e =>
                    setOdId(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* REASON */}

              <div className="aq-field">

                <label>
                  Reason
                </label>

                <textarea
                  className="aq-input"
                  placeholder="Enter a reason"
                  value={odReason}
                  onChange={e =>
                    setOdReason(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="aq-modal__footer">

              <button
                className="aq-modal__cancel"
                onClick={() =>
                  setShowOnDemand(false)
                }
              >
                Cancel
              </button>

              <button
                className="aq-modal__save"
                onClick={handleOdSave}
              >
                Save & Add to Queue
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}