"use client";

import { useState } from "react";
import styles from "./subjectPicker.module.css"; // keep same styling

export default function TimeslotPickerModal({
  timeslots = [],
  selectedTimeslots,
  setSelectedTimeslots,
  onClose,
}) {
  const safeSelected = Array.isArray(selectedTimeslots)
    ? selectedTimeslots
    : [];

  const [search, setSearch] = useState("");

  // ✅ FIXED NORMALIZATION (handles BOTH start/startTime)
const normalized = timeslots.map((t, i) => {
  const start = t.start || t.startTime || "";
  const end = t.end || t.endTime || "";

  // 🔥 FIX DAY HERE
  const day =
    t.day ||
    t.dayOfWeek ||
    t.dayName ||
    t.day_label ||
    "";

  return {
    id: t.id ?? i,
    label: `${day} (${start} - ${end})`,
  };
});

  const filtered = normalized.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (safeSelected.includes(id)) {
      setSelectedTimeslots(safeSelected.filter((s) => s !== id));
    } else {
      setSelectedTimeslots([...safeSelected, id]);
    }
  };

  const removeTag = (id) => {
    setSelectedTimeslots(safeSelected.filter((s) => s !== id));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Select Timeslots</h3>

        <input
          className={styles.search}
          placeholder="Search timeslot..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ TAGS */}
        <div className={styles.tagBox}>
          {safeSelected.map((id) => {
            const t = normalized.find((x) => x.id === id);
            if (!t) return null;

            return (
              <div key={id} className={styles.tag}>
                {t.label}
                <span onClick={() => removeTag(id)}>✕</span>
              </div>
            );
          })}
        </div>

        {/* LIST */}
        <div className={styles.list}>
          {filtered.map((t) => {
            const checked = safeSelected.includes(t.id);

            return (
              <div
                key={t.id}
                className={`${styles.item} ${
                  checked ? styles.active : ""
                }`}
                onClick={() => toggle(t.id)}
              >
                <input type="checkbox" readOnly checked={checked} />
                {t.label}
              </div>
            );
          })}
        </div>

        <button onClick={onClose}>Done</button>
      </div>
    </div>
  );
}