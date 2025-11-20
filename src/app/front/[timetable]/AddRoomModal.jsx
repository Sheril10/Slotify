"use client";

import { useEffect, useState } from "react";
import styles from "./addRoom.module.css";

export default function AddRoomModal({ onClose, onSubmit, rooms, setRooms }) {
  const [localRows, setLocalRows] = useState(() =>
    rooms && rooms.length ? rooms.map(r => ({ ...r })) : []
  );

  const [mode, setMode] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    block: "",
    roomNumber: "",
    capacityText: "Small",
    capacityNum: "",
    isLab: false,
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
      block: "",
      roomNumber: "",
      capacityText: "Small",
      capacityNum: "",
      isLab: false,
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
    const { block, roomNumber, capacityText, capacityNum } = form;
    if (!block.trim() || !roomNumber || !capacityText || !capacityNum) {
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
      block: "",
      roomNumber: "",
      capacityText: "Small",
      capacityNum: "",
      isLab: false,
    });
  };

  const deleteRow = (index) => {
    const updated = localRows.filter((_, i) => i !== index);
    setLocalRows(updated);
  };

  const handleSubmit = () => {
    if (localRows.length === 0) {
      setError("⚠ Please add at least one room before submitting.");
      return;
    }
    setRooms(localRows);
    onSubmit(localRows);
  };

  const handleSaveForNow = () => {
    setRooms(localRows);
    onClose();
  };

  const resetAll = () => {
    setLocalRows([]);
    setForm({
      block: "",
      roomNumber: "",
      capacityText: "Small",
      capacityNum: "",
      isLab: false,
    });
    setError("");
  };

  const handleSearchToggle = () => {
    setMode((m) => (m === "search" ? "" : "search"));
    setSearchQuery("");
  };

  const filteredRows = localRows.filter((row) =>
    row.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 style={{ textAlign: "center", flex: 1 }}>ROOMS</h2>
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
              placeholder="Search block or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <div>Block</div>
            <div>Room #</div>
            <div>Capacity</div>
            <div>Capacity #</div>
            <div>Is Lab</div>
            <div></div>
          </div>

          <div className={styles.tableBody}>
            {visibleRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div>{row ? row.block : "—"}</div>
                <div>{row ? row.roomNumber : "—"}</div>
                <div>{row ? row.capacityText : "—"}</div>
                <div>{row ? row.capacityNum : "—"}</div>
                <div>{row ? (row.isLab ? "Yes" : "No") : "—"}</div>
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
              placeholder="Block Name"
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Room Number"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
            <select
              className={styles.input}
              value={form.capacityText}
              onChange={(e) => setForm({ ...form, capacityText: e.target.value })}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <input
              className={styles.input}
              placeholder="Capacity (number)"
              type="number"
              value={form.capacityNum}
              onChange={(e) => setForm({ ...form, capacityNum: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={form.isLab}
                onChange={(e) => setForm({ ...form, isLab: e.target.checked })}
              /> Is Lab
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
