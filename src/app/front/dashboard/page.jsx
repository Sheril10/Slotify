"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Dashboard() {
  const router = useRouter();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // MOCK BACKEND
    const mock = [
      { id: 1, name: "CS Timetable", generated: true },
      { id: 2, name: "EE Timetable", generated: true },
      { id: 3, name: "Fall Schedule", generated: true },
    ];

    setCards(mock);
  }, []);

  const openCard = (name) => {
    // only allow dashboard view after submit
    const isGenerated = localStorage.getItem(`generated_${name}`);

    if (isGenerated) {
      router.push(`/dashboard/${encodeURIComponent(name)}`);
    } else {
      router.push(`/front/${encodeURIComponent(name)}`);
    }
  };

  const download = (name) => {
    alert(`Downloading PDF for: ${name}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button onClick={() => router.push("/front")}>Home</button>
        <button>Edit</button>
        <button>Progress Overview</button>
      </div>

      <div className={styles.main}>
        <h1 className={styles.title}>TIMETABLE DASHBOARD</h1>

        <div className={styles.cardContainer}>
          {cards.map((c) => (
            <div key={c.id} className={styles.card}>
              <button onClick={() => openCard(c.name)}>
                <img src="/tt.png" />
              </button>

              <p>{c.name}</p>

              <button onClick={() => download(c.name)}>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}