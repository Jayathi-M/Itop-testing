import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChecklistConfig from "./Checklistconfig";
import ClientConfig from "./Clientconfiguration";
import Scheduler from "./Scheduler";
import Workflow from "./Workflowconfig";
import "./Empower.css";

const TABS = [
  { id: "checklistconfig", label: "Check List Configuration" },
  { id: "client",          label: "Client Configuration" },
  { id: "scheduler",       label: "Schedule" },
  { id: "workflow",        label: "Workflow" },
];

/* Maps cls token from onStatsChange → pill colour variant */
const CLS_TO_VARIANT = {
  "empower-stat__val--danger":  "high",
  "empower-stat__val--warn":    "medium",
  "empower-stat__val--info":    "low",
  "empower-stat__val--success": "active",
  "empower-stat__val--muted":   "inactive",
  "":                           "neutral",
};

/* These variants get a coloured dot indicator */
const DOT_VARIANTS = new Set(["high", "medium", "low", "active", "inactive"]);

/* Insert a vertical divider BEFORE these stat indices
   0=High 1=Medium 2=Low | 3=CDS 4=Non-CDS | 5=Active 6=Inactive */
const SEP_BEFORE = new Set([3, 5]);

const Empower = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [tabStats,  setTabStats]  = useState(null);

  function handleTabClick(tabId) {
    setActiveTab(tabId);
    setTabStats(null);
  }

  return (
    <div className="empower-page">

      {/* ── Header block ── */}
      <div className="empower-header-block">

        <div className="breadcrumb empower-breadcrumb-indent">
          <span className="breadcrumb__link" onClick={() => navigate("/dashboard")}>
            System Dashboard
          </span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__link" onClick={() => navigate("/configurations/system")}>
            System Configurations
          </span>
          <span className="breadcrumb__sep">›</span>
          <span
            className="breadcrumb__link"
            onClick={() => navigate("/configurations/system", { state: { level: 1, cat: "Quality" } })}
          >
            Quality
          </span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Empower</span>
        </div>

        <div className="empower-header">

          {/* Title + badge — always visible */}
          <div className="empower-title-wrap">
            <h1 className="empower-title">Empower</h1>
            <span className="empower-badge">CDS Management System</span>
          </div>

          {/* Option A pill strip — appears when a tab reports stats */}
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

      {/* ── Tabs ── */}
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

      {/* ── Tab content ── */}
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
          <Workflow system={{ name: "Empower", assets: 3 }} onStatsChange={setTabStats} />
        )}

      </div>
    </div>
  );
};

export default Empower;