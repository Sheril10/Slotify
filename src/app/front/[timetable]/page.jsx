"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../page.module.css"; // adjust path if needed

export default function TimetablePage() {
  const { timetable } = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState(null);
 const [steps, setSteps] = useState(["Add Sessions"]);

  const nextSteps = ["Add Shifts", "Add Groups",  "Add Subjects" , "Add Sections", "Add Departments", "Add Teachers", "Add Rooms"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("token");
      if (!user) router.push("/");
    }
  }, [router]);

  const toggleExpand = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const addNextStep = () => {
    const next = nextSteps[steps.length - 1];
    if (next) setSteps([...steps, next]);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <img
          src="/ChatGPT Image Sep 13, 2025, 04_46_17 AM.png"
          alt="Logo"
          className={styles.logo}
        />

        <div className={styles.nav}>
          <button className={styles.navItem} onClick={() => router.push("/front")}>
            Home
          </button>

          <button className={styles.navItem}>About</button>

          <div className={styles.expandableSection}>
            <button
              className={styles.navItem}
              onClick={() => toggleExpand("settings")}
            >
              Settings
            </button>
            {expanded === "settings" && (
              <div className={styles.subMenu}>
                <button className={styles.subItem}>Configuration</button>
                <button className={styles.subItem} onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className={styles.expandableSection}>
            <button
              className={styles.navItem}
              onClick={() => toggleExpand("help")}
            >
              Help
            </button>
            {expanded === "help" && (
              <div className={styles.subMenu}>
                <button className={styles.subItem}>Contact Support</button>
                <button className={styles.subItem}>FAQs</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{decodeURIComponent(timetable)}</h1>
          <button className={styles.statusBox}>Current Progress: 0%</button>
        </div>

        <div className={styles.cardContainer}>
          {steps.map((label, index) => (
            <div key={index} className={styles.cardWrapper}>
              <button
                className={styles.cardBtn}
                onClick={index === steps.length - 1 ? addNextStep : undefined}
              >
                <img src="/img1.png" alt="Step" className={styles.addIcon} />
              </button>
              <span className={styles.cardLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}