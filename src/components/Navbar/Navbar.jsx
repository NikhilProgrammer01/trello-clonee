import React from "react";
import styles from "./Navbar.module.css";

const Navbar = ({ username = "JD", boardName = "" }) => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.viewOptions}>
        <div className={styles.boardName}>{boardName}</div>
        <div className={styles.viewSeparator}>|</div>
        <div className={styles.activeView}>Board</div>
        <div className={styles.inactiveView}>Calendar</div>
      </div>
      <div className={styles.navbarActions}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search cards..."
            className={styles.searchInput}
          />
        </div>
        <button className={styles.actionButton}>Power-Ups</button>
        <button className={styles.actionButton}>Automation</button>
        <div className={styles.userAvatar}>{username}</div>
      </div>
    </div>
  );
};

export default Navbar;
