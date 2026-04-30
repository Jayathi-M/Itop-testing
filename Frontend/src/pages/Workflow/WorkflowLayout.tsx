import React, { useState } from 'react'

import QueuePage from './Queue'
import ReviewPage from './Review'
import ReportPage from './Report'

import './WorkflowLayout.css'

const DashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
  </svg>
)

const QueueIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="8"
      y1="6"
      x2="21"
      y2="6"
    />
    <line
      x1="8"
      y1="12"
      x2="21"
      y2="12"
    />
    <line
      x1="8"
      y1="18"
      x2="21"
      y2="18"
    />
    <line
      x1="3"
      y1="6"
      x2="3.01"
      y2="6"
    />
    <line
      x1="3"
      y1="12"
      x2="3.01"
      y2="12"
    />
    <line
      x1="3"
      y1="18"
      x2="3.01"
      y2="18"
    />
  </svg>
)

const ReviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="5"
      rx="1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="5"
      rx="1"
    />
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
    />
    <line
      x1="3"
      y1="16"
      x2="21"
      y2="16"
    />
    <line
      x1="3"
      y1="20"
      x2="14"
      y2="20"
    />
  </svg>
)

const ReportIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

    <polyline points="14 2 14 8 20 8" />

    <line
      x1="8"
      y1="13"
      x2="16"
      y2="13"
    />

    <line
      x1="8"
      y1="17"
      x2="16"
      y2="17"
    />
  </svg>
)

const AgentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
    />

    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
  </svg>
)

const AuditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />

    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)


export interface QueueRow {
  id: number
  path: string
  name: string
  sampleSetId: string
  requestedType: string
  requestedBy: string
  requestedOn: string
  status: string
}

export interface Checkpoint {
  id: number
  desc: string
  exception: string
  justification: string
  reviewedOn: string
  reviewedBy: string
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */

const NAV_ITEMS = [
  {
    id: 0,
    label: 'Dashboard',
    Icon: DashIcon,
  },

  {
    id: 1,
    label: 'Queue',
    Icon: QueueIcon,
  },

  {
    id: 2,
    label: 'Record Review',
    Icon: ReviewIcon,
  },

  {
    id: 3,
    label: 'Report',
    Icon: ReportIcon,
  },

  {
    id: 4,
    label: 'Agent Logs',
    Icon: AgentIcon,
  },

  {
    id: 5,
    label: 'Audit Trail',
    Icon: AuditIcon,
  },
]

/* ─────────────────────────────────────────────
   CHECKPOINTS
───────────────────────────────────────────── */

const BASE_CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    desc:
      'Risk Level shows how sensitive a privilege is.',

    exception: 'yes',

    justification: '',

    reviewedOn:
      '20-03-2026 10:13:59',

    reviewedBy: 'system',
  },

  {
    id: 2,

    desc:
      'Unprocessed Channels detected in the sample set.',

    exception: 'no',

    justification: '',

    reviewedOn:
      '20-03-2026 10:13:59',

    reviewedBy: 'system',
  },

  {
    id: 3,

    desc:
      'System Suitability RSD values exceed threshold.',

    exception: 'yes',

    justification: '',

    reviewedOn: '',

    reviewedBy: '',
  },

  {
    id: 4,

    desc:
      'Peak Tailing Factor is outside acceptable range.',

    exception: 'yes',

    justification: '',

    reviewedOn: '',

    reviewedBy: '',
  },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function WorkflowLayout() {
  const [activeStep, setActiveStep] =
    useState(1)

  const [selectedRow, setSelectedRow] =
    useState<QueueRow | null>(null)

  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>([])

  const [
    submittedReports,
    setSubmittedReports,
  ] = useState<any[]>([])

  /* ───────────────────────────────────── */

  function handleSelectRow(
    row: QueueRow
  ) {
    setSelectedRow(row)

    setCheckpoints(
      BASE_CHECKPOINTS.map(c => ({
        ...c,
      }))
    )

    setActiveStep(2)
  }

  /* ───────────────────────────────────── */

  return (
    <div className="wfl-shell">

      {/* SIDEBAR */}

      <aside className="wfl-sidebar">

        {/* HOME */}

        <div className="wfl-sidebar__home">

          <button className="wfl-sidebar__home-btn">
            <i className="fa-solid fa-house" />
          </button>

          <span className="wfl-sidebar__home-label">
            Home
          </span>

        </div>

        {/* AUDIT LABEL */}

        <div className="wfl-sidebar__section-label">

          <div className="wfl-sidebar__audit-icon">
            <i className="fa-solid fa-shield-halved" />
          </div>

          <span>Audit</span>

        </div>

        {/* NAVIGATION */}

        <nav className="wfl-sidebar__nav">

          {NAV_ITEMS.map(
            ({ id, label, Icon }) => (

              <button
                key={id}
                className={`wfl-nav-item ${
                  activeStep === id
                    ? 'wfl-nav-item--active'
                    : ''
                }`}
                onClick={() => {

                  if (
                    id === 2 &&
                    !selectedRow
                  )
                    return

                  setActiveStep(id)
                }}
              >

                <span className="wfl-nav-item__icon">
                  <Icon />
                </span>

                <span className="wfl-nav-item__label">
                  {label}
                </span>

              </button>
            )
          )}

        </nav>

      </aside>

      {/* MAIN */}

      <main className="wfl-main">

        {/* QUEUE */}

        {activeStep === 1 && (
          <QueuePage
            onSelectRow={
              handleSelectRow
            }
          />
        )}

        {/* REVIEW */}

        {activeStep === 2 &&
          selectedRow && (

            <ReviewPage
              row={selectedRow}
              checkpoints={
                checkpoints
              }
              setCheckpoints={
                setCheckpoints
              }
              onCancel={() =>
                setActiveStep(1)
              }
              onSubmit={(
                reports: any[]
              ) => {
                setSubmittedReports(
                  reports
                )

                setActiveStep(3)
              }}
              submittedReports={
                submittedReports
              }
              setSubmittedReports={
                setSubmittedReports
              }
            />

          )}

        {/* REPORT */}

        {activeStep === 3 && (

          <ReportPage
            submittedReports={
              submittedReports
            }
            onBack={() =>
              setActiveStep(1)
            }
          />

        )}

        {/* PLACEHOLDER */}

        {[0, 4, 5].includes(
          activeStep
        ) && (

          <div className="wfl-placeholder">

            <i className="fa-solid fa-circle-info" />

            <p>
              Select a section
              from the sidebar
            </p>

          </div>

        )}

      </main>

    </div>
  )
}