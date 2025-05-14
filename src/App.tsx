import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoute2 from './components/ProtectedRoute2';
import Apps from './quize_progress/Apps';
import OnboardingFlow from './onboarding/OnboardingFlow';
import axios from 'axios';
import Subscription from './components/Subscription';
import PaymentCallback from './pages/PaymentCallback';
import SignUpPage from './auth/SignUp';
import SignInPage from './auth/SignIn';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import { useUser } from '@clerk/clerk-react';
import PageNotFound from './components/PageNotFound';
import ExamApp from './Exam/ExamApp';
import CommunityPage from './Community/CommunityPage';
import MyPost from './Community/MyPost/MyPost';
import img1 from './Assets/girl1.webp';
import MyGroup from './Community/MyGroup/MyGroup';
import Chat from './Community/Chat/Chat';
import Resources from './Community/Resources/Resources';
import LiveSessions from './Community/LiveSessions/LiveSessions';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { motion } from 'framer-motion';
import { TourEvent, TourActiveEvent } from './components/Header';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const { isSignedIn, user } = useUser();
    const [displayOnBoarding, setDisplayOnBoarding] = useState<boolean>(false);
    const [runTour, setRunTour] = useState(false);
    
    // Notify header when tour state changes
    useEffect(() => {
        // Create and dispatch custom event with tour state
        const tourStateEvent = new CustomEvent('tour-state-change', {
            detail: { isActive: runTour }
        });
        TourActiveEvent.dispatchEvent(tourStateEvent);
    }, [runTour]);
    
    // Listen for tour events to toggle tour on/off
    useEffect(() => {
        const handleTourEvent = () => {
            setRunTour(prevState => !prevState);
        };
        
        TourEvent.addEventListener('start-tour', handleTourEvent);
        
        return () => {
            TourEvent.removeEventListener('start-tour', handleTourEvent);
        };
    }, []);

    // Tour steps defining the site tour
    const tourSteps = [
        {
            target: '.home-link',
            content: 'Welcome to ExtreamX Education Platform! Let me show you around the site.',
            disableBeacon: true,
            placement: 'center' as const
        },
        {
            target: '.flex.items-center.space-x-2.group.cursor-pointer',
            content: 'Click here anytime to return to the homepage.',
            placement: 'bottom' as const
        },
        {
            target: '.hidden.md\\:flex.items-center.space-x-8 > div:nth-child(1)',
            content: 'Access practice exams and assessments here.',
            placement: 'bottom' as const
        },
        {
            target: '.hidden.md\\:flex.items-center.space-x-8 > div:nth-child(2)',
            content: 'Connect with other students and join study groups.',
            placement: 'bottom' as const
        },
        {
            target: '.hidden.md\\:flex.items-center.space-x-8 > div:nth-child(3)',
            content: 'Find learning materials and helpful resources.',
            placement: 'bottom' as const
        },
        {
            target: '.hidden.md\\:flex.items-center.space-x-8 > button',
            content: 'Access AI-powered learning assistance tailored to your needs.',
            placement: 'bottom' as const
        },
        {
            target: '.user-profile',
            content: 'Manage your profile and account settings here.',
            placement: 'bottom-end' as const
        },
        {
            target: 'button[title="Take site tour"]',
            content: 'Click this button anytime to restart this tour.',
            placement: 'bottom' as const
        },
        {
            target: '.ChatBot',
            content: 'Need help? Our AI assistant is here to answer your questions anytime.',
            placement: 'top' as const
        }
    ];

    useEffect(() => {
        const fetchOnboardingData = async () => {
            if (isSignedIn && user) {
                try {
                    const response = await axios.get("https://extreamx-backend.onrender.com/api/v1/onboard");
                    const onboardingData = response.data;
                    const userEmail = user.emailAddresses[0]?.emailAddress;

                    const userOnboardingData = onboardingData.find((item: any) => item.email === userEmail);

                    if (!userOnboardingData) {
                        setDisplayOnBoarding(true);
                    } else {
                        setDisplayOnBoarding(false);
                        // Store user data in localStorage with grade level
                        const userData = {
                            user_grade_level: userOnboardingData.grade,
                            // Add any other user data you want to store
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error("Error fetching onboarding data:", error);
                }
            }
        };

        fetchOnboardingData();
    }, [isSignedIn, user]);

    // Handle tour callbacks
    const handleTourCallback = (data: CallBackProps) => {
        const { status } = data;
        
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRunTour(false);
        }
    };

    return (
        <BrowserRouter>
            <ThemeProvider>
                <Joyride
                    steps={tourSteps}
                    run={runTour}
                    continuous={true}
                    showSkipButton={true}
                    showProgress={true}
                    styles={{
                        options: {
                            primaryColor: '#4338ca',
                            zIndex: 10000,
                        },
                        tooltip: {
                            borderRadius: '8px',
                            fontSize: '16px',
                        },
                        buttonNext: {
                            backgroundColor: '#4338ca',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                        },
                        buttonBack: {
                            color: '#4338ca',
                            fontSize: '14px',
                            marginRight: '10px',
                        },
                        buttonSkip: {
                            color: '#6b7280',
                            fontSize: '14px',
                        }
                    }}
                    callback={handleTourCallback}
                    locale={{
                        last: 'Finish',
                        skip: 'Skip tour'
                    }}
                />
                <div className="home-link min-h-screen relative bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-200">
                    {/* Background Decorations */}
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-100/30 dark:bg-yellow-900/10 rounded-full blur-3xl" />
                        
                        {/* Animated particles */}
                        <motion.div 
                            className="absolute top-20 left-1/4 w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full"
                            animate={{ 
                                y: [0, -30, 0],
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"
                            animate={{ 
                                y: [0, -20, 0],
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                        <motion.div 
                            className="absolute bottom-40 right-1/4 w-4 h-4 bg-purple-400 dark:bg-purple-500 rounded-full"
                            animate={{ 
                                y: [0, -25, 0],
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        />
                    </div>
                    
                    <div className="relative z-10">
                        <Routes>
                            <Route path="/" element={displayOnBoarding ? <OnboardingFlow /> : <Home />} />
                            <Route path="/signin/*" element={<SignInPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                            {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
                            <Route path="/quize-and-progress" element={<ProtectedRoute2><Apps /></ProtectedRoute2>} />
                            <Route path="/on-boarding" element={<OnboardingFlow />} />
                            <Route path="/dashboard" element={<ProtectedRoute2><Dashboard /></ProtectedRoute2>} />
                            <Route path="/subscription" element={<Subscription />} />
                            <Route path="/payment-callback" element={<PaymentCallback />} />
                            <Route path="/exam" element={<ProtectedRoute2><ExamApp /></ProtectedRoute2>} />
                            <Route path="/community" element={<ProtectedRoute2><CommunityPage /></ProtectedRoute2>} />
                            <Route path="/community/myPost" element={<ProtectedRoute2><MyPost profilePicture={img1} name="Sample User" email="sample@example.com" /></ProtectedRoute2>} />
                            <Route path="/community/myGroup" element={<MyGroup />} />
                            <Route path="/search-groups" element={<ProtectedRoute2><MyGroup /></ProtectedRoute2>} />
                            <Route path="/search-groups/chat" element={<ProtectedRoute2><Chat /></ProtectedRoute2>} />
                            <Route path="/resources" element={<ProtectedRoute2><Resources /></ProtectedRoute2>} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/live-sessions" element={<ProtectedRoute2><LiveSessions /></ProtectedRoute2>} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </div>
                </div>
                {/* Global Toast Container */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;