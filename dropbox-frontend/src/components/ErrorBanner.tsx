import React from "react";
import styles from "./css/ErrorBanner.module.css";

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  return (
    <div className={styles.errorBanner}>
      <span>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
    </div>
  );
};

export default ErrorBanner;
