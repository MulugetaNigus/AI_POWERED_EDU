import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, Menu, X, LogOut, Loader2, CreditCard, BookOpenCheck, Users, Trophy, Link2, Sparkles, HelpCircle, Crown, Lock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
// import { signOut } from 'firebase/auth';
import { UserButton, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { SubscriptionPlan, hasFeatureAccess } from '../utils/subscriptionUtils';
import { Button } from '@headlessui/react';
import { useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add TourContext event to allow triggering tour from header
export const TourEvent = new EventTarget();
export const TourActiveEvent = new EventTarget();

export default function Header({ creditVisibility, RerenderToUpdateCredit }: boolean | any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [currentUserPlan, setcurrentUserPlan] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [showProTooltip, setShowProTooltip] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | undefined>("");

  const { isSignedIn, user, signOut } = useUser();
  const clerk = useClerk();

  // Listen for tour active state
  useEffect(() => {
    const handleTourActiveChange = (e: CustomEvent) => {
      setIsTourActive(e.detail.isActive);
    };

    const handleTourEvent = () => {
      setIsTourActive(prevState => !prevState);
    };

    TourEvent.addEventListener('start-tour', handleTourEvent);
    TourActiveEvent.addEventListener('tour-state-change', handleTourActiveChange as EventListener);

    return () => {
      TourEvent.removeEventListener('start-tour', handleTourEvent);
      TourActiveEvent.removeEventListener('tour-state-change', handleTourActiveChange as EventListener);
    };
  }, []);

  // Check if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUserEmail(user?.emailAddresses[0].emailAddress);
  }, [user]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!userEmail) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`https://extreamx-backend.onrender.com/api/v1/onboard?email=${userEmail}`);
        const userData = response.data;
        const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);
        
        // Convert plan name to lowercase to match the expected format in subscriptionUtils
        const planName = currentUserData?.plan?.toLowerCase() || 'free';
        setcurrentUserPlan(planName);
        console.log("Header - User plan:", planName);
        
        if (currentUserData) {
          setCreditBalance(currentUserData.credit);
        } else {
          setCreditBalance(0);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCreditBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [userEmail, RerenderToUpdateCredit]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Convert currentUserPlan to the correct type for feature checks
  const userPlanType = (currentUserPlan || 'free') as SubscriptionPlan;
  
  // Determine if a user has access to specific features
  const hasProAccess = currentUserPlan !== "free";
  const hasCommunityAccess = hasFeatureAccess(userPlanType, 'community');
  const hasResourcesAccess = hasFeatureAccess(userPlanType, 'educational-resources');

  // Navigation links with pro feature flags
  const navLinks = [
    { name: 'Exam', path: '/exam', icon: BookOpenCheck, requiresPro: false },
    { name: 'Community', path: hasCommunityAccess ? '/community' : '/subscription', icon: Users, requiresPro: true },
    { name: 'Resources', path: hasResourcesAccess ? '/resources' : '/subscription', icon: Link2, requiresPro: true },
  ];

  // Check if a link requires a paid plan
  const handleProFeatureClick = (e: React.MouseEvent, link: any) => {
    if (link.requiresPro && currentUserPlan === "free") {
      e.preventDefault();
      navigate('/subscription');
    }
  };

  // Function to trigger site tour
  const triggerSiteTour = () => {
    // Dispatch custom event for App.tsx to listen to
    const tourEvent = new CustomEvent('start-tour');
    TourEvent.dispatchEvent(tourEvent);
  };

  // Handler for AI Assistance button
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Handler for mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for logo click
  const goToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div onClick={goToHome} className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-md group-hover:bg-blue-500/30 dark:group-hover:bg-blue-500/40 transition-all duration-300"></div>
              <BookOpen className="relative h-8 w-8 text-blue-600 dark:text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Extream<span className="text-blue-600 dark:text-blue-400">X</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                <Link
                  to={link.path}
                  onClick={(e) => handleProFeatureClick(e, link)}
                  onMouseEnter={() => link.requiresPro && currentUserPlan === "free" ? setShowProTooltip(link.name) : null}
                  onMouseLeave={() => setShowProTooltip(null)}
                  className={`flex items-center font-medium transition-colors duration-200 ${isActive(link.path)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  <link.icon className="w-5 h-5 mr-2" />
                  <span className="relative">
                    {link.name}
                    {link.requiresPro && (
                      <>
                        {currentUserPlan === "free" ? (
                          <span className="absolute -right-5 -top-1">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                        ) : (
                          <span className="absolute -right-6 -top-2.5">
                            <Crown className="w-4 h-4 text-amber-500" />
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </Link>
                
                {/* Pro feature tooltip */}
                {showProTooltip === link.name && link.requiresPro && currentUserPlan === "free" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-50 w-64 p-3 mt-2 -left-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                        <Crown className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Pro Feature</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Upgrade to Pro to unlock {link.name} and other premium features.
                        </p>
                        <button 
                          onClick={() => navigate('/subscription')}
                          className="mt-2 text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    </div>
                    <div className="absolute -top-2 left-12 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 transform rotate-45"></div>
                  </motion.div>
                )}
              </div>
            ))}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
            <button
              onClick={goToDashboard}
              className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistance
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Right side - User controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isSignedIn && (
              <button
                onClick={triggerSiteTour}
                className={`flex items-center justify-center p-2 transition-colors duration-300 rounded-full ${isTourActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800'
                  }`}
                aria-label={isTourActive ? "Stop site tour" : "Take site tour"}
                title={isTourActive ? "Stop site tour" : "Take site tour"}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}

            {isSignedIn ? (
              <>
                {creditVisibility && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                  >
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">Credits:</span>
                    {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : creditBalance}
                  </motion.div>
                )}

                {/* Plan badge */}
                <div className="hidden sm:flex items-center mr-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${currentUserPlan === "free" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" 
                    : currentUserPlan === "standard" 
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200" 
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"}`}>
                    {currentUserPlan === "free" ? null : <Crown className="w-3 h-3 mr-1" />}
                    {currentUserPlan === "free" ? "Free" : currentUserPlan === "standard" ? "Standard" : "Premium"}
                  </div>
                </div>

                <div className='user-profile'>
                  <UserButton afterSignOutUrl="/signin" />
                </div>
              </>
            ) : (
              <Link
                to="/signin"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={(e) => {
                      handleProFeatureClick(e, link);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center p-2 rounded-lg ${isActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    <span className="flex-1">{link.name}</span>
                    {link.requiresPro && (
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full flex items-center ${currentUserPlan === "free" 
                        ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                        : currentUserPlan === "standard" 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'}`}
                      >
                        {currentUserPlan === "free" ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Pro
                          </>
                        ) : (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </>
                        )}
                      </span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    goToDashboard();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  AI Assistance
                </button>
                
                {/* Mobile plan badge */}
                {isSignedIn && currentUserPlan && (
                  <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Plan:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentUserPlan === "free" 
                        ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                        : currentUserPlan === "standard" 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'}`}
                      >
                        {currentUserPlan === "free" ? "Free Plan" : currentUserPlan === "standard" ? "Standard Plan" : "Premium Plan"}
                      </span>
                    </div>
                    {currentUserPlan === "free" && (
                      <button 
                        onClick={() => {
                          navigate('/subscription');
                          setIsMenuOpen(false);
                        }}
                        className="mt-3 w-full py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}