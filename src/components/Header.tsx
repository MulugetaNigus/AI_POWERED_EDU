import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Menu, X, LogOut, Loader2, CreditCard, BookOpenCheck, Users, Trophy, Link2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
// import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import axios from 'axios';
import { Button } from '@headlessui/react';
import { useUser, UserButton } from "@clerk/clerk-react";
import { useClerk } from '@clerk/clerk-react';

export default function Header({ creditVisibility, RerenderToUpdateCredit }: boolean | any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | undefined>("");

  const { isSignedIn, user, signOut } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    // setUserEmail(user.email);
    setUserEmail(user?.emailAddresses[0].emailAddress);
  }, []);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!userEmail) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8888/api/v1/onboard?email=${userEmail}`);
        const userData = response.data;
        // Filter the user data to find the current user's credit
        const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);
        console.log("user credit info: ", response);
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

  // handle sing out
  const handleLogOuts = async () => {
    const user_confirmation = window.confirm("are you shure you want to logout?")
    if (user_confirmation) {
      try {
        signOut(auth).then(async () => {
          localStorage.setItem("user_info", "{}");
          localStorage.removeItem('token');
          navigate("/signin");
        }).catch((error) => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      null
    }
  }

  return (
    <header className="fixed top-0 w-full m-2 rounded-md bg-white/0 dark:bg-gray-900/0 backdrop-blur-md shadow-sm z-50">
      <nav className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">ExtreamX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Home</Link> */}
            {/* <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Features</a> */}
            {/* <a href="#subjects" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Subjects</a> */}
            {/* <span className='text-xl text-gray-400'>{" | "}</span> */}
            <Link to="/exam" className="exam flex font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">
              <span className='w-5 h-2 mr-3'>
                <BookOpenCheck />
              </span>
              Exam
            </Link>
            <Link to="/community" className="community-link flex font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">
              <span className='w-5 h-2 mr-3'>
                <Users />
              </span>
              Community
            </Link>
            {/* <Link to="#subjects" className="flex font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">
              <span className='w-5 h-2 mr-3'>
                <Trophy />
              </span>
              Prizes
            </Link> */}
            <Link to="/resources" className="resources flex font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">
              <span className='w-5 h-2 mr-3'>
                <Link2 />
              </span>
              Resources
            </Link>
            <span className='text-xl text-gray-400'>{" | "}</span>
            {/* <Button style={{ backgroundColor: "rgb(67, 179,141)" }} className="px-3 py-2 rounded-md"> */}
            <Link to="/dashboard" className="dashboard-link font-bold text-gray-600  dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-100 transition easy-in-out duration-125">
              ✨ AI Assistance
            </Link>
            {/* </Button> */}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className='light-dark'>
              <ThemeToggle />
            </div>
            {
              isSignedIn ? (
                <>
                  {creditVisibility && (
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                      Credits: {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : creditBalance}
                    </div>
                  )}

                  {/* <p style={{ backgroundColor: "rgb(67, 179,141)" }} onClick={() => handleLogOut()} className="flex cursor-pointer items-center px-4 py-2 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                    <LogOut className="h-4 w-4 mr-2" />
                    SignOut
                  </p> */}

                  <div className='user-profile'>
                    <button onClick={handleLogout}>
                      <div>
                        {/* Show the Clerk user icon/avatar */}
                        <UserButton />
                      </div>
                    </button>
                  </div>

                </>
              ) : (
                <>

                  {/* <button onClick={() => clerk.openSignIn({})}> */}
                  {/* <Link style={{ backgroundColor: "rgb(67, 179,141)" }}
                    to="/signin"
                    // to=""
                    className="px-3 py-2 text-white rounded-lg transition"
                  >
                    Log In
                  </Link> */}
                  {/* </button> */}

                  {/* <button onClick={() => clerk.openSignUp({})}> */}
                  <Link style={{ backgroundColor: "rgb(67, 179,141)" }}
                    to="/signin"
                    // to=""
                    className="flex items-center px-3 py-2 text-white rounded-lg transition"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In
                  </Link>
                  {/* </button> */}
                </>
              )
            }
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Home</Link>
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Features</a>
              <a href="#subjects" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Subjects</a>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">AI Assistance</Link>
              <Link to="/signin" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition">Log In</Link>
              <Link to="/signup" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}