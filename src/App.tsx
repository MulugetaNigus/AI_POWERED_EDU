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
                <div className="home-link min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Routes>
                        <Route path="/" element={displayOnBoarding ? <OnboardingFlow /> : <Home />} />
                        <Route path="/signin/*" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/quize-and-progress" element={<ProtectedRoute2><Apps /></ProtectedRoute2>} />
                        <Route path="/on-boarding" element={<OnboardingFlow />} />
                        <Route path="/dashboard" element={<ProtectedRoute2><Dashboard /></ProtectedRoute2>} />
                        <Route path="/subscription" element={<ProtectedRoute2><Subscription /></ProtectedRoute2>} />
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
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;