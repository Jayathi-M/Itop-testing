import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Review.css";

interface AuditItem {
  checkpoint: string;
  exception: string;
  justification: string;
  furtherReview?: string;
}

interface ReportItem {
  id: number;
  path: string;
  recordName: string;
  jobId: string;
  scheduleType: string;
  validationOn: string;
  status: string;
  auditTrail: AuditItem[];
}

export default function Report() {
  const [reportData, setReportData] =
    useState<ReportItem[]>([]);

  const [selectedRow, setSelectedRow] =
    useState<ReportItem | null>(null);

  const [pdfUrl, setPdfUrl] =
    useState<string>("");

  // ================= LOAD DATA =================

  useEffect(() => {
    const stored = localStorage.getItem(
      "submittedReports"
    );

    if (stored) {
      setReportData(JSON.parse(stored));
    }
  }, []);

  // ================= GENERATE PDF =================

  const generatePDF = (row: ReportItem) => {
    const doc = new jsPDF("p", "mm", "a4");

    // ================= TITLE =================

    doc.setFontSize(16);

    doc.setFont("helvetica", "bold");

    doc.text(
      "Sample Audit Trail Review Report",
      105,
      15,
      {
        align: "center",
      }
    );

    // ================= HEADER TABLE =================

    autoTable(doc, {
      startY: 25,

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 2,
      },

      body: [
        [
          "Sample Set Name",
          row.recordName,
          "PRODRE Version",
          "1",
          "Instrument ID",
          "CHEMO-01",
        ],
        ["Sample Set Path", row.path, "", "", "", ""],
        ["Job ID", row.jobId, "", "", "", ""],
        [
          "Schedule Type",
          row.scheduleType,
          "Validated On",
          row.validationOn,
          "",
          "",
        ],
      ],
    });

    // ================= MAIN TABLE =================

    autoTable(doc, {
      startY:
        (doc as any).lastAutoTable.finalY + 10,

      theme: "grid",

      head: [
        [
          "S.No",
          "Checkpoint Description",
          "Exception",
          "Justification",
          "Further Review Required",
        ],
      ],

      body: row.auditTrail.map((item, index) => [
        index + 1,
        item.checkpoint,
        item.exception,
        item.justification || "-",
        item.furtherReview || "No",
      ]),

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
      },
    });

    // ================= SIGNATURE TABLE =================

    autoTable(doc, {
      startY:
        (doc as any).lastAutoTable.finalY + 10,

      theme: "grid",

      body: [
        [
          "Submitted By",
          "Verified By",
          "Approved By",
          "Comments",
        ],
        ["", "", "", ""],
      ],

      styles: {
        halign: "center",
        fontStyle: "bold",
      },
    });

    return doc;
  };

  // ================= VIEW PDF =================

  const handlePreview = (row: ReportItem) => {
    setSelectedRow(row);

    const doc = generatePDF(row);

    const blob = doc.output("blob");

    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
  };

  // ================= DOWNLOAD PDF =================

  const handleDownload = () => {
    if (!selectedRow) return;

    const doc = generatePDF(selectedRow);

    doc.save(
      `${selectedRow.recordName}.pdf`
    );
  };

  return (
    <div className="rr-page">

      {/* ================= TABLE ================= */}

      <div className="rr-card">

        <table className="rr-table">

          <thead>
            <tr>
              <th>S.NO</th>
              <th>Path</th>
              <th>Record Name</th>
              <th>Job ID</th>
              <th>Schedule Type</th>
              <th>Validation On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {reportData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No submitted reports found
                </td>
              </tr>
            ) : (
              reportData.map((row, i) => (
                <tr key={row.id}>

                  <td>{i + 1}</td>

                  <td>{row.path}</td>

                  <td>{row.recordName}</td>

                  <td>{row.jobId}</td>

                  <td>{row.scheduleType}</td>

                  <td>{row.validationOn}</td>

                  <td>
                    <span className="status completed">
                      {row.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="eye-btn"
                      onClick={() =>
                        handlePreview(row)
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* ================= PDF PREVIEW MODAL ================= */}

      {selectedRow && (

        <div className="pdf-overlay">

          <div className="pdf-modal">

            {/* HEADER */}

            <div className="pdf-header">

              <h3>
                Sample Set Review Report
              </h3>

              <div className="pdf-actions">

                <button
                  className="download-btn"
                  onClick={handleDownload}
                >
                  Download
                </button>

                <button
                  className="close-btn"
                  onClick={() => {
                    setSelectedRow(null);
                    setPdfUrl("");
                  }}
                >
                  ✕
                </button>

              </div>

            </div>

            {/* PDF VIEWER */}

            <iframe
              src={pdfUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{
                border: "none",
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
}