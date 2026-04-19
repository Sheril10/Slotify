"use client";

import { useEffect, useState } from "react";
import styles from "./ayear.module.css";
import ConfirmModal from "./ConfirmModal";

export default function AddAcademicYearModal({
  onClose,
  onSubmit,
  academicYears,
  setAcademicYears,
  sessions,
}) {
  const [localRows, setLocalRows] = useState(() =>
    academicYears?.length ? academicYears.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // ✅ FIXED FORM (same pattern as session modal)
  const [form, setForm] = useState({
    sr: "",
    academicId: "",
    name: "",
    session: ""
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
    setAcademicYears(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      academicId: "",
      name: "",
      session: ""
    });

    setError("");
  };

  const startAddAt = (index) => {
    setMode("add");
    setEditingIndex(index);

    setForm({
      sr: (index + 1).toString(),
      academicId: "",
      name: "",
      session: ""
    });

    setError("");
  };

  // ================= EDIT =================
  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm(localRows[index]);
    setError("");
  };

  // ================= SAVE =================
  const saveRow = () => {
    if (!form.academicId.trim()) {
      setError("Academic Year ID is required");
      return;
    }

    if (!form.name.trim()) {
      setError("Academic Year Name is required");
      return;
    }

    if (!form.session) {
      setError("Select a session");
      return;
    }

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
    setForm({ sr: "", academicId: "", name: "", session: "" });
    setError("");
  };

  // ================= DELETE =================
  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) {
      setAcademicYears([]);
    }
  };

  // ================= RESET =================
  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
  setLocalRows([]);
  setAcademicYears([]);

  setShowConfirm(false);

  // ✅ reset UI state so modal doesn't bug out
  setMode("");
  setEditingIndex(null);
};

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("Add at least one academic year");
      return;
    }

    setAcademicYears(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setAcademicYears(localRows);
    onClose();
  };

  // ================= SEARCH =================
  const filteredRows = localRows.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.academicId.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 style={{ flex: 1, textAlign: "center" }}>
              ACADEMIC YEARS
            </h2>

            <div className={styles.headerRight}>
              <button onClick={() => setMode(m => m === "search" ? "" : "search")}>🔍</button>
              <button onClick={handleClose}>✕</button>
            </div>
          </div>

          {/* SEARCH */}
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
              <div>Academic ID</div>
              <div>Academic Year</div>
              <div>Session</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>

                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.academicId : "—"}</div>
                  <div>{row ? row.name : "—"}</div>
                  <div>{row ? row.session : "—"}</div>

                  <div>
                    {row ? (
                      <img src="/edit.png" className={styles.icon} onClick={() => startEdit(idx)} />
                    ) : (
                      <img src="/img1.png" className={styles.icon} onClick={() => startAddAt(idx)} />
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

          {/* EDIT FORM */}
          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>

              <input
                className={styles.input}
                placeholder="Academic Year ID"
                value={form.academicId}
                onChange={(e) =>
                  setForm({ ...form, academicId: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Academic Year Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <select
                className={styles.input}
                value={form.session}
                onChange={(e) =>
                  setForm({ ...form, session: e.target.value })
                }
              >
                <option value="">Select Session</option>
                {sessions.map((s, i) => (
                  <option key={i} value={s.year}>
                    {s.year}
                  </option>
                ))}
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
          message="This will delete all academic years and dependent data. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}