import React, { useEffect, useState, useRef } from "react";
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
  Rocket,
  Eye,
  EyeOff,
  BotMessageSquareIcon,
  FolderClock,
  Layers3,
  Trash2,
  BadgeAlert,
  RotateCw,
  FileText,
  X,
  SidebarClose,
  SidebarOpen,
  Plus,
} from "lucide-react";

import { motion } from 'framer-motion';

import axios from "axios";
import ImageUpload from "../components/ImageUpload";
import PDFChat from "../components/PDFChat";
import ChatHistory from "../components/ChatHistory";
import MarkdownDisplay from "../components/MarkdownDisplay";
import { auth } from "../config/firebaseConfig";
// import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
// import uuid from 'uuid';
import { v4 as uuidv4 } from "uuid";
import SubscriptionModal from "../components/SubscriptionModal";
// cleck importations
import { UserButton, useUser } from '@clerk/clerk-react';
import PDFPreview from "../components/PDFPreview";

interface ChatHistory {
  grade: number;
  subject: string;
  messages: Array<{
    text: string;
    isAI: boolean;
    timestamp: string;
  }>;
}

interface chatH {
  email: string;
  id: number;
  subject: string;
  prompt: string;
  data: string;
  timestamp: string;
}

// Add new interface for course data
interface CourseData {
  _id: string;
  grade: string;
  courseName: string;
  accuracy: string;
  courseDescription: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {

  // default dashboard msg at the top
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI tutor. Please select a grade and subject to begin learning!",
      isAI: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [reinput, setReinput] = useState("");
  const [expandedGrade, setExpandedGrade] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    grade: number;
    course: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPDFChat, setShowPDFChat] = useState(false);
  // const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [OchatHistory, setOChatHistory] = useState<chatH[]>([]);
  const [userProfile, setuserProfile] = useState<{
    email: string;
    uid: string;
    profile: string;
  } | null>();
  const [isBlurred, setIsBlurred] = useState(true);
  const [user_current_grade, setuser_current_grade] = useState();
  const [userEmail, setuserEmail] = useState<string | undefined>("");
  const [userID, setuserID] = useState("");
  const [renderNewCreditValue, setRenderNewCreditValue] = useState(false);
  const [userCurrentCredit, setUserCurrentCredit] = useState<string>("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [currentUsername, setCurrentUsername] = useState<string | undefined>("");
  const [isUsernameVisible, setIsUsernameVisible] = useState(false);
  const navigate = useNavigate();
  const creditVisibility: boolean = true;
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const [showPDFSidebar, setShowPDFSidebar] = useState(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(true);

  // const CHAPA_SECRET_KEY = import.meta.env.VITE_CHAPA_SECRET_KEY;
  // const userCurrentCreditRef = useRef<string>("");

  // clerk config
  const { isSignedIn, user, signOut } = useUser();
  // console.log("may be this is the username: ", user?.emailAddresses[0].emailAddress);

  // fetch the users grade using useEffect from localStorage
  useEffect(() => {
    // get user grade level to render the courses crosponding go user onboarding data
    const user_current_grade = JSON.parse(
      localStorage.getItem("user") as string
    );
    setuser_current_grade(user_current_grade.user_grade_level);
  }, [])



  // handle to get the user info
  useEffect(() => {

    // to get the username when the page load
    setCurrentUsername(user?.emailAddresses[0].emailAddress as string);

    // invok this function to get the current user id
    getCurrentUserId();

    // get the history from localstorage and set for "setOChatHistory" when the page start in this useEffect hook
    const user_History = JSON.parse(
      localStorage.getItem("chatHistory") as string
    );
    setOChatHistory(user_History);
    // console.log(user_History);
    const userData = localStorage.getItem("user");
    if (userData) {
      setuserProfile(JSON.parse(userData));
    }
    console.log("selected course now live:", selectedCourse?.course)
  }, [input, selectedCourse?.course]);

  // get current user id
  const getCurrentUserId = () => {
    // Assuming 'user' is defined somewhere in the component
    const email = user?.emailAddresses[0].emailAddress;
    setuserEmail(email);
    console.log("user email: " + email);

    axios
      .get(`http://localhost:8888/api/v1/onboard?email=${email}`)
      .then((response) => {
        const userData = response.data;

        // Filter the user data to find the current user's credit
        const currentUserData = userData.find((user: { email: string; }) => user.email === email);
        console.log("dashboard credit: ", currentUserData?.credit); // Use optional chaining

        if (currentUserData) {
          setUserCurrentCredit(currentUserData.credit);
          setuserID(currentUserData._id);
        } else {
          setUserCurrentCredit("0");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Add useEffect to fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/v1/getAllCourses');
        if (response.data.message === 'success') {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const user_gradeLevel = user_current_grade || "grade6";

  // Filter and group courses by grade
  const groupedCourses = courses.reduce((acc, course) => {
    const grade = course.grade; // Don't parse as integer, keep as string
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push({
      name: course.courseName,
      icon: "📚", // Default icon, you can customize based on subject
      description: course.courseDescription,
      accuracy: course.accuracy
    });
    return acc;
  }, {} as Record<string, Array<{ name: string; icon: string; description: string; accuracy: string }>>);

  // Create grades array from grouped courses
  const grades = Object.keys(groupedCourses).map(grade => ({
    level: grade, // Keep as string
    courses: groupedCourses[grade]
  }));

  // handle the blue effect
  const toggleBlur = () => {
    setIsBlurred((prev) => !prev);
  };

  // Add the token calculator function
  function countTokens(input: string): number {
    const tokenize = (text: string) => text.match(/\b[\w']+\b/g) || [];
    const tokens = tokenize(input || '');
    return tokens.length;
  }

  const handleSend = async (e: React.FormEvent) => {
    console.log("Current user credit: ", userCurrentCredit);
    e.preventDefault();
    if (input.trim() && selectedCourse) {
      const userMessage = `${input}`;
      setMessages([...messages, { text: userMessage, isAI: false }]);
      setInput("");
      setIsLoading(true);
      setReinput(input);

      if (Number(userCurrentCredit) <= 0) {
        setShowSubscriptionModal(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:9000/api/tuned-model/generate",
          {
            subject: selectedCourse?.course,
            question: input,
            grade: user_gradeLevel,
          }
        );

        const aiResponse = response.data.answer;
        console.log(aiResponse);

        if (aiResponse) {
          const chatHistoryData = {
            email: currentUsername,
            id: uuidv4(),
            subject: selectedCourse.course,
            prompt: input,
            data: aiResponse,
            timestamp: new Date().toISOString(),
          };
          let drophistory =
            JSON.parse(localStorage.getItem("chatHistory") as string) || [];
          drophistory.push(chatHistoryData);
          localStorage.setItem("chatHistory", JSON.stringify(drophistory));
        }

        // Calculate tokens for request and response
        const requestTokens = countTokens(input);
        const responseTokens = countTokens(aiResponse);
        // const totalTokens = requestTokens + responseTokens;
        // MAKE ZERO FOT THE USER REQ TOKEN CAUSE THAT IS MORE COMSUMING
        const totalTokens = 0 + responseTokens;

        // Deduct credits based on total tokens
        await axios
          .put(`http://localhost:8888/api/v1/onboard/credit/${userID}`, {
            tokensUsed: totalTokens,
          })
          .then((result) => {
            console.log(result.data.remainingCredits);
            setUserCurrentCredit(result.data.remainingCredits);
            setRenderNewCreditValue((prev) => !prev);
          })
          .catch((err) => {
            console.log(err);
          });

        setMessages((prev) => [
          ...prev,
          { text: aiResponse, isAI: true },
        ]);
        if (!showIcons) {
          setShowIcons(true);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, there was an error processing your request.",
            isAI: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  // handle the chat history

  const handleChatHistory = (his) => {
    // here i just want to set the chat history data to the user input state and the response state, his prop has the data of the chat history like propmts, responses and timestamps
    setInput(his.prompt);
    setMessages([
      { text: `You: ${his.prompt}`, isAI: true },
      { text: his.data, isAI: true },
    ]);
  };

  // to handle refresh the chat area
  const handleRefreshChatHistory = () => {
    // i just want to fresh the chat history to detect the new one, instead of refreshing the page manually
    setOChatHistory(
      JSON.parse(localStorage.getItem("chatHistory") as string) || []
    );
  };

  // handle to delete the chat history
  const handleDeleteChatHistory = (his) => {
    try {
      const userPermission = window.confirm(
        "Are you sure you want to delete this chat history?"
      );
      if (userPermission) {
        // here i want to remove the chat history data from the localstorage
        let drophistory =
          JSON.parse(localStorage.getItem("chatHistory") as string) || [];
        drophistory = drophistory.filter(
          (chat: any) => chat.timestamp !== his.timestamp
        );
        localStorage.setItem("chatHistory", JSON.stringify(drophistory));
        setOChatHistory(drophistory);
      } else {
        null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePDFMessage = (message: { text: string; isAI: boolean }) => {
    setMessages((prev) => [...prev, message]);
  };

  const handlePDFTextSelection = (text: string, action: string) => {
    let prompt = '';
    switch (action) {
      case 'explain':
        prompt = `Please explain this text from the PDF: "${text}"`;
        break;
      case 'describe':
        prompt = `Please describe this text from the PDF: "${text}"`;
        break;
      case 'summarize':
        prompt = `Please summarize this text from the PDF: "${text}"`;
        break;
      case 'analyze':
        prompt = `Please analyze this text from the PDF: "${text}"`;
        break;
      default:
        prompt = text;
    }
    setInput(prompt);
    handleSend(new Event('submit') as any);
  };

  const handleCourseSelect = (grade: number, course: string) => {
    setSelectedCourse({ grade, course });
    setMessages([
      {
        text: `Welcome to Grade ${grade.toString().replace("grade", "")} ${course}! How can I help you today?`,
        isAI: true,
      },
    ]);
    setShowPDFPreview(true);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // handle logout
  const handleLogouts = async () => {
    handleLogout();
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
  };

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

  // sample payment test
  // const handlePayment = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:8888/api/v1/initialize',
  //       {
  //         amount: "5000",
  //         currency: "ETB",
  //         email: "sample@gmail.com",
  //         tx_ref: "test" + new Date().getMilliseconds().toString(),
  //         callback_url: "https://www.google.com",
  //         return_url: "https://www.google.com"
  //       }
  //     );

  //     // Check if we have a successful response with checkout URL
  //     if (response.data.status === 'success' && response.data.data.checkout_url) {
  //       // Redirect to the checkout URL
  //       window.location.href = response.data.data.checkout_url;
  //     } else {
  //       console.error('Payment initialization failed:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //   }
  // }

  const toggleUsernameVisibility = () => {
    setIsUsernameVisible(!isUsernameVisible);
  };

  // PDF handling functions
  const handlePDFSelect = (file: File) => {
    setSelectedPDF(file);
    const url = URL.createObjectURL(file);
    setPdfURL(url);
  };

  const handleClosePDFPreview = () => {
    if (pdfURL) {
      URL.revokeObjectURL(pdfURL);
    }
    setShowPDFPreview(false);
    setSelectedPDF(null);
    setPdfURL(null);
  };

  const togglePDFSidebar = () => {
    setShowPDFSidebar(!showPDFSidebar);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfURL) {
        URL.revokeObjectURL(pdfURL);
      }
    };
  }, [pdfURL]);

  // Function to handle starting a new chat
  const handleNewChat = () => {
    if (selectedCourse) {
      setMessages([
        {
          text: `Welcome to Grade ${selectedCourse.grade} ${selectedCourse.course}! How can I help you today?`,
          isAI: true,
        },
      ]);
      setInput("");
    }
  };

  return (
    <>
      <Header creditVisibility={creditVisibility} RerenderToUpdateCredit={renderNewCreditValue} />
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-lg">
            {/* Grade Levels and Courses Section */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h2 className="flex gap-2 items-center text-base font-semibold text-gray-800 dark:text-white mb-4">
                <Layers3 className="w-5 h-5 text-blue-500" />
                Grade Levels
              </h2>
              <div className="space-y-2">
                {grades.map(
                  (g) =>
                    g.level === user_gradeLevel && (
                      <div key={g.level} className="rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() =>
                            setExpandedGrade(
                              expandedGrade === g.level ? null : g.level
                            )
                          }
                          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            Grade {g.level.replace('grade', '')}
                          </span>
                          {expandedGrade === g.level ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {expandedGrade === g.level && (
                          <div className="pl-3 py-1 bg-gray-50/50 dark:bg-gray-800/50">
                            {g.courses.map((course) => (
                              <button
                                key={course.name}
                                onClick={() => {
                                  handleCourseSelect(g.level, course.name);
                                  console.log(course.name);
                                }}
                                className={`w-full flex items-center space-x-2 p-2 text-left rounded-md transition-all duration-200 ${
                                  selectedCourse?.grade === g.level &&
                                  selectedCourse?.course === course.name
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                <span className="text-base">{course.icon}</span>
                                <span className="text-sm font-medium">{course.name}</span>
                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  {course.accuracy}%
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                )}

                {/* Quiz and Progress Link */}
                <Link
                  to="/quize-and-progress"
                  className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5"
                >
                  <p className="text-sm font-medium">Take a Quiz</p>
                  <Rocket className="ml-2 w-4 h-4" />
                </Link>

                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <button
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FolderClock className="h-5 w-5 text-blue-500" />
                      <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                        Chat History
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshChatHistory();
                        }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <RotateCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {showChatHistory ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {showChatHistory && (
                    <div className="mt-2 space-y-1.5">
                      {OchatHistory?.map((his, index) => (
                        his?.email === currentUsername && (
                          <div
                            key={his?.timestamp}
                            className="group relative rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <button
                              onClick={() => handleChatHistory(his)}
                              className="w-full flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                                {index + 1}. {his?.data.slice(0, 20)}...
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChatHistory(his);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </button>
                          </div>
                        )
                      ))}

                      {OchatHistory?.length === 0 && (
                        <div className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                          <p className="text-xs text-gray-500 dark:text-gray-400">No chat history found</p>
                          <BadgeAlert className="w-4 h-4 ml-2 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between gap-2">
                {isSignedIn && (
                  <>
                    <div className="flex items-center gap-2">
                      <button onClick={handleLogout}>
                        <UserButton />
                      </button>
                      <div className={`relative ${!isUsernameVisible ? 'blur-sm' : ''}`}>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{currentUsername}</span>
                        <button
                          className="absolute -right-5 top-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          onClick={toggleUsernameVisibility}
                        >
                          {isUsernameVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex">
            <div className={`flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${showPDFPreview && showPDFSidebar ? 'mr-96' : ''} transition-all duration-300`}>
              {/* Selected Course Header */}
              {selectedCourse && (
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCourse.course}
                  </h2>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div className="max-w-[80%]">
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          message.isAI
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        }`}
                      >
                        <MarkdownDisplay markdownText={message.text} />
                      </div>

                      {message.isAI && (
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleSpeak(message.text.replace(/[#*]{1,3}/g, ""))}
                            onDoubleClick={() => handleStopSpeak()}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            title="Listen or double click to stop"
                          >
                            <Volume2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleCopyText(message.text)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            title="Copy"
                          >
                            <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleRegenerateResponse()}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="max-w-[60%]">
                    <div className="animate-pulse space-y-3">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSend}
                className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Upload image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Start new chat"
                    disabled={!selectedCourse}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      selectedCourse
                        ? "Ask anything about this course..."
                        : "Select a course to start chatting..."
                    }
                    disabled={!selectedCourse || isLoading}
                    className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!selectedCourse || isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm font-medium">Send</span>
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* PDF Preview Sidebar */}
            {showPDFPreview && (
              <div className={`fixed right-0 top-16 bottom-0 w-96 transform transition-transform duration-300 ${showPDFSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="relative h-full">
                  <button
                    onClick={togglePDFSidebar}
                    className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-l-xl border border-r-0 border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {showPDFSidebar ? <SidebarClose className="h-5 w-5" /> : <SidebarOpen className="h-5 w-5" />}
                  </button>
                  <PDFPreview
                    onClose={handleClosePDFPreview}
                    onFileSelect={handlePDFSelect}
                    selectedFile={selectedPDF}
                    pdfURL={pdfURL}
                    onSendSelectedText={handlePDFTextSelection}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Subscription Modal */}
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
            remainingCredits={Number(userCurrentCredit)}
          />
        </div>
      </div>
    </>
  );
}