import React, { useState } from 'react';
import { FileText, X, Upload, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PDFPreviewProps {
  onClose: () => void;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  pdfURL: string | null;
  onSendSelectedText?: (text: string, action: string) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  onClose,
  onFileSelect,
  selectedFile,
  pdfURL,
  onSendSelectedText
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
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

      {selectedFile && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Zoom: {zoomLevel}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              title="Zoom out"
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              title="Reset zoom"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              title="Zoom in"
              disabled={zoomLevel >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
              <div style={{ height: '100%', overflow: 'auto' }}>
                <iframe
                  src={pdfURL}
                  className="w-full border-0"
                  title="PDF Preview"
                  style={{ 
                    height: '100%', 
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top left',
                    width: `${100 * (100 / zoomLevel)}%`
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreview;