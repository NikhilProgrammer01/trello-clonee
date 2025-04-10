import React, { useState, useRef, useEffect } from "react";
import styles from "./kanbanCard.module.css";

const KanbanCard = ({
  id,
  columnId,
  title,
  labels,
  dueDate,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cardRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(id);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    // Store the card and column ID in the drag data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        cardId: id,
        sourceColumnId: columnId,
      }),
    );

    // Set a custom drag image (optional)
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        cardRef.current,
        rect.width / 2,
        rect.height / 2,
      );
    }

    // Set allowed drag effects
    e.dataTransfer.effectAllowed = "move";

    // Call the parent's onDragStart handler
    onDragStart(id, columnId);

    // Add a small delay to allow the drag image to be set before adding the dragging class
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add(styles.dragging);
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    // Call the parent's onDragEnd handler
    onDragEnd();

    // Remove the dragging class
    if (cardRef.current) {
      cardRef.current.classList.remove(styles.dragging);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.cardContainer} ${isDragging ? styles.dragging : ""}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.menuButton} onClick={toggleMenu}>
            <span className={styles.menuDots}>⋮</span>
          </button>
          {menuOpen && (
            <div className={styles.menuDropdown}>
              <div className={styles.menuItem} onClick={handleEdit}>
                Edit card
              </div>
              <div className={styles.menuItem} onClick={handleDelete}>
                Remove card
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.labelsContainer}>
        {labels.map((label, index) => (
          <div
            key={index}
            className={styles.label}
            style={{
              backgroundColor:
                label.color || (label.priority ? "#dc2626" : "#4318d1"),
            }}
          >
            {label.text}
          </div>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.assigneeAvatar} />
        <div className={styles.dueDate}>{dueDate}</div>
      </div>
    </div>
  );
};

export default KanbanCard;
