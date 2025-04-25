import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, Menu, X, LogOut, Loader2, CreditCard, BookOpenCheck, Users, Trophy, Link2, Sparkles, HelpCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
// import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import axios from 'axios';
import { Button } from '@headlessui/react';
import { useUser, UserButton } from "@clerk/clerk-react";
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
        const response = await axios.get(`http://localhost:8888/api/v1/onboard?email=${userEmail}`);
        const userData = response.data;
        const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);
        // const currentUserPlan = userData.plan;
        setcurrentUserPlan(currentUserData.plan)
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

  // Navigation links
  const navLinks = [
    { name: 'Exam', path: '/exam', icon: BookOpenCheck },
    { name: 'Community', path: currentUserPlan === "free" ? 'subscription' : '/community', icon: Users },
    { name: 'Resources', path: currentUserPlan === "free" ? 'subscription' : '/resources', icon: Link2 },
  ];

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
              <Link
                // onClick={currentUserPlan === "free" ? alert("you can't access this section while you are free version") : link.path}
                key={link.name}
                to={link.path}
                className={`flex items-center font-medium transition-colors duration-200 ${isActive(link.path)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.name}
                {link.name.charAt(0) !== "E" && <sup className='bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 mb-2 font-bold text-white text-[10px] rounded-full p-2'>Pro</sup>}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 h-1 w-full bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
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
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-2 rounded-lg ${isActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                    {link.name.charAt(0) !== "E" && <sup className='bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 mb-2 font-bold text-white text-[10px] rounded-full p-2'>Pro</sup>}
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
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}