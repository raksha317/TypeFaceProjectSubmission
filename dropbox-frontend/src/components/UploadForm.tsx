import { useRef, useState } from "react";
import axios from "axios";
import styles from "./css/uploadForm.module.css";
import ErrorBanner from "../components/ErrorBanner";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8080/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      onUploadSuccess();
      e.target.value = "";
    } catch (error) {
      setError(`"Failed to upload file ${error}`);
      console.error(`"Failed to upload file ${error}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <button className ={styles.uploadBtn} onClick={handleButtonClick} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      <input
        type="file"
        accept=".txt,.jpg,.jpeg,.png,.json,.pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadForm;
