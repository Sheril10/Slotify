"use client";

import { useEffect, useState } from "react";
import styles from "./addShift.module.css";

export default function AddShiftModal({ onClose, onSubmit, shifts, setShifts }) {
  const [localRows, setLocalRows] = useState(() =>
    shifts && shifts.length ? shifts.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    shift: "",
    startMonThurs: "",
    startFri: "",
    endMonThurs: "",
    endFri: "",
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const MAX_VISIBLE = 3;

  // prevent background scroll
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
    setForm({
      shift: "",
      startMonThurs: "",
      startFri: "",
      endMonThurs: "",
      endFri: "",
    });
    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    const r = localRows[index];
    setForm({ ...r });
    setError("");
  };

  const saveRow = () => {
    const { shift, startMonThurs, startFri, endMonThurs, endFri } = form;
    if (!shift || !startMonThurs || !endMonThurs) {
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
    setForm({
      shift: "",
      startMonThurs: "",
      startFri: "",
      endMonThurs: "",
      endFri: "",
    });
  };

  const deleteRow = (index) => {
    const updated = localRows.filter((_, i) => i !== index);
    setLocalRows(updated);
  };

  // === Submit / Save / Reset ===
  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one shift before submitting.");
      return;
    }
    setShifts(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setShifts(localRows);
    onClose();
  };

  const resetAll = () => {
    setLocalRows([]);
    setForm({
      shift: "",
      startMonThurs: "",
      startFri: "",
      endMonThurs: "",
      endFri: "",
    });
    setError("");
  };

  // === Search ===
  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery("");
  };

  const filteredRows = localRows.filter((row) =>
    row.shift.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 style={{ textAlign: "center", flex: 1 }}>SHIFTS</h2>
          <div className={styles.headerRight}>
            <button
              className={`${styles.iconCircle} ${styles.searchBtn}`}
              title="Search"
              onClick={handleSearchToggle}
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
              placeholder="Search shift by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Shift</div>
            <div>Start (Mon–Thu)</div>
            <div>Start (Fri)</div>
            <div>End (Mon–Thu)</div>
            <div>End (Fri)</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.shift : "—"}</div>
                <div>{row ? row.startMonThurs : "—"}</div>
                <div>{row ? row.startFri : "—"}</div>
                <div>{row ? row.endMonThurs : "—"}</div>
                <div>{row ? row.endFri : "—"}</div>
                <div>
                  {row ? (
                    <>
                      <img
                        src="/edit.png"
                        alt="Edit"
                        className={styles.icon}
                        onClick={() => startEdit(idx)}
                      />
                      <img
                        src="/trash.png"
                        alt="Delete"
                        className={styles.icon}
                        onClick={() => deleteRow(idx)}
                      />
                    </>
                  ) : (
                    <img
                      src="/img1.png"
                      alt="Add"
                      className={styles.icon}
                      onClick={startAdd}
                    />
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
              placeholder="Shift (Morning/Evening)"
              value={form.shift}
              onChange={(e) => setForm({ ...form, shift: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Start (Mon–Thu)"
              value={form.startMonThurs}
              onChange={(e) => setForm({ ...form, startMonThurs: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Start (Fri)"
              value={form.startFri}
              onChange={(e) => setForm({ ...form, startFri: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="End (Mon–Thu)"
              value={form.endMonThurs}
              onChange={(e) => setForm({ ...form, endMonThurs: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="End (Fri)"
              value={form.endFri}
              onChange={(e) => setForm({ ...form, endFri: e.target.value })}
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
            <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
