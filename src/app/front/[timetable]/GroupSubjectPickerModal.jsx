"use client";

import { useState } from "react";
import styles from "./subjectPicker.module.css"; // reuse same CSS

export default function GroupSubjectPickerModal({
  groupSubjects = [],
  selected,
  setSelected,
  onClose,
}) {
  const safeSelected = Array.isArray(selected) ? selected : [];

  const [search, setSearch] = useState("");

  const normalized = groupSubjects.map((gs, i) => ({
    id: gs.id ?? i,
    label: `${gs.group} - ${gs.subject}`,
  }));

  const filtered = normalized.filter((g) =>
    g.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (safeSelected.includes(id)) {
      setSelected(safeSelected.filter((s) => s !== id));
    } else {
      setSelected([...safeSelected, id]);
    }
  };

  const removeTag = (id) => {
    setSelected(safeSelected.filter((s) => s !== id));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Select Group Subjects</h3>

        <input
          className={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ TAGS */}
        <div className={styles.tagBox}>
          {safeSelected.map((id) => {
            const g = normalized.find((x) => x.id === id);
            if (!g) return null;

            return (
              <div key={id} className={styles.tag}>
                {g.label}
                <span onClick={() => removeTag(id)}>✕</span>
              </div>
            );
          })}
        </div>

        {/* LIST */}
        <div className={styles.list}>
          {filtered.map((g) => {
            const checked = safeSelected.includes(g.id);

            return (
              <div
                key={g.id}
                className={`${styles.item} ${checked ? styles.active : ""}`}
                onClick={() => toggle(g.id)}
              >
                <input type="checkbox" readOnly checked={checked} />
                {g.label}
              </div>
            );
          })}
        </div>

        <button onClick={onClose}>Done</button>
      </div>
    </div>
  );
}