import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChecklistConfig from "../Checklistconfig/Checklistconfig";
import ClientConfig from "../Clientconfig/Clientconfiguration";
import Scheduler from "../Scheduler/Scheduler";
import Workflow from "../Workflowconfig/Workflowconfig";
import "./Empower.css";

interface Tab {
  id: string;
  label: string;
}

interface StatItem {
  label: string;
  value: number | string;
  cls?: string;
}

const TABS: Tab[] = [
  { id: "checklistconfig", label: "Check List Configuration" },
  { id: "client",          label: "Client Configuration" },
  { id: "scheduler",       label: "Schedule" },
  { id: "workflow",        label: "Workflow" },
];

const CLS_TO_VARIANT: Record<string, string> = {
  "empower-stat__val--danger":  "high",
  "empower-stat__val--warn":    "medium",
  "empower-stat__val--info":    "low",
  "empower-stat__val--success": "active",
  "empower-stat__val--muted":   "inactive",
  "":                           "neutral",
};

const DOT_VARIANTS = new Set(["high", "medium", "low", "active", "inactive"]);
const SEP_BEFORE   = new Set([3, 5]);

const Empower = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabStats,  setTabStats]  = useState<StatItem[] | null>(null);

  function handleTabClick(tabId: string) {
    setActiveTab(tabId);
    setTabStats(null);
  }

  return (
    <div className="empower-page">

      <div className="empower-header-block">

        <div className="breadcrumb empower-breadcrumb-indent">
          <span className="breadcrumb__link" onClick={() => navigate("/dashboard")}>System Dashboard</span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__link" onClick={() => navigate("/configurations/system")}>System Configurations</span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__link" onClick={() => navigate("/configurations/system", { state: { level: 1, cat: "Quality" } })}>Quality</span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Empower</span>
        </div>

        <div className="empower-header">
          <div className="empower-title-wrap">
            <h1 className="empower-title">Empower</h1>
            <span className="empower-badge">CDS Management System</span>
          </div>

          {activeTab && tabStats && (
            <div className="empower-statbar">
              {tabStats.map((stat, i) => {
                const variant = CLS_TO_VARIANT[stat.cls ?? ""] ?? "neutral";
                const hasDot  = DOT_VARIANTS.has(variant);
                return (
                  <React.Fragment key={i}>
                    {SEP_BEFORE.has(i) && <span className="emp-pill-sep" />}
                    <div className={`emp-pill emp-pill--${variant}`}>
                      {hasDot && <span className="emp-pill-dot" />}
                      <span className="emp-pill-val">{stat.value}</span>
                      <span className="emp-pill-lbl">{stat.label}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="empower-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`empower-tab ${activeTab === tab.id ? "empower-tab--active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="empower-tab-content">

        {!activeTab && (
          <div className="empower-empty">
            <div className="empower-empty__icon">📋</div>
            <div className="empower-empty__text">Select a tab to get started</div>
          </div>
        )}

        {activeTab === "checklistconfig" && (
          <ChecklistConfig onStatsChange={setTabStats} />
        )}

        {activeTab === "client" && (
          <ClientConfig onStatsChange={setTabStats} />
        )}

        {activeTab === "scheduler" && (
          <Scheduler system={{ name: "Empower", assets: 3 }} onStatsChange={setTabStats} />
        )}

        {activeTab === "workflow" && (
          <Workflow onDirty={() => {}} />
        )}

      </div>
    </div>
  );
};

export default Empower;
