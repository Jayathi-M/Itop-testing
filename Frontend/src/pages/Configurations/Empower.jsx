import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChecklistConfig from "./Checklistconfig";
import ClientConfig from "./Clientconfiguration";
import Scheduler from "./Scheduler";
import Workflow from "./Workflowconfig";
import "./Empower.css";

const TABS = [
  { id: "checklistconfig", label: "Check List Configuration" },
  { id: "client", label: "Client Configuration" },
  { id: "scheduler", label: "Schedule" },
  { id: "workflow", label: "Workflow" },
];

const Empower = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [tabStats, setTabStats] = useState(null);

  function handleTabClick(tabId) {
    setActiveTab(tabId);
    setTabStats(null);
  }

  return (
    <div className="empower-page">

      {/* Header */}
      <div className="empower-header-block">

        <div className="breadcrumb empower-breadcrumb-indent">
          <span
            className="breadcrumb__link"
            onClick={() => navigate("/dashboard")}
          >
            System Dashboard
          </span>
          <span className="breadcrumb__sep">›</span>
          <span
            className="breadcrumb__link"
            onClick={() => navigate("/configurations/system")}
          >
            System Configurations
          </span>
          <span className="breadcrumb__sep">›</span>
          <span
            className="breadcrumb__link"
            onClick={() =>
              navigate("/configurations/system", {
                state: { level: 1, cat: "Quality" },
              })
            }
          >
            Quality
          </span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Empower</span>
        </div>

        <div className="empower-header">
          <div className="empower-title-wrap">
            <h1 className="empower-title">Empower</h1>
            <span className="empower-badge">CDS Management System</span>
          </div>

          {activeTab && tabStats && (
            <div className="empower-stats">
              {tabStats.map((stat, i) => (
                <div key={i} className="empower-stat">
                  <div className={`empower-stat__val ${stat.cls || ""}`}>
                    {stat.value}
                  </div>
                  <div className="empower-stat__lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="empower-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`empower-tab ${
              activeTab === tab.id ? "empower-tab--active" : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="empower-tab-content">

        {!activeTab && (
          <div className="empower-empty">
            <div className="empower-empty__icon">📋</div>
            <div className="empower-empty__text">
              Select a tab to get started
            </div>
          </div>
        )}

        {activeTab === "checklistconfig" && (
          <ChecklistConfig onStatsChange={setTabStats} />
        )}

        {activeTab === "client" && (
          <ClientConfig onStatsChange={setTabStats} />
        )}

        {activeTab === "scheduler" && (
          <Scheduler
            system={{ name: "Empower", assets: 3 }}
            onStatsChange={setTabStats}
          />
        )}

        {activeTab === "workflow" && (
          <Workflow
            system={{ name: "Empower", assets: 3 }}
            onStatsChange={setTabStats}
          />
        )}

      </div>
    </div>
  );
};

export default Empower;