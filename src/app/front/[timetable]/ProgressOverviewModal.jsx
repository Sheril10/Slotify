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

  const renderTable = (rows, headers) => {
    if (!rows || rows.length === 0)
      return <p style={{ textAlign: "center", color: "#777" }}>No entries yet</p>;

    return (
      <table className={styles.overviewTable}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((v, j) => (
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const sections = [
    { name: "SESSIONS", key: "sessions", headers: ["Sr", "Year"] },
    { name: "SHIFTS", key: "shifts" },
    { name: "GROUPS", key: "groups" },
    { name: "SUBJECTS", key: "subjects" },
    { name: "SECTIONS", key: "sections" },
    { name: "DEPARTMENTS", key: "departments" },
    { name: "TEACHERS", key: "teachers" },
    { name: "ROOMS", key: "rooms" },
  ];

  return (
    <div className={styles.modalOverlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
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
              <div className={styles.sectionHeader} onClick={() => toggleSection(s.key)}>
                <span>{s.name}</span>
                <span className={styles.arrow}>
                  {openSections.includes(s.key) ? "▲" : "▼"}
                </span>
              </div>
              {openSections.includes(s.key) && (
                <div className={styles.tableContainer}>
                  {renderTable(data[s.key], s.headers || ["#", "Value"])}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
