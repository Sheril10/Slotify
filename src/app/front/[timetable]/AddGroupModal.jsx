"use client";

import { useEffect, useState } from "react";
import styles from "./addGroup.module.css";

export default function AddGroupModal({ onClose, onSubmit, groups, setGroups, sessions }) {
  const [localRows, setLocalRows] = useState(() =>
    groups && groups.length ? groups.map((r) => ({ ...r })) : []
  );
  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ sr: "", groupName: "", groupSession: "" });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const MAX_VISIBLE = 3;

  // Prevent background scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // === Add & Edit Functions ===
  const startAddAt = (index) => {
    setMode("add");
    setEditingIndex(index);
    setForm({ sr: index + 1 + "", groupName: "", groupSession: "" });
    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    const r = localRows[index];
    setForm({ sr: r.sr + "", groupName: r.groupName, groupSession: r.groupSession });
    setError("");
  };

  const saveRow = () => {
    if (!form.groupName.trim() || !form.groupSession.trim()) {
      setError("Both Group Name and Session are required.");
      return;
    }
    const updated = [...localRows];
    if (mode === "edit" && editingIndex !== null) {
      updated[editingIndex] = { sr: form.sr.trim(), groupName: form.groupName, groupSession: form.groupSession };
    } else {
      updated.push({ sr: String(updated.length + 1), groupName: form.groupName, groupSession: form.groupSession });
    }
    const normalized = updated.map((r, i) => ({ ...r, sr: String(i + 1) }));
    setLocalRows(normalized);
    setMode("");
    setEditingIndex(null);
    setForm({ sr: "", groupName: "", groupSession: "" });
    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows.filter((_, idx) => idx !== i);
    const normalized = updated.map((r, j) => ({ ...r, sr: String(j + 1) }));
    setLocalRows(normalized);
  };

  // === Buttons ===
  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one group before submitting.");
      return;
    }
    setGroups(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    if (localRows.length === 0) {
      setError("⚠ Nothing to save. Add at least one group.");
      return;
    }
    setGroups(localRows);
    onClose();
  };

  const handleReset = () => {
    setLocalRows([]);
    setForm({ sr: "", groupName: "", groupSession: "" });
    setEditingIndex(null);
    setMode("");
    setError("");
  };

  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery("");
  };

  // === FILTERED ROWS ===
  const filteredRows = localRows.filter((row) =>
    row.groupName.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Group Modal">
        {/* === HEADER === */}
        <div className={styles.header}>
          <h2 style={{ textAlign: "center", flex: 1 }}>GROUPS</h2>
          <div className={styles.headerRight}>
            <button
              className={`${styles.iconCircle} ${styles.searchBtn}`}
              onClick={handleSearchToggle}
              title="Search"
            >
              🔍
            </button>
            <button className={`${styles.iconCircle} ${styles.closeBtn}`} onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* === SEARCH INPUT === */}
        {mode === "search" && (
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="Search group by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* === TABLE === */}
        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Sr No.</div>
            <div>Group Name</div>
            <div>Session</div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.sr : idx + 1}</div>
                <div>{row ? row.groupName : "—"}</div>
                <div>{row ? row.groupSession : "—"}</div>
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
              value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })}
              placeholder="Enter Group Name (e.g., Pre-Med, ICS, ICOM)"
            />
            <select
              className={styles.input}
              value={form.groupSession}
              onChange={(e) => setForm({ ...form, groupSession: e.target.value })}
            >
              <option value="">Select Session</option>
              {sessions.map((s, i) => (
                <option key={i} value={s.year}>
                  {s.year}
                </option>
              ))}
            </select>
            <button onClick={saveRow}>Save</button>
            <button
              onClick={() => {
                setMode("");
                setEditingIndex(null);
                setForm({ sr: "", groupName: "", groupSession: "" });
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
            <button onClick={() => setMode("add")}>Add</button>
            <button onClick={handleReset}>Reset</button>
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
