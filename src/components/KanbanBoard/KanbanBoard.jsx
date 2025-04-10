import React, { useState, useEffect } from "react";
import styles from "./KanbanBoard.module.css";
import KanbanColumn from "../KanbanColumn/KanbanColumn";
import Modal from "../Modal/Modal";
import CardForm from "../CardForm/CardForm";

const KanbanBoard = ({
  activeFilters = ["all"],
  columns = [],
  onUpdateColumns,
}) => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // State for drag and drop
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [draggedSourceColumnId, setDraggedSourceColumnId] = useState(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState(null);

  // State for add list form visibility, and new list name
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [filteredColumns, setFilteredColumns] = useState([]);

  // Filter columns based on active filters
  useEffect(() => {
    if (activeFilters.includes("all")) {
      setFilteredColumns(columns);
    } else {
      // Map label text to filter IDs for comparison
      const labelToFilterMap = {
        Feature: "feature",
        Development: "development",
        Testing: "testing",
        Bug: "bug",
        Design: "design",
        "High Priority": "high-priority",
      };

      // Filter columns that have cards matching the active filters
      const filtered = columns.map((column) => {
        // Filter cards that match any of the active filters
        const filteredCards = column.cards.filter((card) => {
          return card.labels.some((label) => {
            const filterId = labelToFilterMap[label.text];
            return filterId && activeFilters.includes(filterId);
          });
        });

        // Return column with filtered cards
        return {
          ...column,
          cards: filteredCards,
        };
      });

      // Only show columns that have cards after filtering
      setFilteredColumns(filtered.filter((column) => column.cards.length > 0));
    }
  }, [columns, activeFilters]);

  // Handler for opening the add list form
  const handleAddListClick = () => {
    setIsAddingList(true);
  };

  // Handler for input change
  const handleNewListNameChange = (e) => {
    setNewListName(e.target.value);
  };

  // Handler for saving the new list
  const handleSaveNewList = () => {
    if (newListName.trim()) {
      const newColumn = {
        id: `list-${Date.now()}`,
        title: newListName,
        cards: [],
      };

      const updatedColumns = [...columns, newColumn];
      onUpdateColumns(updatedColumns);
      setNewListName("");
      setIsAddingList(false);
    }
  };

  // Handler for deleting a list
  const handleDeleteList = (listId) => {
    const updatedColumns = columns.filter((column) => column.id !== listId);
    onUpdateColumns(updatedColumns);
  };

  // Handler for opening the card creation modal
  const handleAddCard = (columnId) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  // Handler for editing a card
  const handleEditCard = (columnId, cardId) => {
    setActiveColumnId(columnId);

    // Find the card to edit
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      const card = column.cards.find((c) => c.id === cardId);
      if (card) {
        setEditingCard(card);
        setIsModalOpen(true);
      }
    }
  };

  // Handler for deleting a card
  const handleDeleteCard = (columnId, cardId) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        };
      }
      return column;
    });

    onUpdateColumns(updatedColumns);
  };

  // Handler for saving a new card or updating an existing one
  const handleSaveCard = (cardData) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === activeColumnId) {
        if (editingCard) {
          // Update existing card
          return {
            ...column,
            cards: column.cards.map((card) =>
              card.id === cardData.id ? cardData : card,
            ),
          };
        } else {
          // Add new card
          return {
            ...column,
            cards: [...column.cards, cardData],
          };
        }
      }
      return column;
    });

    onUpdateColumns(updatedColumns);
    setIsModalOpen(false);
    setActiveColumnId(null);
    setEditingCard(null);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveColumnId(null);
    setEditingCard(null);
  };

  // Handler for key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveNewList();
    } else if (e.key === "Escape") {
      handleCancelAddList();
    }
  };

  // Handler for canceling the add list form
  const handleCancelAddList = () => {
    setNewListName("");
    setIsAddingList(false);
  };

  // Drag and drop handlers
  const handleDragStart = (cardId, columnId) => {
    setDraggedCardId(cardId);
    setDraggedSourceColumnId(columnId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDraggedSourceColumnId(null);
    setDropTargetColumnId(null);
  };

  // Handler for dropping a card in a different column
  const handleCardDrop = (
    cardId,
    sourceColumnId,
    targetColumnId,
    targetCardId = null,
    dropPosition = null,
  ) => {
    // Find the card in the source column
    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    if (!sourceColumn) return;

    const cardToMove = sourceColumn.cards.find((card) => card.id === cardId);
    if (!cardToMove) return;

    // Create updated columns array
    const updatedColumns = columns.map((column) => {
      // Remove card from source column
      if (column.id === sourceColumnId) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        };
      }

      // Add card to target column
      if (column.id === targetColumnId) {
        // If no target card specified, add to the end
        if (!targetCardId) {
          return {
            ...column,
            cards: [...column.cards, cardToMove],
          };
        }

        // Otherwise, insert at the specified position
        const targetIndex = column.cards.findIndex(
          (card) => card.id === targetCardId,
        );
        if (targetIndex === -1) {
          // Target card not found, add to the end
          return {
            ...column,
            cards: [...column.cards, cardToMove],
          };
        }

        // Insert before or after the target card
        const newCards = [...column.cards];
        const insertIndex =
          dropPosition === "after" ? targetIndex + 1 : targetIndex;
        newCards.splice(insertIndex, 0, cardToMove);

        return {
          ...column,
          cards: newCards,
        };
      }

      return column;
    });

    // Update columns
    onUpdateColumns(updatedColumns);
  };

  // Handler for reordering cards within the same column
  const handleCardReorder = (columnId, cardId, targetCardId, dropPosition) => {
    // Don't do anything if dropping on itself
    if (cardId === targetCardId) return;

    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    const cardToMove = column.cards.find((card) => card.id === cardId);
    if (!cardToMove) return;

    const targetIndex = column.cards.findIndex(
      (card) => card.id === targetCardId,
    );
    if (targetIndex === -1) return;

    // Create a new array of cards without the moved card
    const newCards = column.cards.filter((card) => card.id !== cardId);

    // Determine the insert position
    let insertIndex = targetIndex;
    if (dropPosition === "after") {
      insertIndex = targetIndex;
    } else {
      // If the card being moved is before the target and we're inserting before,
      // we need to adjust the index
      const currentIndex = column.cards.findIndex((card) => card.id === cardId);
      if (currentIndex < targetIndex) {
        insertIndex = targetIndex - 1;
      }
    }

    // Insert the card at the new position
    newCards.splice(insertIndex, 0, cardToMove);

    // Update the columns
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: newCards,
        };
      }
      return col;
    });

    onUpdateColumns(updatedColumns);
  };

  return (
    <div className={styles.boardContainer}>
      {filteredColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          cards={column.cards}
          onDelete={() => handleDeleteList(column.id)}
          onAddCard={() => handleAddCard(column.id)}
          onEditCard={(cardId) => handleEditCard(column.id, cardId)}
          onDeleteCard={(cardId) => handleDeleteCard(column.id, cardId)}
          onCardDrop={handleCardDrop}
          onCardReorder={handleCardReorder}
          draggedCardId={draggedCardId}
          draggedSourceColumnId={draggedSourceColumnId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDropTarget={dropTargetColumnId === column.id}
        />
      ))}

      {!isAddingList ? (
        <div className={styles.addColumnButton} onClick={handleAddListClick}>
          + Add another list
        </div>
      ) : (
        <div className={styles.addListForm}>
          <input
            type="text"
            className={styles.addListInput}
            placeholder="Enter list title..."
            value={newListName}
            onChange={handleNewListNameChange}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <div className={styles.addListActions}>
            <button className={styles.saveButton} onClick={handleSaveNewList}>
              Save
            </button>
            <button
              className={styles.cancelButton}
              onClick={handleCancelAddList}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCard ? "Edit Card" : "Add New Card"}
      >
        <CardForm
          onSave={handleSaveCard}
          onCancel={handleCloseModal}
          editCard={editingCard}
        />
      </Modal>
    </div>
  );
};

export default KanbanBoard;
