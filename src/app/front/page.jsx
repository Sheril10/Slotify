"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("token"));
      setEmail(user?.email || null);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (!user) router.push("/");
  }, [router]);

  const toggleExpand = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const saveCard = () => {
    if (newName.trim() === "") return;
    if (newName.trim().length > 30) {
      alert("Timetable name cannot exceed 30 characters.");
      return;
    }

    const updated = [{ id: Date.now(), name: newName.trim() }, ...cards];
    setCards(updated);
    localStorage.setItem(`timetables_${email}`, JSON.stringify(updated));

    setShowModal(false);
    setNewName("");
  };

  const deleteCard = (id) => {
    const updated = cards.filter((card) => card.id !== id);
    setCards(updated);
    localStorage.setItem(`timetables_${email}`, JSON.stringify(updated));
  };

  const openTimetable = (name) => {
    router.push(`/front/${encodeURIComponent(name)}`);
  };

  const recentTimetables = cards.slice(0, 3);

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
          <button className={styles.navItem}>Home</button>

          {recentTimetables.length > 0 && (
            <div className={styles.subMenu}>
              {recentTimetables.map((t) => (
                <button
                  key={t.id}
                  className={styles.subItem}
                  onClick={() => openTimetable(t.name)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

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
        <div className={styles.scrollContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>GENERATE TIMETABLES</h1>
            {cards.length > 0 && (
              <button className={styles.statusBox}>
                Active Status:
                <br /> {cards[0].name}
              </button>
            )}
          </div>

          <div className={styles.addRow}>
            <div className={styles.addBtnWrapper}>
              <button
                onClick={() => setShowModal(true)}
                className={styles.addBtn}
              >
                <img src="/img1.png" alt="Add" className={styles.addIcon} />
              </button>
              <span className={styles.addLabel}>Add Timetable</span>
            </div>

            <div className={styles.cardContainer}>
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`${styles.cardWrapper} ${
                    index === 0 ? styles.firstCard : ""
                  }`}
                >
                  <button
                    className={styles.cardBtn}
                    onClick={() => openTimetable(card.name)}
                  >
                    <img
                      src="/tt.png"
                      alt="Timetable"
                      className={styles.addIcon1}
                    />
                  </button>
                  <div className={styles.cardLabelRow}>
                    <span className={styles.cardLabel} title={card.name}>
                      {card.name}
                    </span>
                    <img
                      src="/trash.png"
                      alt="Delete"
                      className={styles.trashIcon}
                      onClick={() => deleteCard(card.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Enter name of your timetable</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveCard()}
              className={styles.input}
              placeholder="Timetable name (max 30 chars)"
              maxLength={30}
            />
            <div className={styles.modalActions}>
              <button onClick={saveCard} className={styles.saveBtn}>
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}