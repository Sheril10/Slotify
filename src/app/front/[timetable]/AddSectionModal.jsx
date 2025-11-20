"use client";

import { useEffect, useState } from "react";
import styles from "./addSection.module.css";

export default function AddSectionModal({ onClose, onSubmit, sections, setSections, sessions, groups, shifts }) {
  const [localRows, setLocalRows] = useState(() =>
    sections && sections.length ? sections.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    sr: "",
    sectionId: "",
    groupName: "",
    groupSession: "",
    groupShift: "",
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const startAdd = (index = null) => {
    setMode("add");
    setEditingIndex(index);
    setForm({
      sr: index !== null ? String(index + 1) : "",
      sectionId: "",
      groupName: "",
      groupSession: "",
      groupShift: "",
    });
    setError("");
  };

  const startEdit = (index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm({ ...localRows[index] });
    setError("");
  };

  const saveRow = () => {
    if (!form.sectionId.trim() || !form.groupName.trim() || !form.groupSession.trim()) {
      setError("⚠ Section ID, Group, and Session are required.");
      return;
    }

    const updated = [...localRows];
    if (mode === "edit" && editingIndex !== null) {
      updated[editingIndex] = { ...form };
    } else {
      updated.push({ ...form });
    }

    const normalized = updated.map((r, i) => ({ ...r, sr: String(i + 1) }));
    setLocalRows(normalized);
    setMode("");
    setEditingIndex(null);
    setForm({
      sr: "",
      sectionId: "",
      groupName: "",
      groupSession: "",
      groupShift: "",
    });
    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows.filter((_, idx) => idx !== i);
    const normalized = updated.map((r, j) => ({ ...r, sr: String(j + 1) }));
    setLocalRows(normalized);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one section before submitting.");
      return;
    }
    setSections(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setSections(localRows);
    onClose();
  };

  const filteredRows = localRows.filter((row) =>
    row.sectionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRowsCount = Math.max(MAX_VISIBLE, filteredRows.length);
  const visibleRows = Array.from({ length: visibleRowsCount }, (_, i) => filteredRows[i] || null);

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 style={{ flex: 1, textAlign: "center" }}>Sections</h2>
          <div className={styles.headerRight}>
            <button className={`${styles.iconCircle} ${styles.searchBtn}`} title="Search" onClick={() => setMode(mode === "search" ? "" : "search")}>🔍</button>
            <button className={`${styles.iconCircle} ${styles.closeBtn}`} onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        {mode === "search" && (
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="Search section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Sr</div>
            <div>Section ID</div>
            <div>Group</div>
            <div>Session</div>
            <div>Shift</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div key={idx} className={styles.tableRow}>
                <div>{row ? row.sr : "—"}</div>
                <div>{row ? row.sectionId : "—"}</div>
                <div>{row ? row.groupName : "—"}</div>
                <div>{row ? row.groupSession : "—"}</div>
                <div>{row ? row.groupShift : "—"}</div>
                <div>
                  {row ? (
                    <>
                      <img src="/edit.png" alt="Edit" className={styles.icon} onClick={() => startEdit(idx)} />
                      <img src="/trash.png" alt="Delete" className={styles.icon} onClick={() => deleteRow(idx)} />
                    </>
                  ) : (
                    <img src="/img1.png" alt="Add" className={styles.icon} onClick={() => startAdd(idx)} />
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
              placeholder="Section ID"
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
            />
            <select
              className={styles.input}
              value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })}
            >
              <option value="">Select Group</option>
              {groups.map((g, i) => (
                <option key={i} value={g.groupName}>{g.groupName}</option>
              ))}
            </select>
            <select
              className={styles.input}
              value={form.groupSession}
              onChange={(e) => setForm({ ...form, groupSession: e.target.value })}
            >
              <option value="">Select Session</option>
              {sessions.map((s, i) => (
                <option key={i} value={s.year}>{s.year}</option>
              ))}
            </select>
            <select
              className={styles.input}
              value={form.groupShift}
              onChange={(e) => setForm({ ...form, groupShift: e.target.value })}
            >
              <option value="">Select Shift</option>
              {shifts.map((s, i) => (
                <option key={i} value={s.shift}>{s.shift}</option>
              ))}
            </select>
            <button onClick={saveRow}>Save</button>
            <button onClick={() => setMode("")}>Cancel</button>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <div className={styles.leftActions}>
            <button onClick={() => startAdd()}>Add</button>
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
