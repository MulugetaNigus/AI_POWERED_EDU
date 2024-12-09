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
} from "lucide-react";

import axios from "axios";
import ImageUpload from "../components/ImageUpload";
import PDFChat from "../components/PDFChat";
import ChatHistory from "../components/ChatHistory";
import MarkdownDisplay from "../components/MarkdownDisplay";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideAI from "../components/SideAI";
// import uuid from 'uuid';
import { v4 as uuidv4 } from "uuid";
import { initializePayment } from "../services/paymentService";
import SubscriptionModal from "../components/SubscriptionModal";



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
  id: number;
  subject: string;
  prompt: string;
  data: string;
  timestamp: string;
}

export default function Dashboard() {
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
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [OchatHistory, setOChatHistory] = useState<chatH[]>([]);
  const [userProfile, setuserProfile] = useState<{
    email: string;
    uid: string;
    profile: string;
  } | null>();
  const [isBlurred, setIsBlurred] = useState(true);
  const [showSideAI, setShowSideAI] = useState(false);
  const [user_current_grade, setuser_current_grade] = useState();
  const [userEmail, setuserEmail] = useState("");
  const [userID, setuserID] = useState("");
  const [renderNewCreditValue, setRenderNewCreditValue] = useState(false);
  const [userCurrentCredit, setUserCurrentCredit] = useState<string>("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const navigate = useNavigate();
  const creditVisibility: boolean = true;
  const CHAPA_SECRET_KEY = import.meta.env.VITE_CHAPA_SECRET_KEY;
  const userCurrentCreditRef = useRef<string>("");


  // handle to get the user info
  useEffect(() => {

    // invok this function to get the current user id
    getCurrentUserId();

    // get user grade level to render the courses crosponding go user onboarding data
    const user_current_grade = JSON.parse(
      localStorage.getItem("user") as string
    );
    setuser_current_grade(user_current_grade.user_grade_level);

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
  }, []);

  // get current user id
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    setuserEmail(user.email);
    axios
      .get(`http://localhost:8888/api/v1/onboard?email=${userEmail}`)
      .then((response) => {
        const userData = response.data;
        console.log(userData[0].credit);
        setUserCurrentCredit(userData[0].credit);
        setuserID(userData[0]._id || null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const user_gradeLevel = user_current_grade || 6;
  const grades = [
    {
      level: 6,
      courses: [
        { name: "Mathematics", icon: "📐" },
        { name: "English", icon: "📚" },
        { name: "Social Studies", icon: "🌍" },
        { name: "Civics and Ethics", icon: "🔬" },
      ],
    },
    {
      level: 8,
      courses: [
        { name: "Mathematics", icon: "📊" },
        { name: "Chemistry", icon: "⚗️" },
        { name: "Physics", icon: "📖" },
        { name: "Civics", icon: "🏛️" },
        { name: "Social Studies", icon: "💻" },
        { name: "Biology", icon: "🌱" },
        { name: "English", icon: "📖" },
      ],
    },
    {
      level: 12,
      courses: [
        { name: "Mathematics", icon: "🔢" },
        { name: "Chemistry", icon: "🧪" },
        { name: "Physics", icon: "⚡" },
        { name: "Biology", icon: "🧬" },
        { name: "Geography", icon: "🗺️" },
        { name: "Agriculture", icon: "📝" },
        { name: "Economics", icon: "📝" },
        { name: "History", icon: "📝" },
        { name: "IT", icon: "📝" },
      ],
    },
  ];

  const toggleSideAI = () => {
    setShowSideAI(!showSideAI);
  };

  // handle the blue effect
  const toggleBlur = () => {
    setIsBlurred((prev) => !prev);
  };

  const handleSend = async (e: React.FormEvent) => {
    console.log("Current user credit: ", userCurrentCredit)
    e.preventDefault();
    if (input.trim() && selectedCourse) {
      const userMessage = `${input}`;
      setMessages([...messages, { text: userMessage, isAI: false }]);
      // Update chat history
      // updateChatHistory(selectedCourse.grade, selectedCourse.course, {
      //   text: input,
      //   isAI: false,
      //   timestamp: new Date().toISOString()
      // });
      setInput("");
      setIsLoading(true);
      setReinput(input);

      // before calling my ai endpoint for getting a respnse i just want you to add a little bit checking for the user credit > 0 using the local state  = userCurrentCredit
      // if the userCurrentCredit is less than 0 i want to show the modal to the user to subscribe if user say yes i want to redirect to the subscription page unless stay here 
      if (Number(userCurrentCredit) <= 0) {
        setShowSubscriptionModal(true);
        setIsLoading(false);
        return;
      }

      try {
        // const response = await axios.post(
        //   "http://localhost:3000/process-file",
        //   {
        //     subject: "algorithm",
        //     prompt: input,
        //   }
        // );

        // const response = await axios.post("http://127.0.0.1:8000/process_pdf", {
        //   // subject: "flutter",
        //   question: input,
        // });

        // https://python-gemini-doc-backend.onrender.com
        // Ngrok endpoints to tunnel = https://8d30-102-213-69-44.ngrok-free.app
        const response = await axios.post(
          "https://python-gemini-doc-backend.onrender.com/process_pdf",
          {
            // subject: "flutter",
            question: input,
          }
        );

        console.log(response.data.answer);
        // if response.data id true i want to store the user subject, prompt and the response data in localstorage for the chat history purpose
        if (response.data.answer) {
          const chatHistoryData = {
            id: uuidv4(),
            subject: selectedCourse.course,
            prompt: input,
            data: response.data.answer,
            timestamp: new Date().toISOString(),
          };
          let drophistory =
            JSON.parse(localStorage.getItem("chatHistory") as string) || [];
          drophistory.push(chatHistoryData);
          localStorage.setItem("chatHistory", JSON.stringify(drophistory));
        }

        // every successfull ai response i want to call this endpoint to update the credit of the user, endpoint = http://localhost:8888/onboard/credit/:id
        await axios.put(`http://localhost:8888/api/v1/onboard/credit/${userID}`)
          .then((result => {
            console.log(result.data.remainingCredits)
            setUserCurrentCredit(result.data.remainingCredits)
            setRenderNewCreditValue(true)
          })).catch((err) => {
            console.log(err);
          });

        setMessages((prev) => [
          ...prev,
          { text: response.data.answer, isAI: true },
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

  // const updateChatHistory = (
  //   grade: number,
  //   subject: string,
  //   message: { text: string; isAI: boolean; timestamp: string }
  // ) => {
  //   setChatHistory((prev) => {
  //     const existingChat = prev.find(
  //       (chat) => chat.grade === grade && chat.subject === subject
  //     );

  //     if (existingChat) {
  //       return prev.map((chat) =>
  //         chat.grade === grade && chat.subject === subject
  //           ? { ...chat, messages: [...chat.messages, message] }
  //           : chat
  //       );
  //     } else {
  //       return [
  //         ...prev,
  //         {
  //           grade,
  //           subject,
  //           messages: [message],
  //         },
  //       ];
  //     }
  //   });
  // };

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
      {
        text: `Welcome to Grade ${grade} ${course}! How can I help you today?`,
        isAI: true,
      },
    ]);
  };

  // handle logout
  const handleLogOut = async () => {
    const user_confirmation = window.confirm(
      "are you shure you want to logout?"
    );
    if (user_confirmation) {
      try {
        signOut(auth)
          .then(async () => {
            localStorage.removeItem("token");
            navigate("/signin");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      null;
    }
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
  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:8888/api/v1/initialize',
        {
          amount: "5000",
          currency: "ETB",
          email: "sample@gmail.com",
          tx_ref: "test" + new Date().getMilliseconds().toString(),
          callback_url: "https://www.google.com",
          return_url: "https://www.google.com"
        }
      );

      // Check if we have a successful response with checkout URL
      if (response.data.status === 'success' && response.data.data.checkout_url) {
        // Redirect to the checkout URL
        window.location.href = response.data.data.checkout_url;
      } else {
        console.error('Payment initialization failed:', response.data);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  }

  return (
    <>
      {showSideAI && <SideAI onClose={() => setShowSideAI(false)} />}
      <a
        className="p-5 bg-blue-600 text-white rounded-full fixed right-2 bottom-20"
        onClick={toggleSideAI}
      >
        <BotMessageSquareIcon className="w-6 h-6 cursor-pointer hover:animate-spin" />
      </a>
      {/* header component */}
      <Header creditVisibility={creditVisibility} RerenderToUpdateCredit={renderNewCreditValue} />
      {/* the rest of the dashboard code here */}
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Grade Levels and Courses Section */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h2 className="flex gap-2 items-center text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <Layers3 className="w-5 h-5" />
                Grade Levels
              </h2>
              <div className="space-y-2">
                {grades.map(
                  (g) =>
                    g.level == user_gradeLevel && (
                      <div key={g.level} className="rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedGrade(
                              expandedGrade === g.level ? null : g.level
                            )
                          }
                          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="font-medium">Grade {g.level}</span>
                          {expandedGrade === g.level ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {expandedGrade === g.level && (
                          <div className="pl-4">
                            {g.courses.map((course) => (
                              <button
                                key={course.name}
                                onClick={() => {
                                  handleCourseSelect(g.level, course.name);
                                  console.log(course.name);
                                }}
                                className={`w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${selectedCourse?.grade === g.level &&
                                  selectedCourse?.course === course.name
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300"
                                  }`}
                              >
                                <span>{course.icon}</span>
                                <span>{course.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                )}

                {/* take a quize and progress page link */}
                <Link
                  to="/quize-and-progress"
                  className="flex items-center justify-start w-full h-12 bg-blue-600 text-white rounded-lg p-4 border-1 border-blue-600 dark:border-gray-700 transition duration-200 ease-in-out hover:bg-blue-700 dark:hover:bg-blue-500"
                >
                  <p>Take a quize</p>
                  <Rocket className="ml-3 w-5 h-5" />
                </Link>
                <button onClick={handlePayment}>pay</button>
                <br />
                <hr className="text-gray-600 font-light" />
                {/* icons to show the chat history and pdf chat */}
                <div className="flex items-center justify-between">
                  <h2 className="ml-1 mt-1 flex gap-2 items-center text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    <FolderClock className="h-5 w-5" />
                    Chat history
                  </h2>
                  <RotateCw
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleRefreshChatHistory()}
                  />
                </div>
                {/* ########################################################### */}
                {OchatHistory.map((his, index) => (
                  <div
                    key={his?.timestamp}
                    className="rounded-lg overflow-hidden"
                  >
                    {/* <ol>
                      <li>{his?.data.slice(0, 20) + "..."}</li>
                    </ol> */}
                    {/* in this btn i just want to add onclick event to show the selected chat history data to the main chat area */}
                    
                    <button
                      // onClick={() => alert(his?.prompt + "\n" + his?.data)}
                      onClick={() => handleChatHistory(his)}
                      className="w-full flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {/* <UserRound className="h-5 w-5" /> */}
                      <p className="text-gray-600 dark:text-gray-300 font-normal">
                        {index + 1}
                        {"."} {his?.data.slice(0, 10) + "..."}
                      </p>
                      <Trash2
                        className="w-5 h-5 text-red-400"
                        onClick={() => handleDeleteChatHistory(his)}
                      />
                    </button>
                    
                  </div>
                ))}
                {/* add the message no history when the "OchatHistory" dont have any data */}
                {OchatHistory.length == 0 && (
                  <div className="flex items-center justify-between w-full h-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-1 border-gray-200 dark:border-gray-700">
                    <p>No chat history found</p>
                    <BadgeAlert className="w-5 h-5" />
                  </div>
                )}
                {/* ########################################################### */}
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
                  {userProfile?.profile == null ? (
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <img
                      src={userProfile?.profile}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    />
                  )}
                  {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userProfile?.email}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs ${isBlurred ? "blur-sm" : ""
                        } text-gray-500 dark:text-gray-400 truncate`}
                    >
                      {userProfile?.uid}
                    </p>
                    <button onClick={toggleBlur} className="ml-2">
                      {isBlurred ? (
                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
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
                <button
                  className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
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
                  className={`flex ${message.isAI ? "justify-start" : "justify-end"
                    }`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`p-4 rounded-lg ${message.isAI
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        : "bg-blue-600 text-white"
                        }`}
                    >
                      <MarkdownDisplay markdownText={message.text} />
                    </div>

                    {/* response from the  */}
                    {message.isAI && (
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            handleSpeak(message.text.replace(/[#*]{1,3}/g, ""))
                          }
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">0.76s</p>
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
                  {/* <button
                    onClick={() => setShowPDFChat(true)}
                    className="w-full flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FileText className="h-5 w-5" />
                  </button> */}
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
                      ? "Ask anything about this course..."
                      : "Select a course to start chatting..."
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

          {/* subscribe modal here */}
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
