"use client";

import { useEffect, useState } from "react";
import styles from "./addDepartment.module.css"; // create CSS similar to addShift.module.css

export default function AddDepartmentModal({ onClose, onSubmit, departments, setDepartments }) {
  const [localRows, setLocalRows] = useState(() =>
    departments && departments.length ? departments.map(d => ({ ...d })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ deptName: "", deptId: "" });
  const [error, setError] = useState("");
  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // === Add / Edit Functions ===
  const startAdd = () => {
    setMode("add");
    setEditingIndex(null);
    setForm({ deptName: "", deptId: "" });
    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm({ ...localRows[index] });
    setError("");
  };

  const saveRow = () => {
    if (!form.deptName.trim() || !form.deptId.trim()) {
      setError("⚠ Please fill all required fields.");
      return;
    }

    const updated = [...localRows];
    if (mode === "edit" && editingIndex !== null) {
      updated[editingIndex] = form;
    } else {
      updated.push(form);
    }

    setLocalRows(updated);
    setMode("");
    setEditingIndex(null);
    setForm({ deptName: "", deptId: "" });
  };

  const deleteRow = (index) => {
    const updated = localRows.filter((_, i) => i !== index);
    setLocalRows(updated);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one department before submitting.");
      return;
    }
    setDepartments(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setDepartments(localRows);
    onClose();
  };

  const visibleRowsCount = Math.max(MAX_VISIBLE, localRows.length);
  const visibleRows = Array.from({ length: visibleRowsCount }, (_, i) => localRows[i] || null);

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 style={{ flex: 1, textAlign: "center" }}>Departments</h2>
          <div className={styles.headerRight}>
            <button className={`${styles.iconCircle} ${styles.closeBtn}`} onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Department Name</div>
            <div>Department ID</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div key={idx} className={styles.tableRow}>
                <div>{row ? row.deptName : "—"}</div>
                <div>{row ? row.deptId : "—"}</div>
                <div>
                  {row ? (
                    <>
                      <img src="/edit.png" alt="Edit" className={styles.icon} onClick={() => startEdit(idx)} />
                      <img src="/trash.png" alt="Delete" className={styles.icon} onClick={() => deleteRow(idx)} />
                    </>
                  ) : (
                    <img src="/img1.png" alt="Add" className={styles.icon} onClick={startAdd} />
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
              placeholder="Department Name"
              value={form.deptName}
              onChange={(e) => setForm({ ...form, deptName: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Department ID"
              value={form.deptId}
              onChange={(e) => setForm({ ...form, deptId: e.target.value })}
            />
            <button onClick={saveRow}>Save</button>
            <button onClick={() => setMode("")}>Cancel</button>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <div className={styles.leftActions}>
            <button onClick={startAdd}>Add</button>
            <button onClick={() => setLocalRows([])}>Reset</button>
            <button onClick={handleSaveForNow}>Save for now</button>
          </div>
          <div className={styles.rightActions}>
            <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
