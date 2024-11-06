import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Menu, X, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // handle sing out
  const handleLogOut = async () => {
    const user_confirmation = window.confirm("are you shure you want to logout?")
    if (user_confirmation) {
      try {
        signOut(auth).then(async () => {
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
    <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">ExtreamX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Home</Link>
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Features</a>
            <a href="#subjects" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">Subjects</a>
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition">AI Assistance</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {
              localStorage.getItem('token') ? (
                <p onClick={() => handleLogOut()} className="flex cursor-pointer items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                  <LogOut className="h-4 w-4 mr-2" />
                  SignOut
                </p>
              ) : (
                <>
                  <Link to="/signin" className="px-4 py-2 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition">
                    Log In
                  </Link>
                  <Link to="/signup" className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
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