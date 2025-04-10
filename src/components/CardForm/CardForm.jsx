import React, { useState, useEffect } from "react";
import styles from "./CardForm.module.css";

const CardForm = ({ onSave, onCancel, editCard = null }) => {
  const [title, setTitle] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [dueDate, setDueDate] = useState("");

  // Initialize form with existing card data if editing
  useEffect(() => {
    if (editCard) {
      setTitle(editCard.title || "");
      setDueDate(editCard.dueDate || "");

      // Map labels to their IDs for selection
      const labelIds = editCard.labels
        .map((label) => {
          // Find the matching label option
          const matchingOption = labelOptions.find(
            (option) =>
              option.text === label.text ||
              (option.id === "high-priority" && label.priority),
          );
          return matchingOption ? matchingOption.id : null;
        })
        .filter((id) => id !== null);

      setSelectedLabels(labelIds);
    }
  }, [editCard]);

  const labelOptions = [
    { id: "development", text: "Development", color: "#4318d1" },
    { id: "design", text: "Design", color: "#3182ce" },
    { id: "feature", text: "Feature", color: "#38a169" },
    { id: "testing", text: "Testing", color: "#dd6b20" },
    { id: "bug", text: "Bug", color: "#e53e3e" },
    { id: "high-priority", text: "High Priority", color: "#dc2626" },
  ];

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleLabelToggle = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const selectedLabelObjects = labelOptions
      .filter((label) => selectedLabels.includes(label.id))
      .map((label) => ({
        text: label.text,
        priority: label.id === "high-priority",
        color: label.color,
      }));

    const cardData = {
      id: editCard ? editCard.id : `card-${Date.now()}`,
      title,
      labels: selectedLabelObjects,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
    };

    onSave(cardData);
  };

  return (
    <form className={styles.cardForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Task Title
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Labels</label>
        <div className={styles.labelsContainer}>
          {labelOptions.map((label) => (
            <div
              key={label.id}
              className={`${styles.labelOption} ${selectedLabels.includes(label.id) ? styles.selected : ""}`}
              style={{
                backgroundColor: selectedLabels.includes(label.id)
                  ? label.color
                  : "transparent",
              }}
              onClick={() => handleLabelToggle(label.id)}
            >
              <span
                className={styles.labelText}
                style={{
                  color: selectedLabels.includes(label.id) ? "#fff" : "#4a5568",
                }}
              >
                {label.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          className={styles.input}
          value={dueDate}
          onChange={handleDueDateChange}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          {editCard ? "Update Card" : "Save Card"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CardForm;
