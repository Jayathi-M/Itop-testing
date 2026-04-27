import { useEffect, useState } from "react";
import "./Scheduler.css";

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
  name: string;
  facility: string;
  asset?: string;
  freq: string;
  time: string;
  checks: string;
  status: string;
  statusDate: string;
  draftStatus: string;
  draftDate: string;
}

interface FormData {
  name: string;
  facility: string;
  asset: string;
  freq: string;
  time: string;
  checks: string;
}

function Scheduler({ system = { name: "Unknown", assets: 0 }, onStatsChange }: { system?: SystemProp; onStatsChange?: (stats: StatItem[]) => void }) {

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

  const [searchTerm, setSearchTerm] = useState("");

  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "SCH-001", name: "Daily Morning Check",  facility: "Facility A — Mumbai",     freq: "Daily",       time: "06:00", checks: "All",      status: "active",    statusDate: now, draftStatus: "active",    draftDate: now },
    { id: "SCH-002", name: "Shift-1 Verification", facility: "Facility A — Mumbai",     freq: "Shift-based", time: "07:00", checks: "Critical",  status: "active",    statusDate: now, draftStatus: "active",    draftDate: now },
    { id: "SCH-003", name: "End-of-Day Report",     facility: "Facility B — Hyderabad",  freq: "Daily",       time: "17:00", checks: "All",      status: "paused",    statusDate: now, draftStatus: "paused",    draftDate: now },
    { id: "SCH-004", name: "End-of-Day Report",     facility: "Facility B — Hyderabad",  freq: "Daily",       time: "17:00", checks: "All",      status: "completed", statusDate: now, draftStatus: "completed", draftDate: now },
    { id: "SCH-005", name: "End-of-Day Report",     facility: "Facility B — Hyderabad",  freq: "Daily",       time: "17:00", checks: "All",      status: "inactive",  statusDate: now, draftStatus: "inactive",  draftDate: now },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData,  setFormData]  = useState<FormData>({
    name: "", facility: "", asset: "", freq: "Daily", time: "06:00", checks: "All",
  });

  useEffect(() => {
    if (onStatsChange) {
      onStatsChange([
        { value: schedules.length,                                           label: "Total Schedules" },
        { value: schedules.filter(s => s.status === "active").length,        label: "Active",    cls: "empower-stat__val--success" },
        { value: schedules.filter(s => s.status === "paused").length,        label: "Paused",    cls: "empower-stat__val--warn"    },
        { value: schedules.filter(s => s.status === "inactive").length,      label: "Inactive",  cls: ""                           },
        { value: schedules.filter(s => s.status === "completed").length,     label: "Completed", cls: ""                           },
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
        .map(s => s.id === id ? { ...s, status: s.draftStatus, statusDate: s.draftDate } : s)
        .filter(s => s.status !== "completed")
    );
  }

  function handleCreate() {
    setSchedules(prev => [...prev, {
      id: `SCH-${String(prev.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "active", statusDate: now, draftStatus: "active", draftDate: now,
    }]);
    setShowModal(false);
    setFormData({ name: "", facility: "", asset: "", freq: "Daily", time: "06:00", checks: "All" });
  }

  function isDirty(s: Schedule) {
    return s.draftStatus !== s.status || s.draftDate !== s.statusDate;
  }

  const filteredSchedules = schedules.filter(s => {
    const q = searchTerm.toLowerCase().trim();
    if (q) {
      return (
        s.id.toLowerCase().includes(q)       ||
        s.name.toLowerCase().includes(q)     ||
        s.facility.toLowerCase().includes(q) ||
        s.freq.toLowerCase().includes(q)     ||
        s.time.toLowerCase().includes(q)     ||
        s.checks.toLowerCase().includes(q)   ||
        s.status.toLowerCase().includes(q)
      );
    }
    return s.status !== "completed";
  });

  return (
    <div className="scheduler-container">

      <div className="scheduler-header">
        <h2>Scheduler</h2>
        <div className="scheduler-header-actions">
          <input
            type="text"
            placeholder="Search schedules..."
            className="sch-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="sch-btn-primary" onClick={() => setShowModal(true)}>
            + Create Schedule
          </button>
        </div>
      </div>

      <div className="schedule-grid">
        {filteredSchedules.length === 0 ? (
          <div className="sch-empty">No schedules match "{searchTerm}"</div>
        ) : (
          filteredSchedules.map(s => (
            <div key={s.id} className="schedule-card">
              <div className="schedule-card-header">
                <span className="schedule-id">{s.id}</span>
                <span className={`sch-pill sch-pill--${s.status}`}>{s.status}</span>
              </div>
              <div className="schedule-name">{s.name}</div>
              <div className="schedule-meta">
                <div>🏗 {s.facility}</div>
                <div>⏱ {s.freq} @ {s.time}</div>
                <div>✅ {s.checks}</div>
                <div>📅 {s.statusDate}</div>
              </div>
              <div className="sch-editor">
                <div className="sch-editor__row">
                  <div className="sch-field">
                    <label className="sch-field__label">Status</label>
                    <select className="sch-field__select" value={s.draftStatus} onChange={e => handleDraftStatus(s.id, e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="sch-field">
                    <label className="sch-field__label">Effective Date & Time</label>
                    <input className="sch-field__input" type="datetime-local" value={s.draftDate} onChange={e => handleDraftDate(s.id, e.target.value)} />
                  </div>
                </div>
                <div className="sch-editor__footer">
                  <button
                    className={`sch-update-btn ${isDirty(s) ? "sch-update-btn--dirty" : ""}`}
                    onClick={() => handleUpdate(s.id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="sch-modal">
            <div className="sch-modal__header">
              <h3>Create Schedule</h3>
              <span className="sch-modal__close" onClick={() => setShowModal(false)}>✖</span>
            </div>
            <div className="sch-modal__body">
              <div className="sch-form-group">
                <label>Schedule Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="sch-form-group">
                <label>Facility</label>
                <select value={formData.facility} onChange={e => setFormData({ ...formData, facility: e.target.value })}>
                  <option value="">Select...</option>
                  {facilities.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="sch-form-group">
                <label>Asset</label>
                <select value={formData.asset} onChange={e => setFormData({ ...formData, asset: e.target.value })}>
                  <option value="">Select...</option>
                  {assets.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="sch-form-group">
                <label>Frequency</label>
                <select value={formData.freq} onChange={e => setFormData({ ...formData, freq: e.target.value })}>
                  <option>Daily</option>
                  <option>Shift-based</option>
                  <option>Hourly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="sch-form-group">
                <label>Time</label>
                <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
              </div>
              <div className="sch-modal__actions">
                <button className="sch-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="sch-btn-primary" onClick={handleCreate}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Scheduler;
