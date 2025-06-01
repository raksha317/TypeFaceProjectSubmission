import { useEffect, useState } from "react";
import UploadForm from '../components/UploadForm';
import FileTable from '../components/FileTable';
import styles from './css/HomePage.module.css';
import axios from "axios";
import ErrorBanner from "../components/ErrorBanner";

interface FileMetadata {
  id: string;
  filename: string;
  uploadTime: string;
}

const HomePage = () => {
 const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get<FileMetadata[]>("http://localhost:8080/files");
      setFiles(response.data);
    } catch (error) {
      setError(`Error fetching files: ${error}`);
      console.error(`Error fetching files: ${error}`)
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className={styles.container}>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <h1>Welcome to Dropbox Clone</h1>
      <UploadForm onUploadSuccess={fetchFiles} />
      <FileTable files={files} />
    </div>
  );
};

export default HomePage;
