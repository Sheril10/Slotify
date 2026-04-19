import { useState } from "react";
import styles from "./dropdownPopup.module.css";

export default function DropdownPopup({
  title,
  options,
  selected,
  onSelect,
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filtered = (options || []).filter((opt) =>
    (opt?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>{title}</h3>

        <input
          className={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.list}>
          {filtered.map((opt, index) => (
            <div
              key={opt.id ?? opt.name ?? index}
              className={`${styles.item} ${
                selected === opt?.name ? styles.active : ""
              }`}
              onClick={() => {
                if (opt?.name) {
                  onSelect(opt.name);
                  onClose();
                }
              }}
            >
              {opt?.name || "Unnamed"}
            </div>
          ))}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}