"use client";

import { useEffect, useState } from "react";
import styles from "./addSubject.module.css";

export default function AddSubjectModal({ onClose, onSubmit, subjects, setSubjects, groups, sessions }) {
  const [localRows, setLocalRows] = useState(() =>
    subjects && subjects.length ? subjects.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    subjectName: "",
    group: "",
    session: "",
    weeklyLoad: "",
    courseType: "", // Lab / Theory
    isMergeable: false,
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const MAX_VISIBLE = 5;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const startAdd = () => {
    setMode("add");
    setForm({
      subjectName: "",
      group: "",
      session: "",
      weeklyLoad: "",
      courseType: "",
      isMergeable: false,
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
    const { subjectName, group, session, weeklyLoad, courseType } = form;
    if (!subjectName.trim() || !group || !session || !weeklyLoad || !courseType) {
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
      subjectName: "",
      group: "",
      session: "",
      weeklyLoad: "",
      courseType: "",
      isMergeable: false,
    });
  };

  const deleteRow = (index) => {
    const updated = localRows.filter((_, i) => i !== index);
    setLocalRows(updated);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one subject before submitting.");
      return;
    }
    setSubjects(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setSubjects(localRows);
    onClose();
  };

  const resetAll = () => {
    setLocalRows([]);
    setForm({
      subjectName: "",
      group: "",
      session: "",
      weeklyLoad: "",
      courseType: "",
      isMergeable: false,
    });
    setError("");
  };

  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery("");
  };

  const filteredRows = localRows.filter((row) =>
    row.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 style={{ textAlign: "center", flex: 1 }}>SUBJECTS</h2>
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

        {mode === "search" && (
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="Search subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Subject Name</div>
            <div>Group</div>
            <div>Session</div>
            <div>Weekly Load</div>
            <div>Course Type</div>
            <div>Mergeable?</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.subjectName : "—"}</div>
                <div>{row ? row.group : "—"}</div>
                <div>{row ? row.session : "—"}</div>
                <div>{row ? row.weeklyLoad : "—"}</div>
                <div>{row ? row.courseType : "—"}</div>
                <div>{row ? (row.isMergeable ? "Yes" : "No") : "—"}</div>
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
              placeholder="Subject Name"
              value={form.subjectName}
              onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
            />
            <select
              className={styles.input}
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
            >
              <option value="">Select Group</option>
              {(groups || []).map((g, i) => (
                <option key={i} value={g.groupName}>{g.groupName}</option>
              ))}
            </select>
            <select
              className={styles.input}
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
            >
              <option value="">Select Session</option>
              {(sessions || []).map((s, i) => (
                <option key={i} value={s.year}>{s.year}</option>
              ))}
            </select>
            <input
              className={styles.input}
              placeholder="Weekly Lecture Load"
              type="number"
              value={form.weeklyLoad}
              onChange={(e) => setForm({ ...form, weeklyLoad: e.target.value })}
            />
            <select
              className={styles.input}
              value={form.courseType}
              onChange={(e) => setForm({ ...form, courseType: e.target.value })}
            >
              <option value="">Select Course Type</option>
              <option value="Lab">Lab</option>
              <option value="Theory">Theory</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={form.isMergeable}
                onChange={(e) => setForm({ ...form, isMergeable: e.target.checked })}
              /> Is Mergeable
            </label>
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
