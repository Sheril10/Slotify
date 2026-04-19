"use client";

import { useState, useEffect } from "react";
import styles from "./addRoom.module.css";
import ConfirmModal from "./ConfirmModal";
import SubjectPickerModal from "./SubjectPickerModal";

export default function AddRoomModal({
  onClose,
  onSubmit,
  rooms,
  setRooms,
  subjects,
}) {
  const [localRows, setLocalRows] = useState(() =>
    rooms?.length ? rooms.map((r) => ({ ...r })) : []
  );

  // ✅ SEARCH STATE (toggle like teacher modal)
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    sr: "",
    roomId: "",
    block: "",
    roomNumber: "",
    capacity: "",
    isLab: "No",
    isFixed: "No",
    fixedSubjects: [],
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSubjectSelector, setShowSubjectSelector] = useState(false);

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

  const saveRow = () => {
    if (!form.roomId.trim()) return setError("Room ID required");
    if (!form.block.trim()) return setError("Block required");
    if (!form.roomNumber.trim()) return setError("Room number required");

    if (form.isFixed === "Yes" && form.fixedSubjects.length === 0)
      return setError("Select subjects for fixed room");

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
    setForm(emptyForm);
    setError("");
  };

  const deleteRow = (i) => {
    const updated = localRows
      .filter((_, idx) => idx !== i)
      .map((r, j) => ({ ...r, sr: (j + 1).toString() }));

    setLocalRows(updated);
    if (!updated.length) setRooms([]);
  };

  const handleSubmit = () => {
    if (!localRows.length) return setError("Add at least one room");
    setRooms(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setRooms(localRows);
    onClose();
  };

  // ✅ MULTI-FIELD SEARCH (FIXED)
  const filteredRows = localRows.filter((row) => {
    const q = searchQuery.toLowerCase();

    return (
      (row.roomId || "").toLowerCase().includes(q) ||
      (row.block || "").toLowerCase().includes(q) ||
      (row.roomNumber || "").toLowerCase().includes(q)
    );
  });

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
            <h2>ROOMS</h2>

            <div>
              {/* ✅ SEARCH TOGGLE BUTTON */}
              <button onClick={() => setShowSearch((p) => !p)}>
                🔍
              </button>

              <button onClick={handleClose}>✕</button>
            </div>
          </div>

          {/* ✅ SEARCH INPUT (ONLY WHEN TOGGLED) */}
          {showSearch && (
            <input
              className={styles.input}
              placeholder="Search by ID, Block, Room Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          {/* TABLE */}
          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <div>Sr</div>
              <div>ID</div>
              <div>Block</div>
              <div>Room</div>
              <div>Cap</div>
              <div>Subjects</div>
              <div>Actions</div>
              <div>Del</div>
            </div>

            <div className={styles.tableBody}>
              {visibleRows.map((row, idx) => (
                <div className={styles.tableRow} key={idx}>
                  <div>{row ? row.sr : idx + 1}</div>
                  <div>{row?.roomId || "—"}</div>
                  <div>{row?.block || "—"}</div>
                  <div>{row?.roomNumber || "—"}</div>
                  <div>{row?.capacity || "—"}</div>

                  <div className={styles.subjectList}>
                    {row?.fixedSubjects?.map((id) => {
                      const sub = subjects.find((s) => s.id === id);
                      return (
                        <span key={id} className={styles.subjectItem}>
                          {sub?.name}
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

          {/* FORM */}
          {(mode === "add" || mode === "edit") && (
            <div className={styles.editRow}>
              <input
                className={styles.input}
                placeholder="Room ID"
                value={form.roomId}
                onChange={(e) =>
                  setForm({ ...form, roomId: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Block"
                value={form.block}
                onChange={(e) =>
                  setForm({ ...form, block: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Room Number"
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
              />
              <p>is Fixed?</p>
              <select
                className={styles.input}
                value={form.isFixed}
                onChange={(e) =>
                  setForm({ ...form, isFixed: e.target.value })
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>

              {form.isFixed === "Yes" && (
                <>
                  <button onClick={() => setShowSubjectSelector(true)}>
                    Select Subjects ({form.fixedSubjects.length})
                  </button>

                  <div className={styles.subjectBox}>
                    {form.fixedSubjects.map((id) => {
                      const sub = subjects.find((s) => s.id === id);
                      return (
                        <span key={id} className={styles.subjectItem}>
                          {sub?.name}
                        </span>
                      );
                    })}
                  </div>
                </>
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

      {/* MODALS */}
      {showSubjectSelector && (
        <SubjectPickerModal
          subjects={subjects}
          selectedSubjects={form.fixedSubjects}
          setSelectedSubjects={(subs) =>
            setForm({ ...form, fixedSubjects: subs })
          }
          onClose={() => setShowSubjectSelector(false)}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          message="Delete all rooms?"
          onConfirm={() => {
            setLocalRows([]);
            setRooms([]);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}