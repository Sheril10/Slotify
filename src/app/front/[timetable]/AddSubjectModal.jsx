"use client";

import { useEffect, useState } from "react";
import styles from "./addSubject.module.css";
import ConfirmModal from "./ConfirmModal";

export default function AddSubjectModal({
  onClose,
  onSubmit,
  subjects,
  setSubjects,
}) {
  const [localRows, setLocalRows] = useState(() =>
    subjects?.length ? subjects.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    sr: "",
    subjectId: "",
    name: "",
    code: "",
    isLab: ""
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

  // ================= CLOSE =================
  const handleClose = () => {
    setSubjects(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      subjectId: "",
      name: "",
      code: "",
      isLab: ""
    });

    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm(localRows[index]);
    setError("");
  };

  // ================= SAVE =================
  const saveRow = () => {
    if (!(form.subjectId || "").trim())
      return setError("Subject ID required");

    if (!(form.name || "").trim())
      return setError("Subject Name required");

    if (!(form.code || "").trim())
      return setError("Code required");

    if (!form.isLab)
      return setError("Select Lab option");

    const updated = [...localRows];

    if (mode === "edit") {
      updated[editingIndex] = form;
    } else {
      updated.push({
        ...form,
        sr: (updated.length + 1).toString(),
      });
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
      subjectId: "",
      name: "",
      code: "",
      isLab: ""
    });

    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) setSubjects([]);
  };

  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setSubjects([]);
    setShowConfirm(false);
    setMode("");
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (localRows.length === 0)
      return setError("Add at least one subject");

    setSubjects(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setSubjects(localRows);
    onClose();
  };

  const filteredRows = localRows.filter(row =>
    (row.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.subjectId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.code || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRows = Array.from(
    { length: Math.max(MAX_VISIBLE, filteredRows.length) },
    (_, i) => filteredRows[i] || null
  );

  return (
    <>
      <div
        className={styles.overlay}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className={styles.modal}>

          {/* HEADER */}
          <div className={styles.header}>
            <h2 style={{ flex: 1, textAlign: "center" }}>SUBJECTS</h2>

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

          {/* TABLE */}
          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <div>Sr</div>
              <div>Subject ID</div>
              <div>Name</div>
              <div>Code</div>
              <div>Lab</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.subjectId : "—"}</div>
                  <div>{row ? row.name : "—"}</div>
                  <div>{row ? row.code : "—"}</div>
                  <div>{row ? row.isLab : "—"}</div>

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

          {/* EDIT ROW */}
          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>

              <input
                className={styles.input}
                placeholder="Subject ID"
                value={form.subjectId}
                onChange={(e) =>
                  setForm({ ...form, subjectId: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Subject Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
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

              <select
                className={styles.input}
                value={form.isLab}
                onChange={(e) =>
                  setForm({ ...form, isLab: e.target.value })
                }
              >
                <option value="">Is Lab?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <button onClick={saveRow}>Save</button>
              <button onClick={() => setMode("")}>Cancel</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {/* ACTIONS */}
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
          message="This will delete all subjects and subsequent table. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}