import React, { useState } from "react";
import "./Clientconfiguration.css";

interface IntegrationType {
  id: string;
  icon: string;
  label: string;
}

interface StatItem {
  label: string;
  value: string | number;
  cls?: string;
}

const TYPES: IntegrationType[] = [
  { id: "sdk",  icon: "🔧", label: "SDK Integration"       },
  { id: "port", icon: "🔌", label: "Port / RS232"          },
  { id: "api",  icon: "🌐", label: "REST API"              },
  { id: "db",   icon: "🗄️", label: "Database Access"       },
  { id: "file", icon: "📁", label: "File / Report Parser"  },
];

const Alert = ({ text }: { text: string }) => (
  <div className="cc__alert">
    <span>ℹ️</span>
    <span>{text}</span>
  </div>
);

const Field = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
  <div className={`cc__field ${span2 ? "cc__field--span2" : ""}`}>
    <label className="cc__label">{label}</label>
    {children}
  </div>
);

const SdkPanel = ({ onChange }: { onChange: () => void }) => (
  <div className="cc__grid">
    <Field label="SDK Library Path" span2>
      <input className="cc__input" defaultValue="C:\Waters\Empower3\SDK\Empower3.dll" onChange={onChange} />
    </Field>
    <Field label="Authentication Type">
      <select className="cc__select" onChange={onChange}>
        <option>Windows Authentication</option>
        <option>SQL Authentication</option>
        <option>SDK Token</option>
      </select>
    </Field>
    <Field label="Server Host">
      <input className="cc__input" defaultValue="EMP-SERVER-01" onChange={onChange} />
    </Field>
    <Field label="Port">
      <input className="cc__input" defaultValue="5432" onChange={onChange} />
    </Field>
    <Field label="Database Name">
      <input className="cc__input" defaultValue="EmpowerDB" onChange={onChange} />
    </Field>
    <Field label="Service Account">
      <input className="cc__input" defaultValue="svc_xception" onChange={onChange} />
    </Field>
    <Field label="Password">
      <input className="cc__input" type="password" defaultValue="supersecret" onChange={onChange} />
    </Field>
    <Field label="Connection Timeout (s)">
      <input className="cc__input" defaultValue="30" onChange={onChange} />
    </Field>
  </div>
);

const PortPanel = ({ onChange }: { onChange: () => void }) => (
  <div className="cc__grid">
    <Field label="Device IP Address">
      <input className="cc__input" defaultValue="192.168.1.45" onChange={onChange} />
    </Field>
    <Field label="Port Number">
      <input className="cc__input" defaultValue="9100" onChange={onChange} />
    </Field>
    <Field label="Protocol">
      <select className="cc__select" onChange={onChange}>
        <option>RS232</option><option>RS485</option><option>TCP/IP</option><option>UDP</option>
      </select>
    </Field>
    <Field label="Baud Rate">
      <select className="cc__select" onChange={onChange}>
        <option>9600</option><option>19200</option><option>38400</option><option>115200</option>
      </select>
    </Field>
    <Field label="Data Bits">
      <select className="cc__select" onChange={onChange}><option>8</option><option>7</option></select>
    </Field>
    <Field label="Stop Bits">
      <select className="cc__select" onChange={onChange}><option>1</option><option>2</option></select>
    </Field>
    <Field label="Parity">
      <select className="cc__select" onChange={onChange}><option>None</option><option>Even</option><option>Odd</option></select>
    </Field>
    <Field label="Polling Interval (s)">
      <input className="cc__input" defaultValue="5" onChange={onChange} />
    </Field>
  </div>
);

const ApiPanel = ({ onChange }: { onChange: () => void }) => (
  <div className="cc__grid">
    <Field label="Base URL" span2>
      <input className="cc__input" defaultValue="https://api.labsystem.internal/v2" onChange={onChange} />
    </Field>
    <Field label="Auth Method">
      <select className="cc__select" onChange={onChange}>
        <option>Bearer Token</option><option>API Key</option><option>OAuth2</option><option>Basic Auth</option>
      </select>
    </Field>
    <Field label="API Key / Token">
      <input className="cc__input" type="password" defaultValue="toknvalue" onChange={onChange} />
    </Field>
    <Field label="Data Endpoint">
      <input className="cc__input" defaultValue="/sequences/data" onChange={onChange} />
    </Field>
    <Field label="Method">
      <select className="cc__select" onChange={onChange}><option>GET</option><option>POST</option></select>
    </Field>
    <Field label="Response Format">
      <select className="cc__select" onChange={onChange}><option>JSON</option><option>XML</option><option>CSV</option></select>
    </Field>
    <Field label="Retry Attempts">
      <input className="cc__input" defaultValue="3" onChange={onChange} />
    </Field>
  </div>
);

const DbPanel = ({ onChange }: { onChange: () => void }) => (
  <div className="cc__grid">
    <Field label="Database Type">
      <select className="cc__select" onChange={onChange}>
        <option>SQL Server</option><option>Oracle</option><option>PostgreSQL</option><option>MySQL</option>
      </select>
    </Field>
    <Field label="Host">
      <input className="cc__input" defaultValue="db-server-01.internal" onChange={onChange} />
    </Field>
    <Field label="Port">
      <input className="cc__input" defaultValue="1433" onChange={onChange} />
    </Field>
    <Field label="Database Name">
      <input className="cc__input" defaultValue="LabSystemDB" onChange={onChange} />
    </Field>
    <Field label="Username">
      <input className="cc__input" defaultValue="xception_reader" onChange={onChange} />
    </Field>
    <Field label="Password">
      <input className="cc__input" type="password" defaultValue="dbpassword" onChange={onChange} />
    </Field>
    <Field label="Data Query (SQL)" span2>
      <textarea className="cc__textarea" defaultValue={`SELECT seq_id, sample_name, volume, rsd_pct, run_date\nFROM vw_sequence_results\nWHERE run_date >= GETDATE()-1`} onChange={onChange} />
    </Field>
  </div>
);

const FilePanel = ({ onChange }: { onChange: () => void }) => (
  <div className="cc__grid">
    <Field label="File Watch Directory" span2>
      <input className="cc__input" defaultValue="\\fileserver\lab-exports\empower" onChange={onChange} />
    </Field>
    <Field label="File Pattern">
      <input className="cc__input" defaultValue="*.csv, *.txt, *.xml" onChange={onChange} />
    </Field>
    <Field label="File Format">
      <select className="cc__select" onChange={onChange}>
        <option>CSV</option><option>Tab-Delimited TXT</option><option>XML</option><option>PDF (OCR)</option><option>XLSX</option>
      </select>
    </Field>
    <Field label="Delimiter">
      <input className="cc__input" defaultValue="," onChange={onChange} />
    </Field>
    <Field label="Header Row">
      <input className="cc__input" defaultValue="1" onChange={onChange} />
    </Field>
    <Field label="Data Start Row">
      <input className="cc__input" defaultValue="2" onChange={onChange} />
    </Field>
    <Field label='Column Mapping (JSON)' span2>
      <textarea className="cc__textarea" defaultValue={`{"sample_name":"Sample","volume":"Vol (mL)","rsd_pct":"RSD%","run_date":"Date/Time"}`} onChange={onChange} />
    </Field>
  </div>
);

const PANELS: Record<string, React.FC<{ onChange: () => void }>> = {
  sdk: SdkPanel, port: PortPanel, api: ApiPanel, db: DbPanel, file: FilePanel,
};

const ALERTS: Record<string, string> = {
  sdk:  "Connect via SDK/API parameters. Configure the parameters below to establish data access.",
  port: "IP-based RS232 port connection. Configure the parameters below to establish data access.",
  api:  "HTTP/REST API integration. Configure the parameters below to establish data access.",
  db:   "Direct DB connection & query. Configure the parameters below to establish data access.",
  file: "Parse exported files/reports. Configure the parameters below to establish data access.",
};

const ClientConfig = ({ onStatsChange }: { onStatsChange?: (stats: StatItem[]) => void }) => {
  const [activeType, setActiveType] = useState("sdk");
  const [isDirty,    setIsDirty]    = useState(false);
  const [saveState,  setSaveState]  = useState<"idle" | "saved">("idle");
  const [testState,  setTestState]  = useState<"idle" | "testing" | "ok" | "fail">("idle");

  React.useEffect(() => {
    if (!onStatsChange) return;
    onStatsChange([
      { label: "Integration", value: TYPES.find(t => t.id === activeType)?.label ?? '', cls: "" },
      { label: "Status",      value: "Online",   cls: "empower-stat__val--success" },
      { label: "Last Sync",   value: "2m ago",   cls: "" },
    ]);
  }, [activeType]);

  function switchType(id: string) {
    if (id === activeType) return;
    setActiveType(id);
    setIsDirty(false);
    setSaveState("idle");
    setTestState("idle");
  }

  function handleSave() {
    setIsDirty(false);
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  }

  function handleTest() {
    setTestState("testing");
    setTimeout(() => {
      setTestState("ok");
      setTimeout(() => setTestState("idle"), 2500);
    }, 1400);
  }

  const PanelComponent = PANELS[activeType];

  return (
    <div className="cc">
      <div className="cc__chips">
        {TYPES.map(t => (
          <button key={t.id} className={`cc__chip ${activeType === t.id ? "cc__chip--active" : ""}`} onClick={() => switchType(t.id)}>
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="cc__card">
        <div className="cc__card-title">
          {TYPES.find(t => t.id === activeType)?.icon} {TYPES.find(t => t.id === activeType)?.label} — Empower
        </div>

        <Alert text={ALERTS[activeType]} />

        <PanelComponent onChange={() => { setIsDirty(true); setSaveState("idle"); setTestState("idle"); }} />

        <div className="cc__btn-row">
          <button
            className={`cc__btn cc__btn--primary ${saveState === "saved" ? "cc__btn--saved" : ""}`}
            disabled={!isDirty && saveState !== "saved"}
            onClick={handleSave}
          >
            {saveState === "saved" ? "✓ Saved" : "💾 Save"}
          </button>

          <button
            className={`cc__btn ${testState === "ok" ? "cc__btn--ok" : testState === "fail" ? "cc__btn--fail" : ""}`}
            disabled={testState === "testing"}
            onClick={handleTest}
          >
            {testState === "testing" ? "⏳ Testing…"
              : testState === "ok"   ? "✅ Connection OK"
              : testState === "fail" ? "❌ Failed"
              : "🔗 Test Connection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientConfig;
