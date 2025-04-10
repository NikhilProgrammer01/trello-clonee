import React, { useState, useRef } from "react";
import styles from "./kanbanColumn.module.css";
import KanbanCard from "../KanbanCard/KanbanCard";

const KanbanColumn = ({
  id,
  title,
  cards,
  onDelete,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardDrop,
  onCardReorder,
  draggedCardId,
  draggedSourceColumnId,
  onDragStart,
  onDragEnd,
  isDropTarget,
}) => {
  const [dragOverCardId, setDragOverCardId] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'before' or 'after'
  const cardsContainerRef = useRef(null);

  // Drop handlers for the column
  const handleDragOver = (e) => {
    // Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Add the drop target class if not already added
    if (!isDropTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add(styles.dropTarget);
    }
  };

  const handleDragLeave = (e) => {
    // Remove the drop target class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove(styles.dropTarget);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // Remove the drop target class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove(styles.dropTarget);
    }

    try {
      // Get the card and source column ID from the drag data
      const data = JSON.parse(e.dataTransfer.getData("application/json"));

      if (data && data.cardId && data.sourceColumnId) {
        // If dropping directly on the column (not on a card)
        if (!dragOverCardId) {
          // Call the parent's onCardDrop handler to move to the end of this column
          onCardDrop(data.cardId, data.sourceColumnId, id);
        }
      }
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }

    // Reset drag state
    setDragOverCardId(null);
    setDropPosition(null);
  };

  // Handlers for card drag events
  const handleCardDragOver = (e, cardId) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedCardId === cardId) return; // Don't allow dropping on itself

    const cardElement = e.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const y = e.clientY;

    // Determine if we're dropping before or after the card
    const isBeforeCard = y < rect.top + rect.height / 2;

    setDragOverCardId(cardId);
    setDropPosition(isBeforeCard ? "before" : "after");
  };

  const handleCardDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOverCardId(null);
    setDropPosition(null);
  };

  const handleCardDrop = (e, targetCardId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get the card and source column ID from the drag data
      const data = JSON.parse(e.dataTransfer.getData("application/json"));

      if (data && data.cardId && data.sourceColumnId) {
        // If source and target columns are the same, reorder within column
        if (data.sourceColumnId === id) {
          onCardReorder(id, data.cardId, targetCardId, dropPosition);
        } else {
          // If different columns, move card to this column at the specific position
          onCardDrop(
            data.cardId,
            data.sourceColumnId,
            id,
            targetCardId,
            dropPosition,
          );
        }
      }
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }

    // Reset drag state
    setDragOverCardId(null);
    setDropPosition(null);
  };

  // Render drop indicator
  const renderDropIndicator = (cardId, position) => {
    if (dragOverCardId === cardId && dropPosition === position) {
      return <div className={styles.dropIndicator}></div>;
    }
    return null;
  };

  return (
    <div
      className={`${styles.columnContainer} ${isDropTarget ? styles.dropTarget : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.columnHeader}>
        <span>{title}</span>
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          title="Delete list"
        >
          ×
        </button>
      </div>
      <div className={styles.cardsContainer} ref={cardsContainerRef}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={styles.cardWrapper}
            onDragOver={(e) => handleCardDragOver(e, card.id)}
            onDragLeave={handleCardDragLeave}
            onDrop={(e) => handleCardDrop(e, card.id)}
          >
            {renderDropIndicator(card.id, "before")}
            <KanbanCard
              id={card.id}
              columnId={id}
              title={card.title}
              labels={card.labels}
              dueDate={card.dueDate}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedCardId === card.id}
            />
            {renderDropIndicator(card.id, "after")}
          </div>
        ))}
        {cards.length === 0 && (
          <div className={styles.emptyColumnMessage}>
            No cards yet. Add a card or drag one here.
          </div>
        )}
      </div>
      <div className={styles.addCardButton} onClick={onAddCard}>
        + Add a card
      </div>
    </div>
  );
};

export default KanbanColumn;
