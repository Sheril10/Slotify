"use client";

import { useEffect, useState } from "react";
import styles from "./addTeacher.module.css";

export default function AddTeacherModal({ onClose, onSubmit, teachers, setTeachers, departments }) {
  const [localRows, setLocalRows] = useState(() =>
    teachers && teachers.length ? teachers.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    department: departments[0]?.deptName || "",
    weeklyLoad: "",
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
      name: "",
      department: departments[0]?.deptName || "",
      weeklyLoad: "",
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
    const { name, department, weeklyLoad } = form;
    if (!name.trim() || !department || !weeklyLoad) {
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
      name: "",
      department: departments[0]?.deptName || "",
      weeklyLoad: "",
    });
  };

  const deleteRow = (index) => {
    const updated = localRows.filter((_, i) => i !== index);
    setLocalRows(updated);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one teacher before submitting.");
      return;
    }
    setTeachers(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setTeachers(localRows);
    onClose();
  };

  const resetAll = () => {
    setLocalRows([]);
    setForm({
      name: "",
      department: departments[0]?.deptName || "",
      weeklyLoad: "",
    });
    setError("");
  };

  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery("");
  };

  const filteredRows = localRows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 style={{ textAlign: "center", flex: 1 }}>TEACHERS</h2>
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
              placeholder="Search teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Name</div>
            <div>Department</div>
            <div>Weekly Load</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.name : "—"}</div>
                <div>{row ? row.department : "—"}</div>
                <div>{row ? row.weeklyLoad : "—"}</div>
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
              placeholder="Teacher Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              className={styles.input}
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              {(departments || []).map((dept, i) => (
                <option key={i} value={dept.deptName}>
                  {dept.deptName}
                </option>
              ))}
            </select>
            <input
              className={styles.input}
              type="number"
              placeholder="Weekly Load (hrs)"
              value={form.weeklyLoad}
              onChange={(e) => setForm({ ...form, weeklyLoad: e.target.value })}
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
