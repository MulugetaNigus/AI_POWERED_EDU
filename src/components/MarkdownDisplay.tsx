import React from 'react';
import { marked } from 'marked';

// Define the props type
interface MarkdownDisplayProps {
  markdownText: string; // Type for markdownText prop
}

// Example usage in a React component
const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ markdownText }) => {
  // Convert Markdown to HTML
  const getMarkdownText = (text: string) => {
    // Handle undefined or null input by providing a default empty string
    const safeText = text || '';
    return { __html: marked(safeText) }; // Use dangerouslySetInnerHTML to render HTML
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={getMarkdownText(markdownText)} />
    </div>
  );
};

export default MarkdownDisplay;