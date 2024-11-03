import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader2, AlertCircle } from 'lucide-react';
import { analyzePDFContent } from './lib/gemini';
import { useProgressStore } from './store/progressStore';

export default function PDFUploader() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { updateQuestions, updateTopics, updateImprovementAreas } = useProgressStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const analysis = await analyzePDFContent(text);
          
          if (!analysis.questions || !analysis.topics || !analysis.improvementAreas) {
            throw new Error('Incomplete analysis results');
          }
          
          updateQuestions(analysis.questions);
          updateTopics(analysis.topics);
          updateImprovementAreas(analysis.improvementAreas);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to process the PDF';
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read the PDF file');
        setIsLoading(false);
      };

      reader.readAsText(file);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process the PDF. Please try again.');
      setIsLoading(false);
    }
  }, [updateQuestions, updateTopics, updateImprovementAreas]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Upload Learning Materials
      </h3>
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">
                Analyzing PDF and generating questions...
              </p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="w-10 h-10 text-blue-500" />
              ) : (
                <FileText className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {isDragActive
                    ? 'Drop the PDF file here'
                    : 'Drag & drop a PDF file here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload your study material to generate personalized questions
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}