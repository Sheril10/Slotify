"use client";

import { useState } from "react";
import styles from "./subjectPicker.module.css";

export default function SubjectPickerModal({
  subjects = [],
  selectedSubjects,
  setSelectedSubjects,
  onClose,
}) {
  // ✅ FORCE ARRAY (fixes crash)
  const safeSelected = Array.isArray(selectedSubjects)
    ? selectedSubjects
    : [];

  const [search, setSearch] = useState("");

  // ✅ FORCE IDs IF MISSING
  const normalizedSubjects = subjects.map((s, i) => ({
    id: s.id ?? i,
    name: s.name,
    code: s.code,
  }));

  const filtered = normalizedSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.code || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleSubject = (id) => {
    if (safeSelected.includes(id)) {
      setSelectedSubjects(safeSelected.filter((s) => s !== id));
    } else {
      setSelectedSubjects([...safeSelected, id]);
    }
  };

  const removeTag = (id) => {
    setSelectedSubjects(safeSelected.filter((s) => s !== id));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Select Subjects</h3>

        <input
          className={styles.search}
          placeholder="Search subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ TAGS */}
        <div className={styles.tagBox}>
          {safeSelected.map((id) => {
            const sub = normalizedSubjects.find((s) => s.id === id);
            if (!sub) return null;

            return (
              <div key={`tag-${id}`} className={styles.tag}>
                {sub.name} ({sub.code})
                <span onClick={() => removeTag(id)}>✕</span>
              </div>
            );
          })}
        </div>

        {/* ✅ LIST */}
        <div className={styles.list}>
          {filtered.map((s, index) => {
            const checked = safeSelected.includes(s.id);

            return (
              <div
                key={`item-${s.id}-${index}`} // ✅ FIXED KEY
                className={`${styles.item} ${
                  checked ? styles.active : ""
                }`}
                onClick={() => toggleSubject(s.id)}
              >
                <input type="checkbox" readOnly checked={checked} />
                {s.name} ({s.code})
              </div>
            );
          })}
        </div>

        <button onClick={onClose}>Done</button>
      </div>
    </div>
  );
}