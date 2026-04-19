"use client";

import { useEffect, useState } from "react";
import styles from "./addTimeslot.module.css";
import ConfirmModal from "./ConfirmModal";

export default function AddTimeslotModal({
  onClose,
  onSubmit,
  timeslots,
  setTimeslots,
  shifts,
}) {
  const [localRows, setLocalRows] = useState(() =>
    timeslots?.length ? timeslots.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    sr: "",
    scheduleId: "",
    shift: "",
    dayOfWeek: "",
    startTime: "",
    endTime: ""
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
    setTimeslots(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      scheduleId: "",
      shift: "",
      dayOfWeek: "",
      startTime: "",
      endTime: ""
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
    if (!form.scheduleId.trim()) return setError("Schedule ID required");
    if (!form.shift) return setError("Select shift");
    if (!form.dayOfWeek) return setError("Select day");
    if (!form.startTime) return setError("Start time required");
    if (!form.endTime) return setError("End time required");

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
      scheduleId: "",
      shift: "",
      dayOfWeek: "",
      startTime: "",
      endTime: ""
    });

    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) setTimeslots([]);
  };

  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setTimeslots([]);
    setShowConfirm(false);
    setMode("");
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) return setError("Add at least one timeslot");

    setTimeslots(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setTimeslots(localRows);
    onClose();
  };

  const filteredRows = localRows.filter(row =>
    (row.scheduleId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.shift || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.dayOfWeek || "").toLowerCase().includes(searchQuery.toLowerCase())
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

          {/* HEADER */}
          <div className={styles.header}>
            <h2 style={{ flex: 1, textAlign: "center" }}>TIMESLOTS</h2>

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
              <div>Schedule ID</div>
              <div>Shift</div>
              <div>Day</div>
              <div>Start</div>
              <div>End</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.scheduleId : "—"}</div>
                  <div>{row ? row.shift : "—"}</div>
                  <div>{row ? row.dayOfWeek : "—"}</div>
                  <div>{row ? row.startTime : "—"}</div>
                  <div>{row ? row.endTime : "—"}</div>

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
                placeholder="Schedule ID"
                value={form.scheduleId}
                onChange={(e) => setForm({ ...form, scheduleId: e.target.value })}
              />

              <select
                className={styles.input}
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
              >
                <option value="">Select Shift</option>
                {shifts.map((s, i) => (
                  <option key={i} value={s.shiftName}>
                    {s.shiftName}
                  </option>
                ))}
              </select>

              <select
                className={styles.input}
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
              >
                <option value="">Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>

              <input
                type="time"
                className={styles.input}
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />

              <input
                type="time"
                className={styles.input}
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />

              <button onClick={saveRow}>Save</button>
              <button onClick={() => setMode("")}>Cancel</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {/* ACTIONS (IDENTICAL TO GROUP) */}
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
          message="This will delete all timeslots. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}