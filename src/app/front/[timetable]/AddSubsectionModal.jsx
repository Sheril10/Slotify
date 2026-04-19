"use client";

import { useEffect, useState } from "react";
import styles from "./addSubsection.module.css";
import ConfirmModal from "./ConfirmModal";
import DropdownPopup from "./DropdownPopup";
import GroupSubjectPickerModal from "./GroupSubjectPickerModal";

export default function AddSubsectionModal({
  onClose,
  onSubmit,
  subsections,
  setSubsections,
  sections,
  groupSubjects,
}) {
  const [localRows, setLocalRows] = useState(() =>
    subsections?.length ? subsections.map((r) => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    sr: "",
    id: "",
    name: "",
    parent: "",
    groupSubjectIds: [],
    studentCount: "",
  };

  const [form, setForm] = useState(emptyForm);

  

  const [showSection, setShowSection] = useState(false);
  const [showGS, setShowGS] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const MAX_VISIBLE = 3;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const startAdd = () => {
    setMode("add");
    setEditingIndex(localRows.length);
    setForm({ ...emptyForm, sr: (localRows.length + 1).toString() });
  };

  const startEdit = (i) => {
    setMode("edit");
    setEditingIndex(i);
    setForm(localRows[i]);
  };

  const saveRow = () => {
    const updated = [...localRows];
    if (mode === "edit") updated[editingIndex] = form;
    else updated.push(form);

    setLocalRows(updated.map((r, i) => ({ ...r, sr: (i + 1).toString() })));
    setMode("");
    setForm(emptyForm);
  };

  const deleteRow = (i) => {
    setLocalRows(localRows.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    setSubsections(localRows);
    onSubmit(localRows);
  };

  const visibleRows = Array.from(
    { length: Math.max(MAX_VISIBLE, localRows.length) },
    (_, i) => localRows[i] || null
  );

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>SUBSECTIONS</h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <div>Sr</div>
              <div>ID</div>
              <div>Name</div>
              <div>Section</div>
              <div>Students</div>
              <div>Subjects</div>
              <div>Edit</div>
              <div>Del</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, i) => (
                <div key={i} className={styles.tableRow}>
                  <div>{row ? row.sr : i + 1}</div>
                  <div>{row?.id || "—"}</div>
                  <div>{row?.name || "—"}</div>
                  <div>{row?.parent || "—"}</div>
                  <div>{row?.studentCount || "—"}</div>
                  <div>{row?.groupSubjectIds?.length || 0}</div>

                  <div>
                    {row ? (
                      <img src="/edit.png" className={styles.icon} onClick={() => startEdit(i)} />
                    ) : (
                      <img src="/img1.png" className={styles.icon} onClick={startAdd} />
                    )}
                  </div>

                  <div>
                    {row && (
                      <img src="/trash.png" className={styles.icon} onClick={() => deleteRow(i)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>
              <input className={styles.input} placeholder="ID"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })} />

              <input className={styles.input} placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <button onClick={() => setShowSection(true)}>
                {form.parent || "Select Section"}
              </button>

              <input className={styles.input} placeholder="Students"
                value={form.studentCount}
                onChange={(e) => setForm({ ...form, studentCount: e.target.value })} />

              <button onClick={() => setShowGS(true)}>
                Subjects ({form.groupSubjectIds.length})
              </button>

              <button onClick={saveRow}>Save</button>
              <button onClick={() => setMode("")}>Cancel</button>
            </div>
          )}

          <div className={styles.actions}>
            <div className={styles.leftActions}>
              <button onClick={startAdd}>Add</button>
              <button onClick={() => setShowConfirm(true)}>Reset</button>
            </div>

            <button className={styles.submitBtn} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {showSection && (
        <DropdownPopup
          title="Select Section"
          options={sections.map((s, i) => ({ id: i, name: s.name }))}
          selected={form.parent}
          onSelect={(val) => setForm({ ...form, parent: val })}
          onClose={() => setShowSection(false)}
        />
      )}

      {showGS && (
        <GroupSubjectPickerModal
          groupSubjects={groupSubjects}
          selected={form.groupSubjectIds}
          setSelected={(ids) =>
            setForm({ ...form, groupSubjectIds: ids })
          }
          onClose={() => setShowGS(false)}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          message="Delete all subsections?"
          onConfirm={() => {
            setLocalRows([]);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}