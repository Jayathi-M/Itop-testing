import { useNavigate } from "react-router-dom";
import "./Review.css";

const data = [
  {
    id: 1,
    path: "2024/Batch_Review/JAN",
    recordName: "FESO_RES_001",
    jobId: "BCPID_260319",
    scheduleType: "Batch",
    validatedOn: "Apr 17, 10:20 AM",
    status: "Pending for L2",
  },

  {
    id: 2,
    path: "2024/System_Check/FEB",
    recordName: "RISK_AUDIT_145",
    jobId: "BCPID_260320",
    scheduleType: "Periodic",
    validatedOn: "Apr 18, 09:15 AM",
    status: "Completed",
  },

  {
    id: 3,
    path: "2024/Data_Integrity/MAR",
    recordName: "QC_VALIDATION_210",
    jobId: "BCPID_260321",
    scheduleType: "Batch",
    validatedOn: "Apr 18, 11:45 AM",
    status: "Pending for L1",
  },

  {
    id: 4,
    path: "2025/User_Access/APR",
    recordName: "USER_ACCESS_501",
    jobId: "BCPID_260322",
    scheduleType: "Periodic",
    validatedOn: "Apr 19, 01:10 PM",
    status: "Completed",
  },

  {
    id: 5,
    path: "2025/Audit_Logs/MAY",
    recordName: "DATA_VERIFY_778",
    jobId: "BCPID_260323",
    scheduleType: "Batch",
    validatedOn: "Apr 20, 04:30 PM",
    status: "Pending for L3",
  },

  {
    id: 6,
    path: "2025/Validation/JUN",
    recordName: "AUDIT_TRAIL_901",
    jobId: "BCPID_260324",
    scheduleType: "Periodic",
    validatedOn: "Apr 21, 08:00 AM",
    status: "Completed",
  },

  {
    id: 7,
    path: "2025/Periodic_Check/JUL",
    recordName: "SYSTEM_REVIEW_650",
    jobId: "BCPID_260325",
    scheduleType: "Batch",
    validatedOn: "Apr 22, 06:45 PM",
    status: "Pending for L2",
  },
];

export default function RecordReviewList() {

  const navigate = useNavigate();

  return (
    <div className="rr-page">

      {/* ================= TOP FILTER BAR ================= */}

      <div className="top-bar">

        <input
          className="search"
          placeholder="Search"
        />

        <select className="dropdown">
          <option>
            System: All
          </option>
        </select>

        <select className="dropdown">
          <option>
            Date: Last 30 days
          </option>
        </select>

        <button className="icon-btn">
          ☰
        </button>

        <button className="icon-btn">
          ⋮
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="rr-card">

        <table className="rr-table">

          <thead>

            <tr>
              <th>S.NO</th>
              <th>Path</th>
              <th>Record Name</th>
              <th>Job ID</th>
              <th>Schedule Type ↓</th>
              <th>Validated On ↓</th>
              <th>Status ↓</th>
            </tr>

          </thead>

          <tbody>

            {data.map((row, i) => (

              <tr
                key={row.id}
                onClick={() =>
                  navigate(
                    `/audit/record-review/${row.id}`,
                    {
                      state: row,
                    }
                  )
                }
                style={{
                  cursor: "pointer",
                }}
              >

                <td>{i + 1}</td>

                <td>{row.path}</td>

                <td>
                  {row.recordName}
                </td>

                <td>{row.jobId}</td>

                <td>
                  {row.scheduleType}
                </td>

                <td>
                  {row.validatedOn}
                </td>

                <td>

                  <span
                    className={`status ${
                      row.status.includes(
                        "Completed"
                      )
                        ? "completed"
                        : "pending"
                    }`}
                  >
                    {row.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* ================= PAGINATION ================= */}

        <div className="pagination-bar">

          <button className="btn secondary">
            Previous
          </button>

          <div className="pages">

            <span className="active">
              1
            </span>

            <span>2</span>

            <span>3</span>

            <span>…</span>

            <span>8</span>

            <span>9</span>

            <span>10</span>

          </div>

          <button className="btn secondary">
            Next
          </button>

        </div>

      </div>

      {/* ================= BOTTOM ACTION BAR ================= */}

      <div className="bottom-bar">

        <div className="nav-arrows">

          <button className="circle-btn">
            ←
          </button>

          <button className="circle-btn">
            →
          </button>

        </div>

        <div className="actions">

          <button className="btn cancel">
            Cancel
          </button>

          <button className="btn submit">
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}