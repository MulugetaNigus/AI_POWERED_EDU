import React from 'react';
import { FileText, X, Upload } from 'lucide-react';

interface PDFPreviewProps {
  onClose: () => void;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  pdfURL: string | null;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  onClose,
  onFileSelect,
  selectedFile,
  pdfURL
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          PDF Preview
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {!selectedFile ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="h-full">
            {pdfURL && (
              <iframe
                src={pdfURL}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreview; 