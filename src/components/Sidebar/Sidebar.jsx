import React, { useState } from "react";
import styles from "./sidebar.module.css";

const Sidebar = ({
  activeFilters,
  onFilterChange,
  boards,
  activeBoard,
  onBoardChange,
  onAddBoard,
}) => {
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  // Available filter options
  const filterOptions = [
    { id: "all", text: "All", color: "#4318d1" },
    { id: "feature", text: "Feature", color: "#38a169" },
    { id: "development", text: "Development", color: "#4318d1" },
    { id: "testing", text: "Testing", color: "#dd6b20" },
    { id: "bug", text: "Bugs", color: "#e53e3e" },
    { id: "design", text: "Design", color: "#3182ce" },
    { id: "high-priority", text: "High Priority", color: "#dc2626" },
  ];

  // Handle filter click
  const handleFilterClick = (filterId) => {
    if (filterId === "all") {
      // If "All" is clicked, clear all other filters
      onFilterChange(["all"]);
    } else {
      // If any other filter is clicked
      let newFilters;

      if (activeFilters.includes(filterId)) {
        // If filter is already active, remove it
        newFilters = activeFilters.filter((id) => id !== filterId);

        // If no filters left, set to "All"
        if (newFilters.length === 0) {
          newFilters = ["all"];
        }
      } else {
        // If filter is not active, add it and remove "All" if present
        newFilters = activeFilters.filter((id) => id !== "all");
        newFilters.push(filterId);
      }

      onFilterChange(newFilters);
    }
  };

  // Check if a filter is active
  const isFilterActive = (filterId) => {
    return activeFilters.includes(filterId);
  };

  // Handle add board click
  const handleAddBoardClick = () => {
    setIsAddingBoard(true);
  };

  // Handle board name change
  const handleBoardNameChange = (e) => {
    setNewBoardName(e.target.value);
  };

  // Handle save new board
  const handleSaveNewBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName);
      setNewBoardName("");
      setIsAddingBoard(false);
    }
  };

  // Handle cancel add board
  const handleCancelAddBoard = () => {
    setNewBoardName("");
    setIsAddingBoard(false);
  };

  // Handle key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveNewBoard();
    } else if (e.key === "Escape") {
      handleCancelAddBoard();
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>Kanban Board</div>
      <div className={styles.sidebarContent}>
        <div className={styles.sectionTitle}>Boards</div>
        <div className={styles.boardsList}>
          {boards.map((board) => (
            <div
              key={board.id}
              className={`${styles.boardItem} ${board.id === activeBoard ? styles.activeBoard : ""}`}
              onClick={() => onBoardChange(board.id)}
            >
              {board.name}
            </div>
          ))}
        </div>

        {!isAddingBoard ? (
          <div className={styles.addBoardButton} onClick={handleAddBoardClick}>
            + Add Board
          </div>
        ) : (
          <div className={styles.addBoardForm}>
            <input
              type="text"
              className={styles.addBoardInput}
              placeholder="Enter board name..."
              value={newBoardName}
              onChange={handleBoardNameChange}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <div className={styles.addBoardActions}>
              <button
                className={styles.saveButton}
                onClick={handleSaveNewBoard}
              >
                Save
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancelAddBoard}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.sectionTitle}>Filters</div>
        <div className={styles.filterLabel}>Labels</div>
        <div className={styles.labelContainer}>
          {filterOptions.map((filter) => (
            <div
              key={filter.id}
              className={`${styles.filterLabel} ${isFilterActive(filter.id) ? styles.activeFilter : ""}`}
              style={{
                backgroundColor: isFilterActive(filter.id)
                  ? filter.color
                  : "transparent",
                color: isFilterActive(filter.id) ? "#fff" : "#4a5568",
              }}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.text}
            </div>
          ))}
        </div>
        <div className={styles.membersSection}>
          <div className={styles.filterLabel}>Members</div>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>JD</div>
            <div className={styles.avatar}>AK</div>
            <div className={styles.avatar}>RB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
