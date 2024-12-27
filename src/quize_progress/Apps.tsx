import React, { useState, useEffect } from 'react';
import { Sun, Moon, Loader2, CreditCard } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Quiz from './components/Quiz';
import ProgressTracker from './components/ProgressTracker';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react'

function AppContent() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 8');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [activeTab, setActiveTab] = useState<'learn' | 'progress'>('learn');
  const { theme, toggleTheme } = useTheme();
  const [creditBalance, setCreditBalance] = useState<number | null | string>();
  const [userEmail, setuserEmail] = useState<string | undefined>("");
  const creditVisibility: boolean = true;

  // to get clerk info
  const { user } = useUser();

  // get current user and get the current user credit based on the current user email
  useEffect(() => {
    const email = user?.emailAddresses[0]?.emailAddress; // Safely access email
    setuserEmail(email);

    if (email) {
      handleGetCredit(email);
    }
  }, [user]); // Run effect whenever the user object changes

  const handleGetCredit = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:8888/api/v1/onboard?email=${email}`);
      const userData = response.data;
      const currentUserData = userData.find((user: { email: string; }) => user.email === email);
      setCreditBalance(currentUserData ? currentUserData.credit : 0);
    } catch (err) {
      console.log(err);
    }
  };

  // get the current user current credit
  // const handleGetCredit = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:8888/api/v1/onboard?email=${userEmail}`);
  //     const userData = response.data;
  //     // Filter the user data to find the current user's credit
  //     const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);
  //     if (currentUserData) {
  //       setCreditBalance(currentUserData.credit || 0);
  //     } else {
  //       setCreditBalance(0);
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <button
          onClick={() => document.body.classList.toggle('sidebar-open')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>

      <div
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden sidebar-overlay hidden"
        onClick={() => document.body.classList.remove('sidebar-open')}
      ></div>

      <div className="fixed md:static w-64 h-full transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out sidebar">
        <Sidebar
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          onGradeSelect={setSelectedGrade}
          onSubjectSelect={setSelectedSubject}
        />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTab === 'learn'
                  ? `${selectedSubject} - ${selectedGrade}`
                  : 'Progress Tracking'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'learn'
                  ? 'Interactive learning session with AI assistance'
                  : 'Track your learning progress'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'learn'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'progress'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Progress
                </button>
              </div>
              <p className='text-gray-500 text-lg'>|</p>
              {creditVisibility &&
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                  Credits: {creditBalance ? creditBalance : <Loader2 className='w-4 h-4 animate-spin' />}
                </div>
              }
              <button
                onClick={toggleTheme}
                className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            </div>
          </header>

          {activeTab === 'learn' ? (
            <div className="p-6 space-y-6">
              {/* <Chat /> */}
              <Quiz subject={selectedSubject} grade={selectedGrade} />
            </div>
          ) : (
            <ProgressTracker />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
