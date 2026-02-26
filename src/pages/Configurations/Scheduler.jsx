import React, { useEffect, useState } from "react";
import "./Scheduler.css";

function Scheduler({ system = { name: "Unknown", assets: 0 }, onStatsChange }) {

  const orgs = ["PharmaCorp Global"];

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

  const [schedules, setSchedules] = useState([
    {
      id: "SCH-001",
      name: "Daily Morning Check",
      facility: "Facility A — Mumbai",
      freq: "Daily",
      time: "06:00",
      checks: "All",
      status: "active",
    },
    {
      id: "SCH-002",
      name: "Shift-1 Verification",
      facility: "Facility A — Mumbai",
      freq: "Shift-based",
      time: "07:00",
      checks: "Critical",
      status: "active",
    },
    {
      id: "SCH-003",
      name: "End-of-Day Report",
      facility: "Facility B — Hyderabad",
      freq: "Daily",
      time: "17:00",
      checks: "All",
      status: "paused",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    asset: "",
    freq: "Daily",
    time: "06:00",
    checks: "All",
  });

  useEffect(() => {
    if (onStatsChange) {
      onStatsChange([
        { value: schedules.length, label: "Total Schedules" },
        {
          value: schedules.filter((s) => s.status === "active").length,
          label: "Active",
        },
        {
          value: schedules.filter((s) => s.status === "paused").length,
          label: "Paused",
        },
      ]);
    }
  }, [schedules, onStatsChange]);

  const handleCreate = () => {
    const newSchedule = {
      id: `SCH-${String(schedules.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "active",
    };

    setSchedules([...schedules, newSchedule]);
    setShowModal(false);
    setFormData({
      name: "",
      facility: "",
      asset: "",
      freq: "Daily",
      time: "06:00",
      checks: "All",
    });
  };

  return (
    <div className="scheduler-container">

      {/* Header */}
      <div className="scheduler-header">
        <h2>Scheduler Data</h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Create Schedule
        </button>
      </div>

      {/* Schedule Cards */}
      <div className="schedule-grid">
        {schedules.map((s) => (
          <div key={s.id} className="schedule-card">
            <div className="schedule-card-header">
              <span className="schedule-id">{s.id}</span>
              <span className={`pill ${s.status}`}>{s.status}</span>
            </div>

            <div className="schedule-name">{s.name}</div>

            <div className="schedule-meta">
              <div>🏗 {s.facility}</div>
              <div>⏱ {s.freq} @ {s.time}</div>
              <div>✅ {s.checks}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h3>Create Schedule</h3>
              <span
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✖
              </span>
            </div>

            <div className="modal-body">

              <div className="form-group">
                <label>Schedule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Facility</label>
                <select
                  value={formData.facility}
                  onChange={(e) =>
                    setFormData({ ...formData, facility: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {facilities.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Asset</label>
                <select
                  value={formData.asset}
                  onChange={(e) =>
                    setFormData({ ...formData, asset: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {assets.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={formData.freq}
                  onChange={(e) =>
                    setFormData({ ...formData, freq: e.target.value })
                  }
                >
                  <option>Daily</option>
                  <option>Shift-based</option>
                  <option>Hourly</option>
                  <option>Weekly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>

              <button className="btn-primary" onClick={handleCreate}>
                Create
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Scheduler;