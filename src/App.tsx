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
import Joyride, { CallBackProps } from 'react-joyride';
import { motion } from 'framer-motion';

function App() {
    const { isSignedIn, user } = useUser();
    const [displayOnBoarding, setDisplayOnBoarding] = useState<boolean>(false);
    const [runTour, setRunTour] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchOnboardingData = async () => {
            if (isSignedIn && user) {
                try {
                    const response = await axios.get("http://localhost:8888/api/v1/onboard");
                    const onboardingData = response.data;
                    const userEmail = user.emailAddresses[0]?.emailAddress;

                    const userOnboardingData = onboardingData.find((item: any) => item.email === userEmail);

                    if (!userOnboardingData) {
                        setDisplayOnBoarding(true);
                        // navigate('/on-boarding');
                    } else {
                        setDisplayOnBoarding(false);
                        // Store user data in localStorage with grade level
                        const userData = {
                            user_grade_level: userOnboardingData.grade,
                            // Add any other user data you want to store
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                        // navigate('/');
                    }
                } catch (error) {
                    console.error("Error fetching onboarding data:", error);
                }
            }
        };

        fetchOnboardingData();
    }, [isSignedIn, user]);

    return (
        <BrowserRouter>
            <ThemeProvider>
                <Joyride
                    steps={[]} // Add your steps here
                    run={runTour}
                    continuous={true}
                    showSkipButton={true}
                    showProgress={true}
                    styles={{
                        options: {
                            primaryColor: '#4338ca',
                            zIndex: 10000,
                        },
                    }}
                    callback={() => {}} // Add your callback here
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
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;