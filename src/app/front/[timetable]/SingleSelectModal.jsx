"use client";

import styles from "./singleSelect.module.css";

export default function SingleSelectModal({
  options,
  onSelect,
  onClose,
  title,
}) {
  return (
    <div className={styles.overlay} onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.modal}>
        <h3>{title}</h3>

        <div className={styles.list}>
          {options.map((opt, i) => (
            <div
              key={i}
              className={styles.item}
              onClick={() => {
                onSelect(opt);
                onClose();
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}