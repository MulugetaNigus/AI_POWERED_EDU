import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ImageUploadProps {
    onAnalysisComplete: (analysis: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export default function ImageUpload({
    onAnalysisComplete,
    isLoading,
    setIsLoading,
}: ImageUploadProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const genAI = new GoogleGenerativeAI(
        'AIzaSyD12anmuJiH9DAIXgj06Vf_v9t4VrlH4C4' || ''
    );

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleImageFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleImageFile(e.target.files[0]);
        }
    };

    const handleImageFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target?.result) {
                setSelectedImage(e.target.result as string);
                await analyzeImage(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async (file: File) => {
        try {
            setIsLoading(true);

            // Convert the image to base64
            const base64Image = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            // Remove the data URL prefix
            const imageData = base64Image.split(',')[1];

            // Initialize the model
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Analyze the image with specific prompts
            const prompts = [
                'Please analyze this image and provide:',
                '1. A detailed description of what you see',
                '2. Any text or writing visible in the image',
                '3. Key objects and their relationships',
                '4. The overall context or setting',
                '5. Any notable patterns or unique features',
            ].join('\n');

            const result = await model.generateContent([
                prompts,
                {
                    inlineData: {
                        data: imageData,
                        mimeType: file.type,
                    },
                },
            ]);

            const response = await result.response;
            const analysis = response.text();
            onAnalysisComplete(analysis);
        } catch (error) {
            console.error('Error analyzing image:', error);
            if (error instanceof Error) {
                onAnalysisComplete(
                    `Sorry, I couldn't analyze this image: ${error.message}`
                );
            } else {
                onAnalysisComplete(
                    "Sorry, I couldn't analyze this image. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
    };

    return (
        <div className="w-full">
            {!selectedImage ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 ${dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Analyzing image...
                                </p>
                            </div>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Drag and drop an image, or click to select
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-gray-900/50 rounded-full hover:bg-gray-900/75 transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
}
