"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function ProgressOverviewModal({ onClose, data }) {
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderTable = (rows) => {
    if (!rows || rows.length === 0)
      return (
        <p style={{ textAlign: "center", color: "#777" }}>
          No entries yet
        </p>
      );

    const columns = Object.keys(rows[0]);

    return (
      <table className={styles.overviewTable}>
        <thead>
          <tr>
            {columns.map((_, i) => (
              <th key={i}></th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ✅ FULLY UPDATED SECTION MAP (SYNCED WITH TIMETABLE PAGE)
  const sections = [
    { name: "SESSIONS", key: "sessions" },
    { name: "ACADEMIC YEARS", key: "academicYears" },
    { name: "GROUPS", key: "groups" },
    { name: "SHIFTS", key: "shifts" },
    { name: "TIMESLOTS", key: "timeslots" },
    { name: "SUBJECTS", key: "subjects" },
    { name: "SUBJECT COMBINATIONS", key: "subjectCombinations" },
    { name: "GROUP SUBJECTS", key: "groupSubjects" },
    { name: "DEPARTMENTS", key: "departments" },
    { name: "TEACHERS", key: "teachers" },
    { name: "ROOMS", key: "rooms" },
    { name: "SECTIONS", key: "sections" },
    { name: "SUBSECTIONS", key: "subsections" },
  ];

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.progressModal}>
        <div className={styles.modalHeader}>
          <h2>Progress Overview</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.progressContent}>
          {sections.map((s, i) => (
            <div key={i} className={styles.sectionBlock}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection(s.key)}
              >
                <span>{s.name}</span>
                <span className={styles.arrow}>
                  {openSections.includes(s.key) ? "▲" : "▼"}
                </span>
              </div>

              {openSections.includes(s.key) && (
                <div className={styles.tableContainer}>
                  {renderTable(data[s.key])}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}