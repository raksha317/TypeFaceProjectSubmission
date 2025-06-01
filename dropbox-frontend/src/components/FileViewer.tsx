import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ErrorBanner from "../components/ErrorBanner";

const FileViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get<Blob>(`http://localhost:8080/files/${id}`, {
          responseType: 'blob',
        });

        const contentType = response.headers['content-type'];
const name = response.headers['content-disposition']?.split('filename=')[1] || `file-${id}`;
setFileType(contentType);
setFileName(name);

if (
  contentType.startsWith('text/') ||
  contentType === 'application/json' ||
  contentType === 'text/csv'
) {
  const text = await response.data.text();
  setContent(text);
} else if (contentType.startsWith('image/')) {
  const url = URL.createObjectURL(response.data);
  setImageUrl(url);
} else if (contentType === 'application/pdf') {
  const url = URL.createObjectURL(response.data);
  setPdfUrl(url);
}
      } catch (err) {
        setError('Failed to load file.');

        console.error(err);
      }
    };

    fetchFile();
  }, [id]);


  return (
    <div style={{ padding: '2rem' }}>
     {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <h2>Viewing: {fileName}</h2>
        {content && (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</pre>
    )}

    {imageUrl && (
    <img src={imageUrl} alt={fileName} style={{ maxWidth: '100%' }} />
    )}

    {pdfUrl && (
    <iframe
        src={pdfUrl}
        width="100%"
        height="600px"
        title="PDF Viewer"
        style={{ border: 'none' }}
    />
    )}
    </div>
  );
};

export default FileViewer;
