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
    return { __html: marked(text) }; // Use dangerouslySetInnerHTML to render HTML
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={getMarkdownText(markdownText)} />
    </div>
  );
};

export default MarkdownDisplay;