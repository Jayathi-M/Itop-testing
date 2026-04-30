import { useEffect, useState } from "react";
import "./Scheduler.css";
import "../Checklistconfig/Checklistconfig.css"; // reuse table styles

interface SystemProp {
  name: string;
  assets: number;
}

interface StatItem {
  value: number | string;
  label: string;
  cls?: string;
}

interface Schedule {
  id: string;
  plantName: string;
  module: string;
  scheduleType: string;
  frequency: string;
  interval: string;
  startDateTime: string;
  timezone: string;
  status: string;
  nextRun: string;
  lastRun: string;
  draftStatus: string;
  draftDate: string;
}

interface FormData {
  plant: string;
  module: string;
  checkpoints: string[];
  startDateTime: string;
  timezone: string;
  scheduleType: "Event" | "Periodic";
  frequency: "Hourly" | "Daily" | "Weekly" | "Monthly" | "Yearly";
}
const plants = [
  "Plant A - Mumbai",
  "Plant B - Hyderabad",
  "Plant C - Bangalore",
];

const modules = [
  "Inspection",
  "Safety",
  "Quality",
  "Production",
  "Maintenance",
];

const checkpointsList = [
  "Temperature Check",
  "Pressure Check",
  "Safety Gear Check",
  "Machine Health",
  "Oil Level",
];


const PAGE_SIZES = [5, 10, 20, 50];

function Scheduler({
  system = { name: "Unknown", assets: 0 },
  onStatsChange
}: {
  system?: SystemProp;
  onStatsChange?: (stats: StatItem[]) => void;
}) {

  const facilities = [
    "Facility A — Mumbai",
    "Facility B — Hyderabad",
    "Facility C — Bangalore",
  ];

  const assets =
    system.assets > 0
      ? Array.from({ length: system.assets }, (_, i) =>
        `${system.name} / Unit-${String(i + 1).padStart(2, "0")}`
      )
      : ["No assets configured"];

  const now = new Date().toISOString().slice(0, 16);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDirtyEdit, setIsDirtyEdit] = useState(false);

  const STATUS_OPTIONS = ["Active", "Inactive", "Paused", "Completed"];
  const [searchTerm, setSearchTerm] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "SCH-001", plantName: "Plant A - Mumbai", module: "Inspection", scheduleType: "Automatic", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 06:00", timezone: "UTC", status: "Active", nextRun: "2026-04-29 06:00", lastRun: "2026-04-28 06:00", draftStatus: "Active", draftDate: "2026-04-28 06:00" },
    { id: "SCH-002", plantName: "Plant B - Hyderabad", module: "Safety", scheduleType: "Manual", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-27 10:00", timezone: "UTC", status: "Paused", nextRun: "2026-05-04 10:00", lastRun: "2026-04-27 10:00", draftStatus: "Paused", draftDate: "2026-04-27 10:00" },
    { id: "SCH-003", plantName: "Plant C - Bangalore", module: "Quality", scheduleType: "Automatic", frequency: "Hourly", interval: "1h", startDateTime: "2026-04-28 08:00", timezone: "UTC", status: "Active", nextRun: "2026-04-28 09:00", lastRun: "2026-04-28 08:00", draftStatus: "Active", draftDate: "2026-04-28 08:00" },
    { id: "SCH-004", plantName: "Plant A - Mumbai", module: "Production", scheduleType: "Manual", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 07:00", timezone: "UTC", status: "Inactive", nextRun: "2026-04-29 07:00", lastRun: "2026-04-28 07:00", draftStatus: "Inactive", draftDate: "2026-04-28 07:00" },
    { id: "SCH-005", plantName: "Plant B - Hyderabad", module: "Maintenance", scheduleType: "Automatic", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-25 09:00", timezone: "UTC", status: "Active", nextRun: "2026-05-02 09:00", lastRun: "2026-04-25 09:00", draftStatus: "Active", draftDate: "2026-04-25 09:00" },
    { id: "SCH-006", plantName: "Plant C - Bangalore", module: "Inspection", scheduleType: "Automatic", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 06:30", timezone: "UTC", status: "Paused", nextRun: "2026-04-29 06:30", lastRun: "2026-04-28 06:30", draftStatus: "Paused", draftDate: "2026-04-28 06:30" },
    { id: "SCH-007", plantName: "Plant A - Mumbai", module: "Safety", scheduleType: "Manual", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-26 11:00", timezone: "UTC", status: "Active", nextRun: "2026-05-03 11:00", lastRun: "2026-04-26 11:00", draftStatus: "Active", draftDate: "2026-04-26 11:00" },
    { id: "SCH-008", plantName: "Plant B - Hyderabad", module: "Quality", scheduleType: "Automatic", frequency: "Hourly", interval: "1h", startDateTime: "2026-04-28 12:00", timezone: "UTC", status: "Inactive", nextRun: "2026-04-28 13:00", lastRun: "2026-04-28 12:00", draftStatus: "Inactive", draftDate: "2026-04-28 12:00" },
    { id: "SCH-009", plantName: "Plant C - Bangalore", module: "Production", scheduleType: "Manual", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 13:00", timezone: "UTC", status: "Active", nextRun: "2026-04-29 13:00", lastRun: "2026-04-28 13:00", draftStatus: "Active", draftDate: "2026-04-28 13:00" },
    { id: "SCH-010", plantName: "Plant A - Mumbai", module: "Maintenance", scheduleType: "Automatic", frequency: "Hourly", interval: "1h", startDateTime: "2026-04-28 14:00", timezone: "UTC", status: "Paused", nextRun: "2026-04-28 15:00", lastRun: "2026-04-28 14:00", draftStatus: "Paused", draftDate: "2026-04-28 14:00" },
    { id: "SCH-011", plantName: "Plant B - Hyderabad", module: "Inspection", scheduleType: "Automatic", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 16:00", timezone: "UTC", status: "Active", nextRun: "2026-04-29 16:00", lastRun: "2026-04-28 16:00", draftStatus: "Active", draftDate: "2026-04-28 16:00" },
    { id: "SCH-012", plantName: "Plant C - Bangalore", module: "Safety", scheduleType: "Manual", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-27 18:00", timezone: "UTC", status: "Inactive", nextRun: "2026-05-04 18:00", lastRun: "2026-04-27 18:00", draftStatus: "Inactive", draftDate: "2026-04-27 18:00" },
    { id: "SCH-013", plantName: "Plant A - Mumbai", module: "Quality", scheduleType: "Automatic", frequency: "Daily", interval: "24h", startDateTime: "2026-04-28 19:00", timezone: "UTC", status: "Active", nextRun: "2026-04-29 19:00", lastRun: "2026-04-28 19:00", draftStatus: "Active", draftDate: "2026-04-28 19:00" },
    { id: "SCH-014", plantName: "Plant B - Hyderabad", module: "Production", scheduleType: "Manual", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-26 12:00", timezone: "UTC", status: "Paused", nextRun: "2026-05-03 12:00", lastRun: "2026-04-26 12:00", draftStatus: "Paused", draftDate: "2026-04-26 12:00" },
    { id: "SCH-015", plantName: "Plant C - Bangalore", module: "Maintenance", scheduleType: "Automatic", frequency: "Hourly", interval: "1h", startDateTime: "2026-04-28 20:00", timezone: "UTC", status: "Active", nextRun: "2026-04-28 21:00", lastRun: "2026-04-28 20:00", draftStatus: "Active", draftDate: "2026-04-28 20:00" },
    { id: "SCH-016", plantName: "Plant A - Mumbai", module: "Inspection", scheduleType: "Automatic", frequency: "Daily", interval: "24h", startDateTime: "2026-04-29 06:00", timezone: "UTC", status: "Active", nextRun: "2026-04-30 06:00", lastRun: "2026-04-29 06:00", draftStatus: "Active", draftDate: "2026-04-29 06:00" },
    { id: "SCH-017", plantName: "Plant B - Hyderabad", module: "Safety", scheduleType: "Manual", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-29 10:00", timezone: "UTC", status: "Paused", nextRun: "2026-05-06 10:00", lastRun: "2026-04-29 10:00", draftStatus: "Paused", draftDate: "2026-04-29 10:00" },
    { id: "SCH-018", plantName: "Plant C - Bangalore", module: "Quality", scheduleType: "Automatic", frequency: "Hourly", interval: "1h", startDateTime: "2026-04-29 08:00", timezone: "UTC", status: "Inactive", nextRun: "2026-04-29 09:00", lastRun: "2026-04-29 08:00", draftStatus: "Inactive", draftDate: "2026-04-29 08:00" },
    { id: "SCH-019", plantName: "Plant A - Mumbai", module: "Production", scheduleType: "Manual", frequency: "Daily", interval: "24h", startDateTime: "2026-04-29 07:00", timezone: "UTC", status: "Active", nextRun: "2026-04-30 07:00", lastRun: "2026-04-29 07:00", draftStatus: "Active", draftDate: "2026-04-29 07:00" },
    { id: "SCH-020", plantName: "Plant B - Hyderabad", module: "Maintenance", scheduleType: "Automatic", frequency: "Weekly", interval: "7d", startDateTime: "2026-04-29 09:00", timezone: "UTC", status: "Paused", nextRun: "2026-05-06 09:00", lastRun: "2026-04-29 09:00", draftStatus: "Paused", draftDate: "2026-04-29 09:00" }
  ]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    plant: "",
    module: "",
    checkpoints: [],
    startDateTime: new Date().toISOString().slice(0, 16),
    timezone: "UTC",
    scheduleType: "Periodic",
    frequency: "Daily",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange([
        { value: schedules.length, label: "Total Schedules" },

        {
          value: schedules.filter(s => s.status === "Active").length,
          label: "Active",
          cls: "empower-stat__val--success"
        },

        {
          value: schedules.filter(s => s.status === "Paused").length,
          label: "Paused",
          cls: "empower-stat__val--warn"
        },

        {
          value: schedules.filter(s => s.status === "Inactive").length,
          label: "Inactive"
        },

        {
          value: schedules.filter(s => s.status === "Completed").length,
          label: "Completed"
        },
      ]);
    }
  }, [schedules, onStatsChange]);

  function handleDraftStatus(id: string, value: string) {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, draftStatus: value } : s));
  }

  function handleDraftDate(id: string, value: string) {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, draftDate: value } : s));
  }


  function handleUpdate(id: string) {
    setSchedules(prev =>
      prev
        .map(s =>
          s.id === id
            ? {
              ...s,
              status: s.draftStatus,
              startDateTime: s.draftDate,
            }
            : s
        )
        .filter(s => s.status !== "Completed")
    );
  }
  //
  function openEdit(schedule: Schedule) {
    const index = schedules.findIndex((s: Schedule) => s.id === schedule.id);

    setSelectedSchedule({ ...schedule });
    setEditIndex(index);
    setIsEditable(false);
    setIsDirtyEdit(false);
    setShowEditDialog(true);
  }

  function handleEditField(key: keyof Schedule, value: any) {
    if (!selectedSchedule || editIndex === null) return;

    const original = schedules[editIndex];

    const updated = { ...selectedSchedule, [key]: value };
    setSelectedSchedule(updated);

    const changed =
      updated.plantName !== original.plantName ||
      updated.module !== original.module ||
      updated.scheduleType !== original.scheduleType ||
      updated.status !== original.status;

    setIsDirtyEdit(changed);
  }

  function handleEditSave() {
    if (editIndex === null || !selectedSchedule) return;

    const updated = [...schedules];
    updated[editIndex] = selectedSchedule;

    setSchedules(updated);

    setShowEditDialog(false);
    setIsEditable(false);
    setIsDirtyEdit(false);
  }
  //

  function handleCreate() {
    const intervalMap: any = {
      Hourly: "1h",
      Daily: "24h",
      Weekly: "7d",
      Monthly: "30d",
      Yearly: "365d",
    };

    setSchedules(prev => [
      ...prev,
      {
        id: `SCH-${String(prev.length + 1).padStart(3, "0")}`,
        plantName: formData.plant,
        module: formData.module,
        scheduleType: formData.scheduleType,
        frequency:
          formData.scheduleType === "Periodic"
            ? formData.frequency
            : "Event",
        interval:
          formData.scheduleType === "Periodic"
            ? intervalMap[formData.frequency]
            : "Event-based",
        startDateTime: formData.startDateTime,
        timezone: formData.timezone,
        status: "Active",
        nextRun: formData.startDateTime,
        lastRun: "-",
        draftStatus: "Active",
        draftDate: formData.startDateTime,
      },
    ]);

    setShowModal(false);
  }

  function isDirty(s: Schedule) {
    return s.draftStatus !== s.status || s.draftDate !== s.startDateTime;
  }

  function pagePills(): (number | string)[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pills = new Set<number | string>([1, 2, 3]);
    if (safePage > 4) pills.add('..a');
    for (let i = Math.max(4, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pills.add(i);
    if (safePage < totalPages - 3) pills.add('..b');
    pills.add(totalPages - 1);
    pills.add(totalPages);
    return [...pills];
  }

  const filteredSchedules = schedules.filter(s => {
    const q = searchTerm.toLowerCase().trim();

    if (!q) return s.status !== "Completed";

    return (
      s.id.toLowerCase().includes(q) ||
      s.plantName.toLowerCase().includes(q) ||
      s.module.toLowerCase().includes(q) ||
      s.scheduleType.toLowerCase().includes(q) ||
      s.frequency.toLowerCase().includes(q) ||
      s.interval.toLowerCase().includes(q) ||
      s.startDateTime.toLowerCase().includes(q) ||
      s.timezone.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });


  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedSchedules = filteredSchedules.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  function goPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="scheduler-container">

      {/* HEADER */}
      <div className="scheduler-header">
        <h2>Scheduler</h2>
        <div>
          <input
            className="sch-search-input"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
          />
          <button className="sch-btn-primary" onClick={() => setShowModal(true)}>
            + Add Schedule
          </button>
        </div>
      </div>
      <div className="clc__table-wrap">
        <table className="clc__table">
          <thead>
            <tr>
              <th>SI.No</th>
              <th>Plant Name</th>
              <th>Module</th>
              <th>Schedule Type</th>
              <th>Frequency</th>
              <th>Interval</th>
              <th>Start Date + time + timezone (UTC,PST)</th>
              <th>Status</th>
              <th>Next Run</th>
              <th>Last Run</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedSchedules.map((s, idx) => (
              <tr key={s.id}>
                {/* SI.No */}
                <td>{(safePage - 1) * pageSize + idx + 1}</td>
                <td>{s.plantName}</td>
                <td>{s.module}</td>
                <td>{s.scheduleType}</td>
                <td>{s.frequency}</td>
                <td>{s.interval}</td>
                <td>
                  {s.startDateTime} ({s.timezone})
                </td>
                <td>
                  <span
                    className={`clc__status ${s.status === "Active"
                      ? "clc__status--active"
                      : s.status === "Paused"
                        ? "clc__status--paused"
                        : s.status === "Inactive"
                          ? "clc__status--inactive"
                          : "clc__status--completed"
                      }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td>{s.nextRun}</td>
                <td>{s.lastRun}</td>
                <td>
                  <div className="clc__row-actions">
                    <i
                      className="fa-solid fa-pen"
                      title="Edit"
                      onClick={() => openEdit(s)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {filteredSchedules.length === 0 && (
              <tr>
                <td colSpan={11} className="clc__empty-row">
                  No records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="clc__pagination">
        <div className="clc__pg-left">
          <select
            className="clc__page-size"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              resetPage();
            }}
          >
            {PAGE_SIZES.map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
        <div className="clc__pg-center">

          <button
            className="clc__pg-nav"
            onClick={() => goPage(safePage - 1)}
            disabled={safePage === 1}
          >
            ← Previous
          </button>
          <div className="clc__pg-pills">
            {pagePills().map((p, i) =>
              typeof p === 'string'
                ? <span key={i} className="clc__pg-dot">…</span>
                : (
                  <button
                    key={p}
                    className={`clc__pg-pill ${safePage === p ? 'clc__pg-pill--active' : ''}`}
                    onClick={() => goPage(p)}
                  >
                    {p}
                  </button>
                )
            )}
          </div>

          <button
            className="clc__pg-nav"
            onClick={() => goPage(safePage + 1)}
            disabled={safePage === totalPages}
          >
            Next →
          </button>

        </div>
        <div className="clc__pg-right">
          <span className="clc__pg-info">
            {filteredSchedules.length === 0
              ? '0 records'
              : `${(safePage - 1) * pageSize + 1}–${Math.min(
                safePage * pageSize,
                filteredSchedules.length
              )} of ${filteredSchedules.length}`}
          </span>
        </div>

      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sch-modal">
            <div className="sch-modal__header">
              <h3>Create Schedule</h3>
              <span
                className="sch-modal__close"
                onClick={() => setShowModal(false)}
              >
                ✖
              </span>
            </div>

            <div className="sch-modal__body">
              <div className="sch-form-group">
                <label>Plant</label>
                <select
                  value={formData.plant}
                  onChange={e =>
                    setFormData({ ...formData, plant: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {plants.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="sch-form-group">
                <label>Module</label>
                <select
                  value={formData.module}
                  onChange={e =>
                    setFormData({ ...formData, module: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {modules.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="sch-form-group">
                <label>Checkpoints</label>

                <div className="sch-checkbox-group">
                  {checkpointsList.map(c => (
                    <label key={c} className="sch-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.checkpoints.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              checkpoints: [...formData.checkpoints, c],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              checkpoints: formData.checkpoints.filter(x => x !== c),
                            });
                          }
                        }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sch-form-group">
                <label>Start Date & Time + Timezone</label>

                <div className="sch-row">
                  <input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        startDateTime: e.target.value,
                      })
                    }
                  />

                  <select
                    value={formData.timezone}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timezone: e.target.value,
                      })
                    }
                  >
                    <option value="UTC">UTC</option>
                    <option value="IST">IST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>
              </div>

              <div className="sch-form-group">
                <label>Schedule Type</label>
                <select
                  value={formData.scheduleType}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      scheduleType: e.target.value as "Event" | "Periodic",
                    })
                  }
                >
                  <option value="Event">Event Based</option>
                  <option value="Periodic">Periodic</option>
                </select>
              </div>
              {formData.scheduleType === "Periodic" && (
                <div className="sch-form-group">
                  <label>Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as any,
                      })
                    }
                  >
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              )}
              <div className="sch-modal__actions">
                <button
                  className="sch-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="sch-btn-primary"
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditDialog && selectedSchedule && (
        <div
          className="clc__overlay"
          onClick={() => {
            if (isDirtyEdit && !window.confirm("Discard changes?")) return;
            setShowEditDialog(false);
          }}
        >
          <div className="clc__dialog" onClick={e => e.stopPropagation()}>

            <div className="clc__dialog-header">
              <h3>Edit Schedule</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowEditDialog(false)} />
            </div>

            <div className="clc__section">

              <div className="clc__section-header">
                <h4>Schedule Details</h4>

                <div className="clc__section-actions">
                  {!isEditable ? (
                    <button
                      className="clc__btn clc__btn--edit"
                      onClick={() => setIsEditable(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        className="clc__btn clc__btn--cancel"
                        onClick={() => {
                          if (editIndex !== null) {
                            setSelectedSchedule({ ...schedules[editIndex] });
                          }
                          setIsEditable(false);
                          setIsDirtyEdit(false);
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className="clc__btn clc__btn--save"
                        disabled={!isDirtyEdit}
                        onClick={handleEditSave}
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="clc__field">
                <label>Plant Name</label>
                <select
                  disabled={!isEditable}
                  value={selectedSchedule.plantName}
                  onChange={e => handleEditField("plantName", e.target.value)}
                >
                  {plants.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="clc__field">
                <label>Module</label>
                <select
                  disabled={!isEditable}
                  value={selectedSchedule.module}
                  onChange={e => handleEditField("module", e.target.value)}
                >
                  {modules.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="clc__field">
                <label>Schedule Type</label>
                <select
                  disabled={!isEditable}
                  value={selectedSchedule.scheduleType}
                  onChange={e => handleEditField("scheduleType", e.target.value)}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="clc__field">
                <label>Status</label>
                <select
                  disabled={!isEditable}
                  value={selectedSchedule.status}
                  onChange={e => handleEditField("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Scheduler;


