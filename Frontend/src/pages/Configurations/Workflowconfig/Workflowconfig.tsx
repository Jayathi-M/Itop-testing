import { useState } from "react";
import { createPortal } from "react-dom";
import "./Workflowconfig.css";

interface WorkflowStep {
  role: string;
  action: string;
  user: string;
  required: boolean;
}

interface AddForm {
  role: string;
  action: string;
  user: string;
  required: boolean;
}

interface AddErrors {
  role?: string;
  action?: string;
  user?: string;
}

const ROLE_OPTIONS = ["Analyst", "Reviewer", "Approver"];

const USER_OPTIONS = [
  "Any Analyst",
  "Senior Scientist",
  "QA Manager",
  "John Doe",
  "Jane Smith",
];

const DEFAULT_STEPS: WorkflowStep[] = [
  { role: "Analyst", action: "Acknowledge", user: "Analyst", required: true },
  { role: "Reviewer", action: "Review & Verify", user: "Reviewer", required: true },
  { role: "Approver", action: "Final Approval", user: "Approver", required: true },
];

const PAGE_SIZES = [5, 10, 20, 50];

const EMPTY_FORM: AddForm = {
  role: "",
  action: "",
  user: "",
  required: true,
};

export default function WorkflowConfig() {
  const [steps, setSteps] = useState<WorkflowStep[]>(DEFAULT_STEPS);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<AddErrors>({});

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const filtered = steps.filter(s =>
    `${s.role} ${s.action} ${s.user}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  function goPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  function resetPage() {
    setPage(1);
  }

  function pagePills(): (number | string)[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pills = new Set<number | string>([1, 2, 3]);

    if (safePage > 4) pills.add("..a");

    for (
      let i = Math.max(4, safePage - 1);
      i <= Math.min(totalPages - 1, safePage + 1);
      i++
    ) {
      pills.add(i);
    }

    if (safePage < totalPages - 3) pills.add("..b");

    pills.add(totalPages - 1);
    pills.add(totalPages);

    return [...pills];
  }

  function openAddModal() {
    setAddForm(EMPTY_FORM);
    setAddErrors({});
    setShowAddModal(true);
  }

  function closeAddModal() {
    setShowAddModal(false);
  }

  function handleField(key: keyof AddForm, value: any) {
    setAddForm(prev => ({ ...prev, [key]: value }));
    setAddErrors(prev => ({ ...prev, [key]: "" }));
  }

  function handleAddSubmit() {
    const errs: AddErrors = {};

    if (!addForm.role) errs.role = "Required";
    if (!addForm.action.trim()) errs.action = "Required";
    if (!addForm.user) errs.user = "Required";

    if (Object.keys(errs).length) {
      setAddErrors(errs);
      return;
    }

    setSteps(prev => [addForm, ...prev]);

    setPage(1);
    setShowAddModal(false);
  }

  function handleEdit(index: number) {
    setSelectedStep({ ...steps[index] });
    setEditIndex(index);
    setIsEditable(false);
    setIsDirty(false);
    setShowEditDialog(true);
  }

  function handleEditField(key: keyof WorkflowStep, value: any) {
    if (!selectedStep) return;

    setSelectedStep(prev => ({
      ...prev!,
      [key]: value
    }));

    setIsDirty(true);
  }

  function handleEditSave() {
    if (editIndex === null || !selectedStep) return;

    const updated = [...steps];
    updated[editIndex] = selectedStep;

    setSteps(updated);

    setShowEditDialog(false);
    setIsEditable(false);
    setIsDirty(false);
  }

  function handleDelete(i: number) {
    setSteps(prev => prev.filter((_, idx) => idx !== i));
  }

  function toggleRequired(i: number) {
    const updated = [...steps];
    updated[i].required = !updated[i].required;
    setSteps(updated);
  }

  return (
    <div className="wf">
      <div className="wf__header">
        <div>
          <h3 className="wf__title">Workflow Configuration</h3>
          <p className="wf__sub">Manage approval workflow levels</p>
        </div>

        <div className="wf__actions">
          <div className="wf__search-wrap">
            <i className="fa-solid fa-magnifying-glass wf__search-icon" />
            <input
              className="wf__search"
              placeholder="Search workflow..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </div>

          <button className="wf__add-btn" onClick={openAddModal}>
            + Add Level
          </button>
        </div>
      </div>
      <div className="wf__table-wrap">
        <table className="wf__table">
          <thead>
            <tr>
              <th>Level</th>
              <th>User</th>
              <th>Action</th>
              <th>Role</th>
              <th>Required</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {current.map((step, i) => {
              const index = start + i;

              return (
                <tr key={index}>
                  <td>L{index + 1}</td>
                  <td>{step.user}</td>
                  <td>{step.action}</td>
                  <td>{step.role}</td>

                  <td>
                    <input
                      type="checkbox"
                      checked={step.required}
                      onChange={() => toggleRequired(index)}
                    />
                  </td>

                  <td>
                    <div className="clc__row-actions">
                      <i
                        className="fa-solid fa-pen"
                        title="Edit"
                        onClick={() => handleEdit(index)}
                      />
                      <i
                        className="fa-solid fa-xmark"
                        title="Delete"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {current.length === 0 && (
              <tr>
                <td colSpan={6} className="wf__empty">
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
            {pagePills().map(p =>
              typeof p === "string"
                ? <span key={p} className="clc__pg-dot">…</span>
                : (
                  <button
                    key={p}
                    className={`clc__pg-pill ${safePage === p ? "clc__pg-pill--active" : ""}`}
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
            {filtered.length === 0
              ? "0 records"
              : `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`}
          </span>
        </div>
      </div>
      {showAddModal && createPortal(
        <div className="clc__modal-backdrop" onClick={closeAddModal}>
          <div className="clc__modal" onClick={e => e.stopPropagation()}>
            <div className="clc__modal-header">
              <h3>Add Workflow Level</h3>
              <i className="fa-solid fa-xmark" onClick={closeAddModal} />
            </div>

            <div className="clc__modal-body">

              <div className="clc__modal-field">
                <label>Role *</label>
                <select className="clc__modal-input"
                  value={addForm.role}
                  onChange={e => handleField("role", e.target.value)}>
                  <option value="">Select Role</option>
                  {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="clc__modal-field">
                <label>Action *</label>
                <input className="clc__modal-input"
                  value={addForm.action}
                  onChange={e => handleField("action", e.target.value)} />
              </div>

              <div className="clc__modal-field">
                <label>User *</label>
                <select className="clc__modal-input"
                  value={addForm.user}
                  onChange={e => handleField("user", e.target.value)}>
                  <option value="">Select User</option>
                  {USER_OPTIONS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="clc__modal-field clc__modal-field--inline">
                <label>Required</label>
                <input
                  type="checkbox"
                  checked={addForm.required}
                  onChange={e => handleField("required", e.target.checked)}
                />
              </div>
            </div>

            <div className="clc__modal-footer">
              <button className="clc__modal-btn clc__modal-btn--cancel" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="clc__modal-btn clc__modal-btn--submit" onClick={handleAddSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {showEditDialog && selectedStep && createPortal(
        <div className="clc__overlay" onClick={() => setShowEditDialog(false)}>
          <div className="clc__dialog" onClick={e => e.stopPropagation()}>

            <div className="clc__dialog-header">
              <h3>Edit Workflow Level</h3>
              <i className="fa-solid fa-xmark" onClick={() => setShowEditDialog(false)} />
            </div>

            <div className="clc__section">
              <div className="clc__section-header">
                <h4>Workflow Details</h4>

                <div className="clc__section-actions">
                  <button
                    className="clc__btn clc__btn--edit"
                    onClick={() => {
                      setIsEditable(true);
                      setIsDirty(false);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="clc__btn clc__btn--save"
                    disabled={!isDirty || !isEditable}
                    onClick={handleEditSave}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="clc__field">
                <label>Role</label>
                <select
                  disabled={!isEditable}
                  value={selectedStep.role}
                  onChange={e => handleEditField("role", e.target.value)}
                >
                  {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="clc__field">
                <label>Action</label>
                <input
                  disabled={!isEditable}
                  value={selectedStep.action}
                  onChange={e => handleEditField("action", e.target.value)}
                />
              </div>

              <div className="clc__field">
                <label>User</label>
                <select
                  disabled={!isEditable}
                  value={selectedStep.user}
                  onChange={e => handleEditField("user", e.target.value)}
                >
                  {USER_OPTIONS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="clc__field clc__field--inline">
                <label>Required</label>
                <input
                  type="checkbox"
                  disabled={!isEditable}
                  checked={selectedStep.required}
                  onChange={e => handleEditField("required", e.target.checked)}
                />
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}