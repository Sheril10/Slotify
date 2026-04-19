"use client";

import { useEffect, useState } from "react";
import styles from "./addTeacher.module.css";
import ConfirmModal from "./ConfirmModal";
import SubjectPickerModal from "./SubjectPickerModal";
import DropdownPopup from "./DropdownPopup";

export default function AddTeacherModal({
  onClose,
  onSubmit,
  teachers,
  setTeachers,
  departments,
  subjects,
}) {
  const [localRows, setLocalRows] = useState(() =>
    teachers?.length ? teachers.map((r) => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    sr: "",
    teacherId: "",
    name: "",
    department: "",
    workload: "",
    subjects: [], // ALWAYS array of IDs
  };

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [showSubjectSelector, setShowSubjectSelector] = useState(false);
  const [showDeptPopup, setShowDeptPopup] = useState(false);

  const MAX_VISIBLE = 3;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  const handleClose = () => {
    onSubmit(localRows);
    onClose();
  };

  const normalizeSubjects = (subs) =>
    subs.map((s, i) => ({
      ...s,
      id: s.id ?? i, // 🔥 guarantees ID
    }));

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

    const row = localRows[index];

    setForm({
      ...row,
      subjects: Array.isArray(row.subjects) ? row.subjects : [],
    });

    setError("");
  };

  const saveRow = () => {
    if (!form.teacherId.trim()) return setError("Teacher ID required");
    if (!form.name.trim()) return setError("Name required");
    if (!form.department) return setError("Department required");
    if (!form.workload || isNaN(form.workload))
      return setError("Workload must be a number");
    if (!Array.isArray(form.subjects) || form.subjects.length === 0)
      return setError("Select at least one subject");

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

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);
    if (updated.length === 0) setTeachers([]);
  };

  const handleSubmit = () => {
    if (!localRows.length)
      return setError("Add at least one teacher");

    setTeachers(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setTeachers(localRows);
    onClose();
  };

  const filteredRows = localRows.filter((row) =>
    (row.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2>TEACHERS</h2>
            <div>
              <button onClick={() => setSearchQuery((p) => (p ? "" : " "))}>
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
              <div>Name</div>
              <div>Dept</div>
              <div>Load</div>
              <div>Subjects</div>
              <div>Actions</div>
              <div>Del</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row ? row.teacherId : "—"}</div>
                  <div>{row ? row.name : "—"}</div>
                  <div>{row ? row.department : "—"}</div>
                  <div>{row ? row.workload : "—"}</div>

                  <div className={styles.subjectList}>
                    {row &&
                      Array.isArray(row.subjects) &&
                      row.subjects.map((id) => {
                        const sub = normalizeSubjects(subjects).find(
                          (s) => s.id === id
                        );

                        return (
                          <span key={id} className={styles.subjectItem}>
                            {sub?.name} ({sub?.code})
                          </span>
                        );
                      })}
                  </div>

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
                placeholder="Teacher ID"
                value={form.teacherId}
                onChange={(e) =>
                  setForm({ ...form, teacherId: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* DEPARTMENT POPUP */}
              <button
                className={styles.input}
                onClick={() => setShowDeptPopup(true)}
              >
                {form.department || "Select Department"}
              </button>

              <input
                className={styles.input}
                placeholder="Workload (number)"
                value={form.workload}
                onChange={(e) =>
                  setForm({ ...form, workload: e.target.value })
                }
              />

              <button onClick={() => setShowSubjectSelector(true)}>
                Select Subjects ({form.subjects.length})
              </button>

              {/* ✅ SUBJECT PREVIEW */}
              {form.subjects.length > 0 && (
                <div className={styles.subjectBox}>
                  <div className={styles.subjectList}>
                    {form.subjects.map((id) => {
                      const sub = normalizeSubjects(subjects).find(
                        (s) => s.id === id
                      );

                      return (
                        <span key={id} className={styles.subjectItem}>
                          {sub?.name} ({sub?.code})
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <button onClick={saveRow}>Save</button>
              <button onClick={() => setMode("")}>Cancel</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {/* ACTIONS */}
          <div className={styles.actions}>
            <div className={styles.leftActions}>
              <button onClick={startAdd}>Add</button>
              <button onClick={() => setShowConfirm(true)}>Reset</button>
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

      {/* SUBJECT PICKER */}
      {showSubjectSelector && (
        <SubjectPickerModal
          subjects={normalizeSubjects(subjects)}
          selectedSubjects={Array.isArray(form.subjects) ? form.subjects : []}
          setSelectedSubjects={(updated) =>
            setForm((prev) => ({
              ...prev,
              subjects: Array.isArray(updated) ? updated : [],
            }))
          }
          onClose={() => setShowSubjectSelector(false)}
        />
      )}

      {/* DEPARTMENT POPUP */}
      {showDeptPopup && (
        <DropdownPopup
          title="Select Department"
          options={departments.map((d, i) => ({
            id: i,
            name: d.name,
          }))}
          selected={form.department}
          onSelect={(val) =>
            setForm((prev) => ({ ...prev, department: val }))
          }
          onClose={() => setShowDeptPopup(false)}
        />
      )}

      {/* CONFIRM */}
      {showConfirm && (
        <ConfirmModal
          message="Delete all teachers?"
          onConfirm={() => {
            setLocalRows([]);
            setTeachers([]);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}