import React, { useEffect, useState } from 'react';
import {
  Send,
  ChevronDown,
  ChevronRight,
  LogOut,
  Loader2,
  Volume2,
  Copy,
  RefreshCw,
  ImageIcon,
  FileText,
  Clock,
  Rocket,
  Eye,
  EyeOff,
  Bot,
  BotIcon,
  BotMessageSquare,
  BotMessageSquareIcon
} from 'lucide-react';

import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import PDFChat from '../components/PDFChat';
import ChatHistory from '../components/ChatHistory';
import MarkdownDisplay from '../components/MarkdownDisplay';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideAI from '../components/SideAI';

interface ChatHistory {
  grade: number;
  subject: string;
  messages: Array<{
    text: string;
    isAI: boolean;
    timestamp: string;
  }>;
}

const grades = [
  {
    level: 6,
    courses: [
      { name: 'Grade 6 Mathematics', icon: '📐' },
      { name: 'Grade 6 English', icon: '📚' },
      { name: 'Grade 6 Social Studies', icon: '🌍' },
      { name: 'Grade 6 Civics and Ethics', icon: '🔬' },
    ]
  },
  {
    level: 8,
    courses: [
      { name: 'Grade 8 Mathematics', icon: '📊' },
      { name: 'Grade 8 Chemistry', icon: '⚗️' },
      { name: 'Grade 8 Physics', icon: '📖' },
      { name: 'Grade 8 Civics', icon: '🏛️' },
      { name: 'Grade 8 Social Studies', icon: '💻' },
      { name: 'Grade 8 Biology', icon: '🌱' },
      { name: 'Grade 8 English', icon: '📖' }
    ]
  },
  {
    level: 12,
    courses: [
      { name: 'Grade 12 Mathematics', icon: '🔢' },
      { name: 'Grade 12 Chemistry', icon: '🧪' },
      { name: 'Grade 12 Physics', icon: '⚡' },
      { name: 'Grade 12 Biology', icon: '🧬' },
      { name: 'Grade 12 Geography', icon: '🗺️' },
      { name: 'Grade 12 Agriculture', icon: '📝' },
      { name: 'Grade 12 Economics', icon: '📝' },
      { name: 'Grade 12 History', icon: '📝' },
      { name: 'Grade 12 IT', icon: '📝' },
    ]
  }
];


export default function Dashboard() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI tutor. Please select a grade and subject to begin learning!", isAI: true }
  ]);
  const [input, setInput] = useState('');
  const [reinput, setReinput] = useState('');
  const [expandedGrade, setExpandedGrade] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{ grade: number; course: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPDFChat, setShowPDFChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [userProfile, setuserProfile] = useState<{ email: string; uid: string; profile: string } | null>();
  const [isBlurred, setIsBlurred] = useState(true);
  const [showSideAI, setShowSideAI] = useState(false);
  const navigate = useNavigate();

  // handle to get the user info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setuserProfile(JSON.parse(userData));
    }
    console.log(userData);
  }, [])

  const toggleSideAI = () => {
    setShowSideAI(!showSideAI);
  };

  // handle the blue effect
  const toggleBlur = () => {
    setIsBlurred(prev => !prev); // Toggle the blur state
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && selectedCourse) {
      const userMessage = `${input}`;
      setMessages([...messages, { text: userMessage, isAI: false }]);
      // Update chat history
      updateChatHistory(selectedCourse.grade, selectedCourse.course, {
        text: input,
        isAI: false,
        timestamp: new Date().toISOString()
      });
      setInput('');
      setIsLoading(true);
      setReinput(input);

      try {
        const response = await axios.post('http://localhost:3000/process-file', {
          sybject: "flutter",
          prompt: "what is flutter"
        });

        console.log(response.data);
        setMessages(prev => [
          ...prev,
          { text: response.data.response, isAI: true }
        ]);
        if (!showIcons) {
          setShowIcons(true);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [
          ...prev,
          { text: "Sorry, there was an error processing your request.", isAI: true }
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const updateChatHistory = (
    grade: number,
    subject: string,
    message: { text: string; isAI: boolean; timestamp: string }
  ) => {
    setChatHistory((prev) => {
      const existingChat = prev.find(
        (chat) => chat.grade === grade && chat.subject === subject
      );

      if (existingChat) {
        return prev.map((chat) =>
          chat.grade === grade && chat.subject === subject
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        );
      } else {
        return [
          ...prev,
          {
            grade,
            subject,
            messages: [message],
          },
        ];
      }
    });
  };

  const handlePDFMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
    if (selectedCourse) {
      updateChatHistory(selectedCourse.grade, selectedCourse.course, {
        text: message.text,
        isAI: message.isAI,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleCourseSelect = (grade: number, course: string) => {
    setSelectedCourse({ grade, course });
    setMessages([
      { text: `Welcome to Grade ${grade} ${course}! How can I help you today?`, isAI: true }
    ]);
  };

  // handle logout
  const handleLogOut = async () => {
    const user_confirmation = window.confirm("are you shure you want to logout?")
    if (user_confirmation) {
      try {
        signOut(auth).then(async () => {
          localStorage.removeItem('token');
          signOut(auth).then(async () => {
            localStorage.setItem("auth", "f");
            navigate("/signin");
          }).catch((error) => {
            console.log(error);
          })
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      null
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
  }

  const handleRegenerateResponse = () => {
    setInput(reinput);
  };

  const handleImageAnalysis = (analysis: string) => {
    setMessages((prev) => [
      ...prev,
      { text: "Here's what I see in the image:", isAI: true },
      { text: analysis, isAI: true },
    ]);
    setShowImageUpload(false);
  };

  return (
    <>
      {showSideAI && <SideAI onClose={() => setShowSideAI(false)} />}
      <a className="p-5 bg-blue-600 text-white rounded-full fixed right-2 bottom-20" onClick={toggleSideAI}
      >
        <BotMessageSquareIcon className='w-6 h-6 cursor-pointer hover:animate-spin' />
      </a>
      {/* header component */}
      <Header />
      {/* the rest of the dashboard code here */}
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Grade Levels and Courses Section */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Grade Levels
              </h2>
              <div className="space-y-2">
                {grades.map((grade) => (
                  <div key={grade.level} className="rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedGrade(
                          expandedGrade === grade.level ? null : grade.level
                        )
                      }
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="font-medium">Grade {grade.level}</span>
                      {expandedGrade === grade.level ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedGrade === grade.level && (
                      <div className="pl-4">
                        {grade.courses.map((course) => (
                          <button
                            key={course.name}
                            onClick={() =>
                            {
                              handleCourseSelect(grade.level, course.name);
                              console.log(course.name)
                            }
                          }
                            className={`w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${selectedCourse?.grade === grade.level &&
                              selectedCourse?.course === course.name
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            <span>{course.icon}</span>
                            <span>{course.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {/* take a quize and progress page link */}
                <Link to="/quize-and-progress" className="flex items-center justify-start w-full h-12 bg-blue-600 text-white rounded-lg p-4 border-1 border-blue-600 dark:border-gray-700 transition duration-200 ease-in-out hover:bg-blue-700 dark:hover:bg-blue-500">
                  <p>Take a quize</p>
                  <Rocket className='ml-3 w-5 h-5' />
                </Link>
                {/* Add PDF Chat button */}
                {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowPDFChat(true)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Chat with PDF</span>
                  </button>
                </div> */}
              </div>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  {
                    userProfile?.profile !== null
                      ?
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                      />
                      :
                      <img
                        src={userProfile?.profile}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                      />
                  }
                  {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userProfile?.email}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${isBlurred ? 'blur-sm' : ''} text-gray-500 dark:text-gray-400 truncate`}>
                      {userProfile?.uid}
                    </p>
                    <button onClick={toggleBlur} className="ml-2">
                      {isBlurred ? (
                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />) : (
                        <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button> */}
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  onClick={() => handleLogOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {/* Selected Course Header */}
            {selectedCourse && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCourse.course}
                </h2>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'
                    }`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`p-4 rounded-lg ${message.isAI
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-blue-600 text-white'
                        }`}
                    >
                      <MarkdownDisplay markdownText={message.text} />
                    </div>

                    {/* response from the  */}
                    {message.isAI && (
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleSpeak(message.text.replace(/[#*]{1,3}/g, ""))}
                          onDoubleClick={() => handleStopSpeak()}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          title="Listen or double click to stop"
                        >
                          <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleCopyText(message.text)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleRegenerateResponse()}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* <div className="w-80 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <ChatHistory history={chatHistory} />
                  </div> */}
                </div>
              ))}

              {/* loading state for the AI */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-gray-800 dark:text-gray-200">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* chat window */}
            {showPDFChat && (
              <PDFChat
                onClose={() => setShowPDFChat(false)}
                onMessageSent={handlePDFMessage}
              />
            )}

            {/* Image Upload Area */}
            {showImageUpload && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <ImageUpload
                  onAnalysisComplete={handleImageAnalysis}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="border-t border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex space-x-4">
                <div className="p-4 border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowPDFChat(true)}
                    className="w-full flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="px-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Upload image"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}

                  placeholder={
                    selectedCourse
                      ? 'Ask anything about this course...'
                      : 'Select a course to start chatting...'
                  }
                  disabled={!selectedCourse || isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!selectedCourse || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* chat window */}
          {showPDFChat && (
            <PDFChat
              onClose={() => setShowPDFChat(false)}
              onMessageSent={handlePDFMessage}
            />
          )}
        </div>
      </div>
    </>
  );
}