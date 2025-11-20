"use client";

import { useEffect, useState } from "react";
import styles from "./addSession.module.css";

export default function AddSessionModal({ onClose, onSubmit, sessions, setSessions }) {
  const [localRows, setLocalRows] = useState(() =>
    sessions && sessions.length ? sessions.map(r => ({ ...r })) : []
  );
  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ sr: "", year: "" });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // =========================
  // CRUD LOGIC
  // =========================

  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);
    setForm({ sr: (localRows.length + 1).toString(), year: "" });
    setError("");
  };

  const startAddAt = (index) => {
    setMode("add");
    setEditingIndex(index);
    setForm({ sr: (index + 1).toString(), year: "" });
    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    const r = localRows[index];
    setForm({ sr: r.sr.toString(), year: r.year });
    setError("");
  };

  const saveRow = () => {
    if (!form.year.trim()) {
      setError("Session name (e.g., 1st Year) is required.");
      return;
    }

    const updated = [...localRows];

    if (mode === "edit" && editingIndex !== null) {
      updated[editingIndex] = { sr: (editingIndex + 1).toString(), year: form.year.trim() };
    } else {
      updated.push({ sr: (updated.length + 1).toString(), year: form.year.trim() });
    }

    const normalized = updated.map((r, i) => ({ ...r, sr: (i + 1).toString() }));

    setLocalRows(normalized);
    setMode("");
    setEditingIndex(null);
    setForm({ sr: "", year: "" });
    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows.filter((_, idx) => idx !== i);
    const normalized = updated.map((r, j) => ({ ...r, sr: (j + 1).toString() }));
    setLocalRows(normalized);
  };

  const resetAll = () => {
    setLocalRows([]);
    setForm({ sr: "", year: "" });
    setEditingIndex(null);
    setMode("");
    setError("");
  };

  // =========================
  // SUBMIT HANDLERS
  // =========================

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one session before submitting.");
      return;
    }
    setSessions(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    if (localRows.length === 0) {
      setError("⚠ Nothing to save. Add at least one session.");
      return;
    }
    setSessions(localRows);
    onClose();
  };

  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery(""); // clear search when toggling
  };

  // =========================
  // FILTERED ROWS
  // =========================
  const filteredRows = localRows.filter((row) =>
    row.year.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRowsCount = Math.max(MAX_VISIBLE, filteredRows.length);
  const visibleRows = Array.from({ length: visibleRowsCount }, (_, i) => filteredRows[i] || null);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Session Modal">
        {/* === HEADER === */}
        <div className={styles.header}>
          <h2 style={{ textAlign: "center", flex: 1 }}>SESSIONS</h2>
          <div className={styles.headerRight}>
            <button
              className={`${styles.iconCircle} ${styles.searchBtn}`}
              onClick={handleSearchToggle}
              title="Search"
            >
              🔍
            </button>
            <button
              className={`${styles.iconCircle} ${styles.closeBtn}`}
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* === SEARCH INPUT === */}
        {mode === "search" && (
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* === TABLE === */}
        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Sr No.</div>
            <div>Sessions</div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.sr : idx + 1}</div>
                <div>{row ? row.year : "—"}</div>
                <div>
                  {row ? (
                    <img
                      src="/edit.png"
                      alt="Edit"
                      className={styles.icon}
                      onClick={() => startEdit(idx)}
                    />
                  ) : (
                    <img
                      src="/img1.png"
                      alt="Add"
                      className={styles.icon}
                      onClick={() => startAddAt(idx)}
                    />
                  )}
                </div>
                {row && (
                  <img
                    src="/trash.png"
                    alt="Delete"
                    className={styles.icon}
                    onClick={() => deleteRow(idx)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === ADD / EDIT MODE === */}
        {(mode === "add" || mode === "edit") && (
          <div className={styles.editRow}>
            <input
              className={styles.input}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="ENTER NAME OF THE SESSION (e.g., 1st or 2nd YEAR)"
            />
            <button onClick={saveRow}>Save</button>
            <button
              onClick={() => {
                setMode("");
                setEditingIndex(null);
                setForm({ sr: "", year: "" });
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* === ERROR MESSAGE === */}
        {error && <div className={styles.error}>{error}</div>}

        {/* === ACTION BUTTONS === */}
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
  );
}
