"use client";

import { useEffect, useState } from "react";
import styles from "./addGroup.module.css";
import ConfirmModal from "./ConfirmModal";

export default function AddGroupModal({
  onClose,
  onSubmit,
  groups,
  setGroups,
  academicYears,
}) {
  const [localRows, setLocalRows] = useState(() =>
    groups?.length ? groups.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    sr: "",
    groupId: "",
    groupName: "",
    academicYear: ""
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
    setGroups(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      groupId: "",
      groupName: "",
      academicYear: ""
    });

    setError("");
  };

  const startAddAt = (index) => {
    setMode("add");
    setEditingIndex(index);

    setForm({
      sr: (index + 1).toString(),
      groupId: "",
      groupName: "",
      academicYear: ""
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
    if (!form.groupId.trim()) return setError("Group ID is required");
    if (!form.groupName.trim()) return setError("Group Name is required");
    if (!form.academicYear) return setError("Select Academic Year");

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
    setForm({ sr: "", groupId: "", groupName: "", academicYear: "" });
    setError("");
  };

  // ================= DELETE =================
  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) {
      setGroups([]);
    }
  };

  // ================= RESET =================
  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setGroups([]);
    setShowConfirm(false);

    // 🔥 IMPORTANT FIX (same as academic years)
    setMode("");
    setEditingIndex(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (localRows.length === 0) return setError("Add at least one group");

    setGroups(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setGroups(localRows);
    onClose();
  };

  // ================= SEARCH =================
  const filteredRows = localRows.filter(row =>
    (row.groupName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.groupId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.academicYear || "").toLowerCase().includes(searchQuery.toLowerCase())
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

          <div className={styles.header}>
            <h2 style={{ flex: 1, textAlign: "center" }}>GROUPS</h2>

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

          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <div>Sr</div>
              <div>Group ID</div>
              <div>Group Name</div>
              <div>Academic Year</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.groupId : "—"}</div>
                  <div>{row ? row.groupName : "—"}</div>
                  <div>{row ? row.academicYear : "—"}</div>

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

          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>
              <input
                className={styles.input}
                placeholder="Group ID"
                value={form.groupId}
                onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              />

              <input
                className={styles.input}
                placeholder="Group Name"
                value={form.groupName}
                onChange={(e) => setForm({ ...form, groupName: e.target.value })}
              />

              <select
                className={styles.input}
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((a, i) => (
                  <option key={i} value={a.name}>{a.name}</option>
                ))}
              </select>

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
              <button className={styles.submitBtn} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>

        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="This will delete all groups and dependent data. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}