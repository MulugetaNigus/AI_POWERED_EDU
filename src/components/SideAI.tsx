import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import MarkdownDisplay from './MarkdownDisplay';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SideAI: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI assistant. How can I help you today?", isAI: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize the text-generation-model
    const genAI = new GoogleGenerativeAI("AIzaSyD12anmuJiH9DAIXgj06Vf_v9t4VrlH4C4");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const handleTextGeneration = async (input: string) => {
        const prompt = input;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages([...messages, { text: input, isAI: false }]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await handleTextGeneration(input);
                setMessages(prev => [
                    ...prev,
                    { text: response, isAI: true }
                ]);
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages(prev => [
                    ...prev,
                    { text: "Sorry, there was an error processing your request.", isAI: true }
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="fixed right-0 top-10 rounded-md w-90 h-[calc(100vh-50px)] bg-white shadow-md p-4 overflow-hidden">
            <div className="h-full flex flex-col">
                <button 
                    onClick={onClose} 
                    className="mb-2 text-blue-600 hover:underline">Close
                </button>
                <div className="overflow-y-auto flex-1">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-2 rounded ${msg.isAI ? 'bg-gray-100 text-blue-800' : 'bg-blue-600 text-white'}`}>
                                <MarkdownDisplay markdownText={msg.text} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] p-2 rounded bg-gray-100">
                                <Loader2 className="animate-spin text-blue-500" />
                                <span className='dark:text-gray-700 ml-2'> AI is thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSend} className="mt-2 flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded text-blue-900"
                    />
                    <button 
                        type="submit" 
                        className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                        <Send />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SideAI;
