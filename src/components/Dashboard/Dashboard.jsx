import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import KanbanBoard from "../KanbanBoard/KanbanBoard";

const Dashboard = () => {
  // State for active filters
  const [activeFilters, setActiveFilters] = useState(["all"]);

  // State for boards
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  // Default columns for new boards
  const defaultColumns = [
    {
      id: "todo",
      title: "To Do",
      cards: [],
    },
    {
      id: "inprogress",
      title: "In Progress",
      cards: [],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ];

  // Load boards from localStorage on component mount
  useEffect(() => {
    const savedBoards = localStorage.getItem("kanbanBoards");
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);

      // Set active board to the first one or from localStorage
      const savedActiveBoard = localStorage.getItem("activeKanbanBoard");
      if (
        savedActiveBoard &&
        parsedBoards.some((board) => board.id === savedActiveBoard)
      ) {
        setActiveBoard(savedActiveBoard);
      } else if (parsedBoards.length > 0) {
        setActiveBoard(parsedBoards[0].id);
      }
    } else {
      // Create a default board if none exists
      const defaultBoard = {
        id: `board-${Date.now()}`,
        name: "Main Board",
        columns: defaultColumns,
      };
      setBoards([defaultBoard]);
      setActiveBoard(defaultBoard.id);
    }
  }, []);

  // Save boards to localStorage whenever they change
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem("kanbanBoards", JSON.stringify(boards));
    }
  }, [boards]);

  // Save active board to localStorage whenever it changes
  useEffect(() => {
    if (activeBoard) {
      localStorage.setItem("activeKanbanBoard", activeBoard);
    }
  }, [activeBoard]);

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  // Handler for board changes
  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  // Handler for adding a new board
  const handleAddBoard = (boardName) => {
    const newBoard = {
      id: `board-${Date.now()}`,
      name: boardName,
      columns: defaultColumns,
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setActiveBoard(newBoard.id);
  };

  // Handler for updating columns in the active board
  const handleUpdateColumns = (updatedColumns) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === activeBoard) {
        return {
          ...board,
          columns: updatedColumns,
        };
      }
      return board;
    });

    setBoards(updatedBoards);
  };

  // Get the active board data
  const getActiveBoardData = () => {
    return boards.find((board) => board.id === activeBoard) || null;
  };

  const activeBoardData = getActiveBoardData();

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        boards={boards}
        activeBoard={activeBoard}
        onBoardChange={handleBoardChange}
        onAddBoard={handleAddBoard}
      />
      <div className={styles.mainContent}>
        <Navbar
          username="JD"
          boardName={activeBoardData ? activeBoardData.name : ""}
        />
        {activeBoardData && (
          <KanbanBoard
            activeFilters={activeFilters}
            columns={activeBoardData.columns}
            onUpdateColumns={handleUpdateColumns}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
