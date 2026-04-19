"use client";

import { useEffect, useState } from "react";
import styles from "./addSubjectCombination.module.css";
import ConfirmModal from "./ConfirmModal";
import DropdownPopup from "./DropdownPopup";

export default function AddSubjectCombinationModal({
  onClose,
  onSubmit,
  subjects,
  setSubjectCombinations,
  subjectCombinations,
}) {
  const [localRows, setLocalRows] = useState(() =>
    subjectCombinations?.length ? subjectCombinations.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    sr: "",
    combinationId: "",
    subject1: "",
    subject2: "",
  });

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ NEW POPUPS
  const [showSub1Popup, setShowSub1Popup] = useState(false);
  const [showSub2Popup, setShowSub2Popup] = useState(false);

  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  const handleClose = () => {
    setSubjectCombinations(localRows);
    onClose();
  };

  // ================= ADD =================
  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);

    setForm({
      sr: (localRows.length + 1).toString(),
      combinationId: "",
      subject1: "",
      subject2: "",
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
    if (!(form.combinationId || "").trim())
      return setError("Combination ID required");

    if (!form.subject1)
      return setError("Select Subject 1");

    if (!form.subject2)
      return setError("Select Subject 2");

    if (form.subject1 === form.subject2)
      return setError("Subject 1 and Subject 2 cannot be same");

    // ❌ prevent duplicate + reverse duplicate
    const isDuplicatePair = localRows.some((row, idx) => {
      if (mode === "edit" && idx === editingIndex) return false;

      return (
        (row.subject1 === form.subject1 && row.subject2 === form.subject2) ||
        (row.subject1 === form.subject2 && row.subject2 === form.subject1)
      );
    });

    if (isDuplicatePair) {
      return setError("This subject combination already exists (reversed pair not allowed)");
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

    setForm({
      sr: "",
      combinationId: "",
      subject1: "",
      subject2: "",
    });

    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);

    if (updated.length === 0) setSubjectCombinations([]);
  };

  const resetAll = () => setShowConfirm(true);

  const confirmReset = () => {
    setLocalRows([]);
    setSubjectCombinations([]);
    setShowConfirm(false);
    setMode("");
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (localRows.length === 0)
      return setError("Add at least one combination");

    setSubjectCombinations(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setSubjectCombinations(localRows);
    onClose();
  };

  // ================= FILTER =================
  const filteredRows = localRows.filter(row =>
    (row.combinationId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.subject1 || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.subject2 || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRows = Array.from(
    { length: Math.max(MAX_VISIBLE, filteredRows.length) },
    (_, i) => filteredRows[i] || null
  );

  // ✅ FORMAT SUBJECTS WITH CODE
  const subjectOptions = subjects?.map((s, i) => ({
    id: i,
    name: `${s.name} (${s.code})`,
  }));

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
            <h2>SUBJECT COMBINATIONS</h2>

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
              <div>Combination ID</div>
              <div>Subject 1</div>
              <div>Subject 2</div>
              <div>Actions</div>
              <div>Delete</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.combinationId : "—"}</div>
                  <div>{row ? row.subject1 : "—"}</div>
                  <div>{row ? row.subject2 : "—"}</div>

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

          {/* EDIT FORM */}
          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>

              <input
                className={styles.input}
                placeholder="Combination ID"
                value={form.combinationId}
                onChange={(e) =>
                  setForm({ ...form, combinationId: e.target.value })
                }
              />

              {/* SUBJECT 1 */}
              <button onClick={() => setShowSub1Popup(true)}>
                {form.subject1 || "Select Subject 1"}
              </button>

              {/* SUBJECT 2 */}
              <button onClick={() => setShowSub2Popup(true)}>
                {form.subject2 || "Select Subject 2"}
              </button>

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

      {/* SUBJECT POPUPS */}
      {showSub1Popup && (
        <DropdownPopup
          title="Select Subject 1"
          options={subjectOptions}
          selected={form.subject1}
          onSelect={(val) => setForm({ ...form, subject1: val })}
          onClose={() => setShowSub1Popup(false)}
        />
      )}

      {showSub2Popup && (
        <DropdownPopup
          title="Select Subject 2"
          options={subjectOptions}
          selected={form.subject2}
          onSelect={(val) => setForm({ ...form, subject2: val })}
          onClose={() => setShowSub2Popup(false)}
        />
      )}

      {/* CONFIRM */}
      {showConfirm && (
        <ConfirmModal
          message="This will delete all subject combinations. Continue?"
          onConfirm={confirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}