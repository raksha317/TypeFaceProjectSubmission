import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./css/fileTable.module.css";
import ErrorBanner from "../components/ErrorBanner";

interface FileMetadata {
  id: string;
  filename: string;
  uploadTime: string; // ISO date string
}

interface FileTableProps {
    files: FileMetadata[];
}

const FileTable: React.FC<FileTableProps> = ({ files }) => {
  const [error, setError] = useState<string | null>(null);
  const handleDownload = async (filename: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/download/${filename}`, {
        responseType: 'blob',
      });
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(`Error downloading file: ${error}`);
    }
  };

  const handleView = (filename: string) => {
    const url = `http://localhost:8080/files/${encodeURIComponent(filename)}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.tableWrapper}>
    {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <h2>Uploaded Files</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={3}>No files uploaded yet.</td>
            </tr>
          ) : (
            files.map((file) => (
              <tr key={file.id}>
                <td>
                    {file.filename}
                </td>
                <td>{new Date(file.uploadTime).toLocaleString()}</td>
                <td>
                <button
                    onClick={() => handleDownload(file.filename)}
                    className={styles.downloadBtn}
                    style={{ marginRight: 8 }}
                >
                    Download
                </button>
                <button
                    onClick={() => handleView(file.filename)}
                    className={styles.viewBtn}
                >
                    View
                </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;