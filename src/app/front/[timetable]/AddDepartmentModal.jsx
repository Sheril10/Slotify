"use client";

import { useEffect, useState } from "react";
import styles from "./addDepartment.module.css";
import ConfirmModal from "./ConfirmModal";

export default function AddDepartmentModal({
  onClose,
  onSubmit,
  departments,
  setDepartments,
}) {
  const [localRows, setLocalRows] = useState(() =>
    departments?.length ? departments.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    sr: "",
    departmentId: "",
    code: "",
    name: ""
  });

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  const handleClose = () => {
    onSubmit(localRows);
    onClose();
  };

  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      departmentId: "",
      code: "",
      name: ""
    });

    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm(localRows[index]);
    setError("");
  };

  const saveRow = () => {
    if (!(form.departmentId || "").trim())
      return setError("Department ID required");

    if (!(form.code || "").trim())
      return setError("Code required");

    if (!(form.name || "").trim())
      return setError("Name required");

    const updated = [...localRows];

    if (mode === "edit") {
      updated[editingIndex] = form;
    } else {
      updated.push({ ...form, sr: (updated.length + 1).toString() });
    }

    const normalized = updated.map((r, i) => ({
      ...r,
      sr: (i + 1).toString(),
    }));

    setLocalRows(normalized);
    setMode("");
    setEditingIndex(null);

    setForm({
      sr: "",
      departmentId: "",
      code: "",
      name: ""
    });

    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) setDepartments([]);
  };

  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setDepartments([]);
    setShowConfirm(false);
    setMode("");
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (localRows.length === 0)
      return setError("Add at least one department");

    setDepartments(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setDepartments(localRows);
    onClose();
  };

  const filteredRows = localRows.filter(row =>
    (row.departmentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRows = Array.from(
    { length: Math.max(MAX_VISIBLE, filteredRows.length) },
    (_, i) => filteredRows[i] || null
  );

  return (
    <>
      <div className={styles.overlay} onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}>
        <div className={styles.modal}>

          <div className={styles.header}>
            <h2 style={{ flex: 1, textAlign: "center" }}>DEPARTMENTS</h2>

            <div className={styles.headerRight}>
              <button onClick={() => setMode(m => m === "search" ? "" : "search")}>🔍</button>
              <button onClick={handleClose}>✕</button>
            </div>
          </div>

          {mode === "search" && (
            <input
              className={styles.input}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <div>Sr</div>
              <div>Department ID</div>
              <div>Code</div>
              <div>Name</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.departmentId : "—"}</div>
                  <div>{row ? row.code : "—"}</div>
                  <div>{row ? row.name : "—"}</div>

                  <div>
                    {row ? (
                      <img src="/edit.png" className={styles.icon} onClick={() => startEdit(idx)} />
                    ) : (
                      <img src="/img1.png" className={styles.icon} onClick={startAdd} />
                    )}
                  </div>

                  <div>
                    {row && (
                      <img src="/trash.png" className={styles.icon} onClick={() => deleteRow(idx)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>

              <input
                className={styles.input}
                placeholder="Department ID"
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Code"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <button onClick={saveRow}>Save</button>
              <button onClick={() => setMode("")}>Cancel</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <div className={styles.leftActions}>
              <button onClick={startAdd}>Add</button>
              <button onClick={resetAll}>Reset</button>
              <button onClick={handleSaveForNow}>Save for now</button>
            </div>

            <div className={styles.rightActions}>
              <button className={styles.submitBtn} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>

        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="This will delete all departments. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}