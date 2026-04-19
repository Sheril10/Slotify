"use client";

import { useEffect, useState } from "react";
import styles from "./addGroupSubject.module.css";
import ConfirmModal from "./ConfirmModal";
import DropdownPopup from "./DropdownPopup";

export default function AddGroupSubjectModal({
  onClose,
  onSubmit,
  groupSubjects,
  setGroupSubjects,
  groups,
  subjects,
}) {
  const [localRows, setLocalRows] = useState(() =>
    groupSubjects?.length ? groupSubjects.map((r) => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    sr: "",
    groupSubjectId: "",
    group: "",
    subject: "",
    lecturesPerWeek: "",
    labLecturesPerWeek: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);

  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  // ================= CLOSE =================
  const handleClose = () => {
    setGroupSubjects(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);
    setForm({
      ...emptyForm,
      sr: (localRows.length + 1).toString(),
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
    if (!form.groupSubjectId.trim())
      return setError("Group Subject ID required");
    if (!form.group) return setError("Select Group");
    if (!form.subject) return setError("Select Subject");
    if (!form.lecturesPerWeek)
      return setError("Lectures per week required");
    if (!form.labLecturesPerWeek)
      return setError("Lab lectures per week required");

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
    setForm(emptyForm);
    setError("");
  };

  // ================= DELETE =================
  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);
    if (updated.length === 0) setGroupSubjects([]);
  };

  // ================= RESET =================
  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setGroupSubjects([]);
    setShowConfirm(false);
    setMode("");
    setEditingIndex(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!localRows.length)
      return setError("Add at least one group-subject mapping");

    setGroupSubjects(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setGroupSubjects(localRows);
    onClose();
  };

  // ================= FILTER =================
  const filteredRows = localRows.filter(
    (row) =>
      (row.groupSubjectId || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (row.group || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (row.subject || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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
            <h2>GROUP SUBJECTS</h2>

            <div className={styles.headerRight}>
              <button
                onClick={() =>
                  setSearchQuery((p) => (p ? "" : " "))
                }
              >
                🔍
              </button>
              <button onClick={handleClose}>✕</button>
            </div>
          </div>

          {searchQuery && (
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
              <div>ID</div>
              <div>Group</div>
              <div>Subject</div>
              <div>Lect/W (number)</div>
              <div>Lab/W (number)</div>
              <div>Actions</div>
              <div>Del</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.groupSubjectId : "—"}</div>
                  <div>{row ? row.group : "—"}</div>
                  <div>{row ? row.subject : "—"}</div>
                  <div>{row ? row.lecturesPerWeek : "—"}</div>
                  <div>{row ? row.labLecturesPerWeek : "—"}</div>

                  <div>
                    {row ? (
                      <img
                        src="/edit.png"
                        className={styles.icon}
                        onClick={() => startEdit(idx)}
                      />
                    ) : (
                      <img
                        src="/img1.png"
                        className={styles.icon}
                        onClick={startAdd}
                      />
                    )}
                  </div>

                  <div>
                    {row && (
                      <img
                        src="/trash.png"
                        className={styles.icon}
                        onClick={() => deleteRow(idx)}
                      />
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
                placeholder="Group Subject ID"
                value={form.groupSubjectId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    groupSubjectId: e.target.value,
                  })
                }
              />

              <button
                className={styles.input}
                onClick={() => setShowGroupPopup(true)}
              >
                {form.group || "Select Group"}
              </button>

              <button
                className={styles.input}
                onClick={() => setShowSubjectPopup(true)}
              >
                {form.subject || "Select Subject"}
              </button>

              <input
                className={styles.input}
                placeholder="Lectures / Week"
                value={form.lecturesPerWeek}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lecturesPerWeek: e.target.value,
                  })
                }
              />

              <input
                className={styles.input}
                placeholder="Lab Lectures / Week"
                value={form.labLecturesPerWeek}
                onChange={(e) =>
                  setForm({
                    ...form,
                    labLecturesPerWeek: e.target.value,
                  })
                }
              />

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

      {/* GROUP POPUP */}
{showGroupPopup && (
  <DropdownPopup
    title="Select Group"
    options={groups.map((g, i) => ({
      id: i,
      name: g.groupName || g.name || g.group || "",
    }))}
    selected={form.group}
    onSelect={(val) =>
      setForm((prev) => ({ ...prev, group: val }))
    }
    onClose={() => setShowGroupPopup(false)}
  />
)}
      {/* SUBJECT POPUP */}
      {showSubjectPopup && (
        <DropdownPopup
          title="Select Subject"
          options={subjects.map((s, i) => ({
            id: i,
            name: s.name,
          }))}
          selected={form.subject}
          onSelect={(val) =>
            setForm((prev) => ({ ...prev, subject: val }))
          }
          onClose={() => setShowSubjectPopup(false)}
        />
      )}

      {/* CONFIRM */}
      {showConfirm && (
        <ConfirmModal
          message="Delete all group-subject mappings?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}