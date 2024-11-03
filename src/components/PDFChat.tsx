import React, { useState } from 'react';
import { FileText, Loader2, Send, X, SendIcon } from 'lucide-react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";


interface PDFChatProps {
    onClose: () => void;
    onMessageSent: (message: { text: string; isAI: boolean }) => void;
}

export default function PDFChat({ onClose, onMessageSent }: PDFChatProps) {
    const [pdfContent, setPdfContent] = useState<string>('');
    const [question, setQuestion] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [input, setInput] = useState('');
    const [reinput, setReinput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showIcons, setShowIcons] = useState(false);


    // Initialize GoogleGenerativeAI with your API_KEY.
    const genAI = new GoogleGenerativeAI("sk_39c3dcc0856cd8a692a7174a49376cfeb41b5b9dea2b2124");
    // Initialize GoogleAIFileManager with your API_KEY.
    const fileManager = new GoogleAIFileManager("sk_39c3dcc0856cd8a692a7174a49376cfeb41b5b9dea2b2124");

    const model = genAI.getGenerativeModel({
        // Choose a Gemini model.
        model: "gemini-1.5-flash",
    });


    const ProcessFile = async (file_name: string, prompt: string) => {
        // Upload the file and specify a display name.
        const uploadResponse = await fileManager.uploadFile(file_name, {
            mimeType: "application/pdf",
            displayName: `${file_name} PDF`,
        });

        // View the response.
        console.log(
            `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
        );

        // Generate content using text and the URI reference for the uploaded file.
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: prompt },
        ]);

        // Output the generated text to the console
        console.log(result.response.text());
    }

    // get the file path from the users file
    const handleGetFile = (e: any) => {
        setSelectedFile(e.target.files[0].name)
    }

    const handleChat = async (selectedFile: string) => {
        if (selectedFile) {
            ProcessFile(selectedFile, question);
        } else {
            console.log("error occured !");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 py-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">

                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat with PDF</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4">
                    {!selectedFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileText className="w-10 h-10 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
                            </div>
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => handleGetFile(e)}
                            />
                        </label>
                    ) : (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <FileText className="h-5 w-5" />
                            <span>{selectedFile}</span>
                        </div>
                    )}
                </div>
                {/* lets chat btn */}
                <button
                    className='ml-3 mt-2 border-1 border-blue-700 bg-blue-700 hover:bg-blue-900 hover:text-gray-200 flex items-center justify-center px-5 rounded m-2 p-2 transition easy-out duration-225 text-gray-200 text-lg font-bold'>
                    Process It <SendIcon className='ml-2 w-5 h-8' />
                    {/* <Loader2 className="h-6 w-8 animate-spin" /> */}
                </button>
            </div>
        </div>
    );
}