import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, Sparkles, ArrowRight, Lock, Crown } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { SubscriptionPlan, hasFeatureAccess } from '../utils/subscriptionUtils';

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
    const [analysisStage, setAnalysisStage] = useState<'upload' | 'ready' | 'analyzing'>('upload');
    const [analyzeProgress, setAnalyzeProgress] = useState(0);
    const [userCurrentPlan, setUserCurrentPlan] = useState<string>('free');
    const [userID, setUserID] = useState<string>('');

    const { isSignedIn, user } = useUser();

    // Convert userCurrentPlan to the correct type for feature checks
    const userPlanType = userCurrentPlan as SubscriptionPlan;

    // Check feature access
    const canAccessBasicImageAnalysis = hasFeatureAccess(userPlanType, 'basic-image-analysis');
    const canAccessEnhancedImageAnalysis = hasFeatureAccess(userPlanType, 'enhanced-image-analysis');
    const canAccessAdvancedImageAnalysis = hasFeatureAccess(userPlanType, 'advanced-image-analysis');

    useEffect(() => {
        console.log("Image Upload - Current plan:", userCurrentPlan);
        console.log("Image Upload - Access checks:", {
            basic: canAccessBasicImageAnalysis,
            enhanced: canAccessEnhancedImageAnalysis,
            advanced: canAccessAdvancedImageAnalysis
        });
    }, [userCurrentPlan, canAccessBasicImageAnalysis, canAccessEnhancedImageAnalysis, canAccessAdvancedImageAnalysis]);

    useEffect(() => {
        // Fetch user's current plan
        const fetchUserPlan = async () => {
            if (isSignedIn && user) {
                try {
                    const userEmail = user.emailAddresses[0]?.emailAddress;
                    const response = await axios.get(`https://extreamx-backend.onrender.com/api/v1/onboard?email=${userEmail}`);
                    const userData = response.data;
                    const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);

                    if (currentUserData && currentUserData.plan) {
                        // Convert plan name to lowercase to match the expected format in subscriptionUtils
                        const planName = currentUserData.plan.toLowerCase();
                        setUserCurrentPlan(planName);
                        setUserID(currentUserData._id || '');
                        console.log("Image Upload - User plan:", planName);
                    }
                } catch (error) {
                    console.error("Error fetching user plan:", error);
                }
            }
        };

        fetchUserPlan();
    }, [isSignedIn, user]);

    const genAI = new GoogleGenerativeAI(
        'AIzaSyD12anmuJiH9DAIXgj06Vf_v9t4VrlH4C4'
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
                setAnalysisStage('ready');
            }
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        // Extract the file type from the data URL
        const mimeType = selectedImage.split(';')[0].split(':')[1];

        try {
            setIsLoading(true);
            setAnalysisStage('analyzing');
            setAnalyzeProgress(0);

            // Start progress animation
            const progressInterval = setInterval(() => {
                setAnalyzeProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + (95 - prev) * 0.1;
                });
            }, 300);

            // Remove the data URL prefix
            const imageData = selectedImage.split(',')[1];

            // Initialize the model
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Analyze the image with specific prompts based on subscription tier
            let prompts = [];

            // Determine credit cost based on tier
            let creditCost = 0;

            if (canAccessAdvancedImageAnalysis) {
                // Premium tier - comprehensive analysis (higher cost)
                creditCost = 150;
                prompts = [
                    'Please provide a comprehensive analysis of this image with:',
                    '1. A detailed description of everything visible in the image',
                    '2. Complete transcription of any text or writing visible',
                    '3. Detailed analysis of all objects and their relationships',
                    '4. In-depth explanation of the context, setting, and background',
                    '5. Analysis of any patterns, symbols, or unique features',
                    '6. Educational insights and connections to relevant topics',
                    '7. Potential applications or relevance to learning'
                ];
            } else if (canAccessEnhancedImageAnalysis) {
                // Standard tier - enhanced analysis (medium cost)
                creditCost = 100;
                prompts = [
                    'Please analyze this image and provide:',
                    '1. A detailed description of what you see',
                    '2. Any text or writing visible in the image',
                    '3. Key objects and their relationships',
                    '4. The overall context or setting'
                ];
            } else {
                // Free tier - basic analysis (lowest cost)
                creditCost = 50;
                prompts = [
                    'Please provide a basic description of this image:',
                    '1. What is the main subject of the image',
                    '2. Any obvious text visible',
                    '3. A brief overview of what this image shows'
                ];
            }

            const result = await model.generateContent([
                prompts.join('\n'),
                {
                    inlineData: {
                        data: imageData,
                        mimeType: mimeType,
                    },
                },
            ]);

            // Complete the progress bar
            clearInterval(progressInterval);
            setAnalyzeProgress(100);

            const response = await result.response;
            const analysis = response.text();

            // Add subscription tier indicator to the analysis
            let finalAnalysis = analysis;

            if (!canAccessAdvancedImageAnalysis) {
                finalAnalysis += '\n\n';
                finalAnalysis += canAccessEnhancedImageAnalysis
                    ? '[Standard Plan Analysis - Upgrade to Premium for comprehensive analysis]'
                    : '[Basic Plan Analysis - Upgrade to Standard or Premium for enhanced analysis]';
            }

            // Deduct credits for successful image analysis
            if (userID) {
                try {
                    const response = await axios.put(
                        `https://extreamx-backend.onrender.com/api/v1/onboard/credit/${userID}`,
                        { tokensUsed: creditCost }
                    );
                    console.log("Image analysis credits deducted:", creditCost);
                    console.log("Remaining credits:", response.data.remainingCredits);
                } catch (error) {
                    console.error("Error updating credits after image analysis:", error);
                }
            }

            onAnalysisComplete(finalAnalysis);
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
            setAnalysisStage('upload');
            setAnalyzeProgress(0);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setAnalysisStage('upload');
        setAnalyzeProgress(0);
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
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    {userCurrentPlan === 'premium' ? (
                                        <div className="flex items-center">
                                            <Crown className="w-3 h-3 text-amber-500 mr-1" />
                                            <span>Premium image analysis available</span>
                                        </div>
                                    ) : userCurrentPlan === 'standard' ? (
                                        <div className="flex items-center">
                                            <span>Enhanced image analysis available</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Lock className="w-3 h-3 text-gray-400 mr-1" />
                                            <span>Basic image analysis only</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
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

                        {/* Subscription tier indicator */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-gray-900/50 text-white text-xs">
                            {userCurrentPlan === 'premium' ? (
                                <div className="flex items-center">
                                    <Crown className="w-3 h-3 text-amber-300 mr-1" />
                                    <span>Premium</span>
                                </div>
                            ) : userCurrentPlan === 'standard' ? (
                                <div className="flex items-center">
                                    <span>Standard</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span>Basic</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {analysisStage === 'ready' && (
                        <motion.button
                            onClick={analyzeImage}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Sparkles className="h-5 w-5" />
                            <span>Analyze Image</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </motion.button>
                    )}

                    {analysisStage === 'analyzing' && (
                        <div className="space-y-3">
                            <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs font-semibold inline-block text-blue-600">
                                        Analyzing Image
                                    </div>
                                    <div className="text-xs font-semibold inline-block text-blue-600">
                                        {Math.round(analyzeProgress)}%
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200 dark:bg-blue-900/30">
                                    <motion.div
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
                                        animate={{ width: `${analyzeProgress}%` }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-3 py-2">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Sparkles className="h-6 w-6 text-blue-500" />
                                </motion.div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    AI is analyzing your image...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
